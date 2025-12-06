import { useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { loginThunk, logoutThunk, clearAuth } from '../authSlice'
import type { LoginPayload } from '@/entities/auth/auth.types'

/**
 * Custom hook for auth operations
 * Provides a clean API for authentication actions
 */
export function useAuth() {
  const dispatch = useAppDispatch()
  const { user, isAuthenticated, loading, error } = useAppSelector((state) => state.auth)

  const login = useCallback(
    async (credentials: LoginPayload) => {
      return dispatch(loginThunk(credentials)).unwrap()
    },
    [dispatch]
  )

  const logout = useCallback(() => {
    dispatch(logoutThunk())
  }, [dispatch])

  const clearAuthState = useCallback(() => {
    dispatch(clearAuth())
  }, [dispatch])

  return {
    user,
    isAuthenticated,
    loading,
    error,
    login,
    logout,
    clearAuthState,
  }
}
