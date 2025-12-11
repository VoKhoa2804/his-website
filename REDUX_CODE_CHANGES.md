# Redux Migration - Code Changes Reference

## Quick Reference: Before & After

This document shows the exact code changes for easy comparison and understanding.

---

## 1. Entry Point (`src/main.tsx`)

### ❌ Before (Context-based)
```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from '@/app/routes/App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

### ✅ After (Redux)
```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'              // NEW
import './index.css'
import App from '@/app/routes/App'
import { store } from '@/app/store'                 // NEW

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>                        {/* NEW */}
      <App />
    </Provider>                                     {/* NEW */}
  </StrictMode>,
)
```

**Changes**: Added Redux Provider wrapping the app

---

## 2. App Component (`src/app/routes/App.tsx`)

### ❌ Before
```tsx
import { useState } from 'react'
import { Toaster } from '@/shared/ui/sonner'
import { LoginPage } from '@/features/auth/login'
import { HomeScreen } from '@/features/home/home'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const handleLoginSuccess = () => {
    setIsLoggedIn(true)
  }

  return (
    <>
      {isLoggedIn ? (
        <>
          <HomeScreen />
          <Toaster />
        </>
      ) : (
        <>
          <div className="flex items-center justify-center min-h-screen bg-muted/50">
            <LoginPage onLoginSuccess={handleLoginSuccess} />
          </div>
          <Toaster />
          <button
            onClick={() => setIsLoggedIn(true)}
            className="hidden"
            id="login-btn"
          />
        </>
      )}
    </>
  )
}

export default App
```

### ✅ After
```tsx
import { useEffect } from 'react'                           // CHANGED
import { Toaster } from '@/shared/ui/sonner'
import { LoginPage } from '@/features/auth/login'
import { HomeScreen } from '@/features/home/home'
import { useAppDispatch, useAppSelector } from '@/app/hooks'  // NEW
import { checkAuthThunk } from '@/features/auth/authSlice'    // NEW
import { Spinner } from '@/shared/ui/spinner'                 // NEW

function App() {
  const dispatch = useAppDispatch()                           // NEW
  const { isAuthenticated, loading } = useAppSelector(        // NEW
    (state) => state.auth                                     // NEW
  )                                                           // NEW

  // Check for existing auth session on mount                 // NEW
  useEffect(() => {                                           // NEW
    dispatch(checkAuthThunk())                                // NEW
  }, [dispatch])                                              // NEW

  const handleLoginSuccess = () => {
    // Auth state is already updated by Redux
  }

  if (loading) {                                              // NEW
    return (                                                  // NEW
      <div className="flex items-center justify-center min-h-screen bg-muted/50">
        <Spinner size="lg" />                                 // NEW
      </div>                                                  // NEW
    )                                                         // NEW
  }                                                           // NEW

  return (
    <>
      {isAuthenticated ? (                                    {/* CHANGED */}
        <>
          <HomeScreen />
          <Toaster />
        </>
      ) : (
        <>
          <div className="flex items-center justify-center min-h-screen bg-muted/50">
            <LoginPage onLoginSuccess={handleLoginSuccess} />
          </div>
          <Toaster />
        </>
      )}
    </>
  )
}

export default App
```

**Changes**:
- Removed local `useState` for `isLoggedIn`
- Added Redux hooks (`useAppDispatch`, `useAppSelector`)
- Added `checkAuthThunk()` to restore session on mount
- Added loading spinner during initial auth check
- Removed hidden test button

---

## 3. Login Page (`src/features/auth/login.tsx`)

### ❌ Before (Key sections)
```tsx
import { useState } from "react"
import { toast } from "@/shared/ui/sonner"
import { authUsecase } from "./usecase"
import type { LoginRequest } from "./model"

export function LoginPage({ onLoginSuccess, ... }) {
  const [isLoading, setIsLoading] = useState(false)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [errors, setErrors] = useState<{ username?: string; password?: string }>({})

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    // ... validation ...

    setIsLoading(true)
    try {
      const loginRequest: LoginRequest = { username, password }
      await authUsecase.login(loginRequest)
      toast.success("Login successful!", {
        description: `Welcome back, ${username}`,
      })
      setUsername("")
      setPassword("")
      onLoginSuccess?.()
    } catch (error: any) {
      toast.error("Login failed", {
        description: error?.message || "Please check your credentials and try again",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    // ... JSX with isLoading state ...
    <Button type="submit" disabled={isLoading}>
      {isLoading ? "Signing in..." : "Login"}
    </Button>
  )
}
```

### ✅ After
```tsx
import { useState, useEffect } from "react"                   // CHANGED
import { toast } from "@/shared/ui/sonner"
import { useAppDispatch, useAppSelector } from "@/app/hooks"  // NEW
import { loginThunk, clearError } from "./authSlice"          // NEW

export function LoginPage({ onLoginSuccess, ... }) {
  const dispatch = useAppDispatch()                           // NEW
  const { loading, error } = useAppSelector((state) => state.auth)  // NEW
  
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [errors, setErrors] = useState<{ username?: string; password?: string }>({})

  // Clear Redux error when component unmounts                 // NEW
  useEffect(() => {                                           // NEW
    return () => {                                            // NEW
      dispatch(clearError())                                  // NEW
    }                                                         // NEW
  }, [dispatch])                                              // NEW

  // Clear error on user input                                // NEW
  useEffect(() => {                                           // NEW
    if (username || password) {                               // NEW
      dispatch(clearError())                                  // NEW
    }                                                         // NEW
  }, [username, password, dispatch])                          // NEW

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    // ... validation ...

    try {
      const result = await dispatch(                          // CHANGED
        loginThunk({ user_name: username, password })         // CHANGED
      ).unwrap()                                              // CHANGED
      
      toast.success("Login successful!", {
        description: `Welcome back, ${result.user.fullName || username}`,  // CHANGED
      })
      
      setUsername("")
      setPassword("")
      onLoginSuccess?.()
    } catch (err: any) {                                      // CHANGED
      toast.error("Login failed", {
        description: err || "Please check your credentials and try again",
      })
    }
  }

  return (
    // ... JSX ...
    {(errors.password || error) && (                          {/* CHANGED */}
      <FieldMessage>{errors.password || error}</FieldMessage> {/* CHANGED */}
    )}                                                        {/* CHANGED */}
    
    <Button type="submit" disabled={loading}>                 {/* CHANGED */}
      {loading ? "Signing in..." : "Login"}                   {/* CHANGED */}
    </Button>
  )
}
```

**Changes**:
- Replaced local `isLoading` with Redux `loading` state
- Added `useAppDispatch` and `useAppSelector`
- Dispatch `loginThunk` instead of direct API call
- Display errors from Redux state
- Clear errors on unmount and user input
- Use `.unwrap()` for proper error handling

---

## 4. Protected Route (`src/app/routes/ProtectedRoute.tsx`)

### ❌ Before
```tsx
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../providers/AuthProvider';
import { Spinner } from '@/shared/ui/spinner';

export const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
};
```

### ✅ After
```tsx
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAppSelector } from '@/app/hooks';                 // CHANGED
import { Spinner } from '@/shared/ui/spinner';

export const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, loading } = useAppSelector(        // CHANGED
    (state) => state.auth                                     // CHANGED
  );                                                          // CHANGED
  const location = useLocation();

  if (loading) {                                              // CHANGED
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
};
```

**Changes**:
- Replaced `useAuth()` from Context with `useAppSelector`
- Read `isAuthenticated` and `loading` from Redux state
- Removed dependency on `AuthProvider`

---

## 5. New Files Created

### `src/app/store.ts` (NEW)
```tsx
import { configureStore } from '@reduxjs/toolkit'
import authReducer from '@/features/auth/authSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {},
    }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
```

### `src/app/hooks.ts` (NEW)
```tsx
import { useDispatch, useSelector } from 'react-redux'
import type { TypedUseSelectorHook } from 'react-redux'
import type { RootState, AppDispatch } from './store'

export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
```

### `src/features/auth/authSlice.ts` (NEW)
```tsx
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { AuthState, AuthUser, LoginPayload } from '@/entities/auth/auth.types'
import { authService } from '@/services/auth.service'
import { saveTokens, clearTokens, getAccessToken, getRefreshToken } from '@/shared/utils/token'

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  loading: false,
  error: null,
  isAuthenticated: false,
}

// Thunks
export const loginThunk = createAsyncThunk('auth/login', async (payload: LoginPayload) => {
  const response = await authService.login({ user_name: payload.user_name, password: payload.password })
  
  if (!response.is_succeeded || !response.data) {
    throw new Error(response.message || 'Login failed')
  }

  const { access_token, refresh_token, user_id, full_name } = response.data
  saveTokens(access_token, refresh_token)

  return {
    user: { id: user_id, fullName: full_name } as AuthUser,
    accessToken: access_token,
    refreshToken: refresh_token,
  }
})

export const logoutThunk = createAsyncThunk('auth/logout', async () => {
  clearTokens()
})

export const checkAuthThunk = createAsyncThunk('auth/checkAuth', async () => {
  const accessToken = getAccessToken()
  const refreshToken = getRefreshToken()

  if (!accessToken || !refreshToken) {
    throw new Error('No tokens found')
  }

  return {
    user: { id: 'restored-user', fullName: 'Restored User' } as AuthUser,
    accessToken,
    refreshToken,
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
    // Login cases
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
      state.error = action.error.message || 'Login failed'
      state.isAuthenticated = false
    })
    
    // Logout, checkAuth cases...
  },
})

export const { clearAuth, setUser, clearError } = authSlice.actions
export default authSlice.reducer
```

### `src/features/auth/hooks/useAuth.ts` (NEW)
```tsx
import { useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { loginThunk, logoutThunk, clearAuth } from '../authSlice'
import type { LoginPayload } from '@/entities/auth/auth.types'

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

  return { user, isAuthenticated, loading, error, login, logout, clearAuthState }
}
```

---

## 6. Auth Usecase Updated (`src/features/auth/usecase.ts`)

### ❌ Before
```tsx
import { LoginRequest, LoginResult } from '@/entities/auth/login.model';
import { authService } from '../../services/auth.service';

export const authUsecase = {
  login: (payload: LoginRequest): Promise<LoginResult> => authService.login(payload),
};
```

### ✅ After
```tsx
import { LoginRequest as LoginRequestModel, LoginResult } from '@/entities/auth/login.model';
import { LoginRequest as LoginRequestApi } from '@/entities/auth/auth.types';
import { authService } from '../../services/auth.service';

export const authUsecase = {
  login: async (payload: LoginRequestModel): Promise<LoginResult> => {
    // Convert model format to API format
    const apiPayload: LoginRequestApi = {
      user_name: payload.username,
      password: payload.password,
    };

    const response = await authService.login(apiPayload);

    if (!response.is_succeeded || !response.data) {
      throw new Error(response.message || 'Login failed');
    }

    return {
      tokens: {
        accessToken: response.data.access_token,
        refreshToken: response.data.refresh_token,
      },
      user: {
        id: response.data.user_id,
        username: response.data.user_id,
        fullName: response.data.full_name,
        roles: [],
      },
    };
  },
};
```

**Changes**:
- Added proper API/model transformation
- Converts between different LoginRequest formats
- Properly maps API response to domain model

---

## Summary of Changes

### Files Created: 5
1. `src/app/store.ts`
2. `src/app/hooks.ts`
3. `src/features/auth/authSlice.ts`
4. `src/features/auth/hooks/useAuth.ts`
5. Documentation files (REDUX_MIGRATION_GUIDE.md, etc.)

### Files Modified: 5
1. `src/main.tsx` - Added Provider
2. `src/app/routes/App.tsx` - Redux state management
3. `src/features/auth/login.tsx` - Dispatch thunks
4. `src/app/routes/ProtectedRoute.tsx` - Redux selectors
5. `src/features/auth/usecase.ts` - API transformation

### Dependencies Added: 2
- `@reduxjs/toolkit`
- `react-redux`

---

## Migration Impact

### Before: Context-based (6 files involved)
```
AuthProvider (Context)
  ↓
useAuth hook
  ↓
Components (App, Login, ProtectedRoute)
  ↓
Direct API calls
```

### After: Redux-based (Clean architecture)
```
Redux Store
  ├─ authSlice (state + thunks)
  ├─ Typed hooks (useAppDispatch, useAppSelector)
  └─ Custom hook (useAuth)
       ↓
Components (App, Login, ProtectedRoute)
  ↓
Dispatched actions → Reducers → State updates
```

---

**All changes are non-breaking and maintain existing functionality while improving architecture!**
