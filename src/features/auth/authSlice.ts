import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { AuthState, AuthUser, LoginPayload } from '@/entities/auth/auth.types'
import { authService } from '@/services/auth.service'
import { saveTokens, clearTokens, getAccessToken, getRefreshToken } from '@/shared/utils/token'

// Initial state
const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  loading: false,
  error: null,
  isAuthenticated: false,
}

// Async thunks

/**
 * Login thunk - handles user authentication
 */
export const loginThunk = createAsyncThunk(
  'auth/login',
  async (payload: LoginPayload, { rejectWithValue }) => {
    try {
      const response = await authService.login({
        user_name: payload.user_name,
        password: payload.password,
      })

      if (!response.is_succeeded || !response.data) {
        return rejectWithValue(response.message || 'Login failed')
      }

      const { access_token, refresh_token, user_id, full_name } = response.data

      // Save tokens to localStorage
      saveTokens(access_token, refresh_token)

      return {
        user: {
          id: user_id,
          fullName: full_name,
        } as AuthUser,
        accessToken: access_token,
        refreshToken: refresh_token,
      }
    } catch (error: any) {
      return rejectWithValue(error.message || 'An unexpected error occurred')
    }
  }
)

/**
 * Logout thunk - clears user session
 */
export const logoutThunk = createAsyncThunk('auth/logout', async () => {
  clearTokens()
  // If you have a backend logout endpoint, call it here
  // await authService.logout()
})

/**
 * Check auth thunk - restores session from localStorage on app init
 */
export const checkAuthThunk = createAsyncThunk('auth/checkAuth', async (_, { rejectWithValue }) => {
  try {
    const accessToken = getAccessToken()
    const refreshToken = getRefreshToken()

    if (!accessToken || !refreshToken) {
      return rejectWithValue('No tokens found')
    }

    // TODO: In production, validate token with backend
    // const user = await authService.validateToken(accessToken)
    
    // For now, return a placeholder user
    // In a real app, decode the JWT or call a /me endpoint
    return {
      user: {
        id: 'restored-user',
        fullName: 'Restored User',
      } as AuthUser,
      accessToken,
      refreshToken,
    }
  } catch (error: any) {
    clearTokens()
    return rejectWithValue(error.message || 'Token validation failed')
  }
})

// Slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuth: (state) => {
      state.user = null
      state.accessToken = null
      state.refreshToken = null
      state.isAuthenticated = false
      state.error = null
      clearTokens()
    },
    setUser: (state, action: PayloadAction<AuthUser>) => {
      state.user = action.payload
      state.isAuthenticated = true
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    // Login
    builder.addCase(loginThunk.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(loginThunk.fulfilled, (state, action) => {
      state.loading = false
      state.user = action.payload.user
      state.accessToken = action.payload.accessToken
      state.refreshToken = action.payload.refreshToken
      state.isAuthenticated = true
      state.error = null
    })
    builder.addCase(loginThunk.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload as string
      state.isAuthenticated = false
    })

    // Logout
    builder.addCase(logoutThunk.fulfilled, (state) => {
      state.user = null
      state.accessToken = null
      state.refreshToken = null
      state.isAuthenticated = false
      state.loading = false
      state.error = null
    })

    // Check auth
    builder.addCase(checkAuthThunk.pending, (state) => {
      state.loading = true
    })
    builder.addCase(checkAuthThunk.fulfilled, (state, action) => {
      state.loading = false
      state.user = action.payload.user
      state.accessToken = action.payload.accessToken
      state.refreshToken = action.payload.refreshToken
      state.isAuthenticated = true
    })
    builder.addCase(checkAuthThunk.rejected, (state) => {
      state.loading = false
      state.isAuthenticated = false
    })
  },
})

export const { clearAuth, setUser, clearError } = authSlice.actions
export default authSlice.reducer
