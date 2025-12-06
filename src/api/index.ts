/**
 * API Module Exports
 * Central export point for all API-related functionality
 */

export { api, baseApi, setLogoutCallback } from './baseApi'
export { setupInterceptors } from './setupInterceptors'
export type { ApiError, ApiResponse, ExtendedAxiosConfig } from './types'

// Default export for convenience
export { api as default } from './baseApi'
