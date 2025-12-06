/**
 * Auth Entity Types
 * Core domain models and types for authentication.
 * These types represent the API contract and core auth models.
 */

/** Login request payload sent to the API */
export interface LoginRequest {
  user_name: string
  password: string
}

/** API response data structure */
export interface LoginResponseData {
  access_token: string
  refresh_token: string
  user_id: string
  full_name: string
}

/** Full API response wrapper */
export interface LoginApiResponse {
  code: number
  is_succeeded: boolean
  message: string
  data: LoginResponseData | null
}

/** Authenticated user model */
export interface AuthUser {
  id: string
  fullName: string
}

/** Redux auth state */
export interface AuthState {
  user: AuthUser | null
  accessToken: string | null
  refreshToken: string | null
  loading: boolean
  error: string | null
  isAuthenticated: boolean
}

/** Login request payload for Redux action */
export interface LoginPayload {
  user_name: string
  password: string
}

/** Login success payload */
export interface LoginSuccessPayload {
  user: AuthUser
  accessToken: string
  refreshToken: string
}
