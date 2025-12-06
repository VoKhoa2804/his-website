/**
 * Base API Module with Axios Interceptors
 * 
 * Architecture:
 * - Centralized Axios instance with request/response interceptors
 * - Automatic JWT token injection from localStorage
 * - Unified error handling and response normalization
 * - 401 auto-refresh token flow with retry mechanism
 * - Network error detection and timeout handling
 * - Type-safe API methods (GET, POST, PUT, DELETE, PATCH)
 * - Integration with Redux auth store for logout on auth failure
 * 
 * Features:
 * - Configurable base URL from environment variables
 * - Request/response logging in development mode
 * - Extensible for retry policies, exponential backoff, request cancellation
 * - Custom headers per request support
 */

import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios'
import type { ApiError, ApiResponse, ExtendedAxiosConfig } from './types'
import { getAccessToken, getRefreshToken, saveTokens, clearTokens } from '@/shared/utils/token'

// Environment configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_AUTH_API_BASE || 'http://localhost:3000'
const REQUEST_TIMEOUT = 15000 // 15 seconds
const IS_DEV = import.meta.env.DEV

// Track if we're currently refreshing to prevent multiple refresh calls
let isRefreshing = false
let failedQueue: Array<{
  resolve: (value?: unknown) => void
  reject: (reason?: unknown) => void
}> = []

/**
 * Process queued requests after token refresh
 */
const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach(promise => {
    if (error) {
      promise.reject(error)
    } else {
      promise.resolve(token)
    }
  })
  failedQueue = []
}

/**
 * Create base Axios instance
 */
const baseApi: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: REQUEST_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
})

/**
 * Request Interceptor
 * - Adds Authorization header with JWT token
 * - Logs requests in development mode
 * - Allows custom headers per request
 */
baseApi.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Skip auth for specific requests
    const extendedConfig = config as ExtendedAxiosConfig
    if (extendedConfig.skipAuth) {
      return config
    }

    // Add Authorization header if token exists
    const token = getAccessToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    // Log request in development
    if (IS_DEV) {
      console.log('🚀 API Request:', {
        method: config.method?.toUpperCase(),
        url: config.url,
        baseURL: config.baseURL,
        params: config.params,
        data: config.data,
      })
    }

    return config
  },
  (error: AxiosError) => {
    if (IS_DEV) {
      console.error('❌ Request Error:', error)
    }
    return Promise.reject(error)
  }
)

/**
 * Response Interceptor
 * - Normalizes successful responses
 * - Handles errors with unified error shape
 * - Auto-refreshes token on 401 errors
 * - Detects network errors and timeouts
 */
baseApi.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log response in development
    if (IS_DEV) {
      console.log('✅ API Response:', {
        status: response.status,
        url: response.config.url,
        data: response.data,
      })
    }

    // Return normalized response data
    return response.data
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as ExtendedAxiosConfig & { _retry?: boolean }

    // Log error in development
    if (IS_DEV) {
      console.error('❌ API Error:', {
        message: error.message,
        status: error.response?.status,
        url: error.config?.url,
        data: error.response?.data,
      })
    }

    // Handle 401 Unauthorized - Auto refresh token
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then(token => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`
            }
            return baseApi(originalRequest)
          })
          .catch(err => Promise.reject(err))
      }

      originalRequest._retry = true
      isRefreshing = true

      const refreshToken = getRefreshToken()

      if (!refreshToken) {
        // No refresh token, logout user
        isRefreshing = false
        processQueue(new Error('No refresh token available'), null)
        handleLogout()
        return Promise.reject(createApiError(error))
      }

      try {
        // Call refresh token endpoint
        const response = await axios.post<ApiResponse<{
          access_token: string
          refresh_token: string
        }>>(
          `${API_BASE_URL}/api/auth/refresh`,
          { refresh_token: refreshToken },
          { skipAuth: true } as ExtendedAxiosConfig
        )

        if (response.data?.is_succeeded && response.data.data) {
          const { access_token, refresh_token } = response.data.data

          // Save new tokens
          saveTokens(access_token, refresh_token)

          // Update authorization header
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${access_token}`
          }

          // Process queued requests
          processQueue(null, access_token)
          isRefreshing = false

          // Retry original request
          return baseApi(originalRequest)
        } else {
          throw new Error('Token refresh failed')
        }
      } catch (refreshError) {
        // Refresh failed, logout user
        processQueue(refreshError as Error, null)
        isRefreshing = false
        handleLogout()
        return Promise.reject(createApiError(error))
      }
    }

    // Skip custom error handling if requested
    if (originalRequest?.skipErrorHandling) {
      return Promise.reject(error)
    }

    // Create unified error object
    const apiError = createApiError(error)
    return Promise.reject(apiError)
  }
)

/**
 * Create unified API error object
 */
function createApiError(error: AxiosError): ApiError {
  // Network error (no response)
  if (!error.response) {
    if (error.code === 'ECONNABORTED') {
      return {
        message: 'Request timeout. Please check your connection and try again.',
        status: 408,
        code: 'TIMEOUT',
        originalError: error,
      }
    }

    if (error.message === 'Network Error') {
      return {
        message: 'Network error. Please check your internet connection.',
        status: 0,
        code: 'NETWORK_ERROR',
        originalError: error,
      }
    }

    return {
      message: error.message || 'An unexpected error occurred',
      status: 0,
      code: 'UNKNOWN_ERROR',
      originalError: error,
    }
  }

  // Server responded with error
  const response = error.response
  const data = response.data as Record<string, unknown>

  // Backend API format: { message, is_succeeded, code, data }
  if (data && typeof data === 'object') {
    const errorMessage = (data as Record<string, unknown>).message || (data as Record<string, unknown>).error
    const errorCode = (data as Record<string, unknown>).code || (data as Record<string, unknown>).errorCode
    const errors = (data as Record<string, unknown>).errors || (data as Record<string, unknown>).data
    
    return {
      message: typeof errorMessage === 'string' ? errorMessage : error.message || 'An error occurred',
      status: response.status,
      code: typeof errorCode === 'string' || typeof errorCode === 'number' ? errorCode : response.status,
      errors,
      originalError: error,
    }
  }

  // Plain text error
  if (typeof data === 'string') {
    return {
      message: data,
      status: response.status,
      code: response.status,
      originalError: error,
    }
  }

  // Fallback
  return {
    message: error.message || 'An unexpected error occurred',
    status: response.status,
    code: response.status,
    originalError: error,
  }
}

/**
 * Handle logout (to be called from Redux store)
 * This is a placeholder - will be set up by setupInterceptors
 */
let logoutCallback: (() => void) | null = null

export const setLogoutCallback = (callback: () => void) => {
  logoutCallback = callback
}

function handleLogout() {
  clearTokens()
  if (logoutCallback) {
    logoutCallback()
  } else {
    // Fallback: redirect to login
    if (typeof window !== 'undefined') {
      window.location.href = '/login'
    }
  }
}

/**
 * HTTP Methods - Typed wrappers around Axios instance
 */

export const api = {
  /**
   * GET request
   */
  get: <T = unknown>(url: string, config?: ExtendedAxiosConfig): Promise<T> => {
    return baseApi.get<T, T>(url, config)
  },

  /**
   * POST request
   */
  post: <T = unknown>(url: string, data?: unknown, config?: ExtendedAxiosConfig): Promise<T> => {
    return baseApi.post<T, T>(url, data, config)
  },

  /**
   * PUT request
   */
  put: <T = unknown>(url: string, data?: unknown, config?: ExtendedAxiosConfig): Promise<T> => {
    return baseApi.put<T, T>(url, data, config)
  },

  /**
   * PATCH request
   */
  patch: <T = unknown>(url: string, data?: unknown, config?: ExtendedAxiosConfig): Promise<T> => {
    return baseApi.patch<T, T>(url, data, config)
  },

  /**
   * DELETE request
   */
  delete: <T = unknown>(url: string, config?: ExtendedAxiosConfig): Promise<T> => {
    return baseApi.delete<T, T>(url, config)
  },
}

// Export the base instance for advanced usage
export { baseApi }
export default api
