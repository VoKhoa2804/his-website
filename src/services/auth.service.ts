/**
 * Auth Service
 * Handles all authentication-related API calls.
 * Communicates with the backend auth endpoints.
 */

import type { LoginRequest, LoginApiResponse } from '@/entities/auth/auth.types'

const AUTH_API_BASE = import.meta.env.VITE_AUTH_API_BASE as string

if (!AUTH_API_BASE) {
  console.warn('VITE_AUTH_API_BASE is not set in environment variables')
}

/** Login via username and password */
export async function login(payload: LoginRequest): Promise<LoginApiResponse> {
  try {
    const response = await fetch(`${AUTH_API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    const data: LoginApiResponse = await response.json()

    // Handle HTTP errors
    if (!response.ok) {
      const errorMessage = data.message || `HTTP ${response.status}: ${response.statusText}`
      throw new Error(errorMessage)
    }

    // Handle API-level errors
    if (!data.is_succeeded) {
      throw new Error(data.message || 'Login failed')
    }

    return data
  } catch (error) {
    // Re-throw with friendly message
    if (error instanceof Error) {
      throw new Error(error.message)
    }
    throw new Error('An unexpected error occurred during login')
  }
}

export const authService = {
  login,
}

      id: '',
      username: payload.username,
      fullName: payload.username,
      roles: [],
    };

    return { tokens, user };
  },
};
