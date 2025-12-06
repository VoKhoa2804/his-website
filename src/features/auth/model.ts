export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResult {
  tokens: {
    accessToken: string
    refreshToken: string
  }
  user: {
    id: string
    username: string
    fullName?: string
    roles?: string[]
  }
}

export interface AuthUser {
  id: string
  username: string
  fullName?: string
  roles?: string[]
}
