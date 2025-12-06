/**
 * Auth Service (Updated to use baseApi)
 * Handles all authentication-related API calls using the centralized API module
 */

import { api } from '@/api'
import type { ApiResponse } from '@/api'
import type { LoginRequest, LoginApiResponse } from '@/entities/auth/auth.types'

const AUTH_API_BASE = import.meta.env.VITE_AUTH_API_BASE as string

if (!AUTH_API_BASE) {
  console.warn('VITE_AUTH_API_BASE is not set in environment variables')
}

/** Login via username and password */
export async function login(payload: LoginRequest): Promise<LoginApiResponse> {
  // Using baseApi with skipAuth for login endpoint
  const response = await api.post<LoginApiResponse>(
    '/api/logins',
    {
      ...payload,
      app_name: 'Patients',
    },
    { skipAuth: true } // Skip adding Authorization header for login
  )

  return response
}

/**
 * Refresh access token
 */
export async function refreshToken(refreshToken: string): Promise<ApiResponse<{
  access_token: string
  refresh_token: string
}>> {
  const response = await api.post<ApiResponse<{
    access_token: string
    refresh_token: string
  }>>(
    '/api/auth/refresh',
    { refresh_token: refreshToken },
    { skipAuth: true }
  )

  return response
}

/**
 * Logout (optional backend call)
 */
export async function logout(): Promise<void> {
  try {
    await api.post('/api/auth/logout')
  } catch (error) {
    // Logout should succeed even if backend call fails
    console.warn('Logout API call failed:', error)
  }
}

/**
 * Get current user info
 */
export async function getCurrentUser() {
  const response = await api.get<ApiResponse<{
    user_id: string
    full_name: string
    email?: string
    roles?: string[]
  }>>('/api/auth/me')
  return response
}

export const authService = {
  login,
  refreshToken,
  logout,
  getCurrentUser,
}
