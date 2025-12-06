/**
 * API Types
 * Common types for API requests and responses
 */

import type { AxiosError, AxiosRequestConfig } from 'axios'

/**
 * Standardized API response wrapper
 */
export interface ApiResponse<T = any> {
  code: number
  is_succeeded: boolean
  message: string | null
  data: T | null
}

/**
 * Standardized API error shape
 */
export interface ApiError {
  message: string
  status?: number
  code?: string | number
  errors?: Record<string, string[]> | any
  originalError?: any
}

/**
 * Extended Axios config with custom options
 */
export interface ExtendedAxiosConfig extends AxiosRequestConfig {
  skipAuth?: boolean // Skip adding Authorization header
  skipErrorHandling?: boolean // Skip global error handling
}

/**
 * Refresh token response
 */
export interface RefreshTokenResponse {
  access_token: string
  refresh_token: string
  expires_in: number
}
