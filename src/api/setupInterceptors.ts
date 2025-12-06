/**
 * Setup API Interceptors with Redux Store
 * 
 * This module integrates the baseApi with Redux store
 * to handle automatic logout on authentication failures
 */

import type { AppDispatch } from '@/app/store'
import { logoutThunk } from '@/features/auth/authSlice'
import { setLogoutCallback } from './baseApi'

/**
 * Setup interceptors with Redux store
 * Call this once in your app initialization (e.g., main.tsx)
 * 
 * @param dispatch - Redux dispatch function
 */
export function setupInterceptors(dispatch: AppDispatch) {
  // Set logout callback for baseApi
  setLogoutCallback(() => {
    // Dispatch Redux logout action
    dispatch(logoutThunk())
  })
}
