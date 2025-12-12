# Base API Module - Usage Guide

## 📋 Overview

The `baseApi` module provides a production-ready Axios instance with advanced interceptors for your React application. It's fully integrated with your Redux auth store and provides automatic token management, error handling, and token refresh capabilities.

---

## 🏗️ Architecture

### Core Components

```
src/api/
├── baseApi.ts          # Main Axios instance with interceptors
├── setupInterceptors.ts # Redux integration
├── types.ts            # TypeScript definitions
└── index.ts            # Public API exports
```

### Features

✅ **Automatic JWT Injection** - Tokens added to all requests  
✅ **Token Auto-Refresh** - Handles 401 errors with refresh flow  
✅ **Unified Error Handling** - Consistent error shapes  
✅ **Request Queueing** - Queues requests during token refresh  
✅ **Network Error Detection** - Timeout and connectivity errors  
✅ **Redux Integration** - Auto-logout on auth failure  
✅ **Type-Safe** - Full TypeScript support  
✅ **Configurable** - Environment-based configuration  

---

## 🚀 Basic Usage

### 1. Import the API

```typescript
import api from '@/api'
// or
import { api } from '@/api'
```

### 2. Make Requests

#### GET Request
```typescript
// Simple GET
const users = await api.get('/api/users')

// With query params
const filteredUsers = await api.get('/api/users', {
  params: { role: 'admin', page: 1 }
})

// Type-safe response
interface User {
  id: string
  name: string
  email: string
}

const users = await api.get<User[]>('/api/users')
```

#### POST Request
```typescript
// Create user
const newUser = await api.post('/api/users', {
  name: 'John Doe',
  email: 'john@example.com'
})

// Type-safe
interface CreateUserPayload {
  name: string
  email: string
}

interface UserResponse {
  id: string
  name: string
  email: string
}

const user = await api.post<UserResponse>(
  '/api/users',
  { name: 'John', email: 'john@example.com' } as CreateUserPayload
)
```

#### PUT/PATCH Request
```typescript
// Update user
await api.put('/api/users/123', {
  name: 'Jane Doe'
})

// Partial update
await api.patch('/api/users/123', {
  email: 'newemail@example.com'
})
```

#### DELETE Request
```typescript
await api.delete('/api/users/123')
```

---

## 🔐 Authentication Examples

### Login (Manual)
```typescript
import api from '@/api'
import type { ApiResponse } from '@/api'

interface LoginResponse {
  access_token: string
  refresh_token: string
  user: {
    id: string
    name: string
  }
}

async function login(username: string, password: string) {
  try {
    const response = await api.post<ApiResponse<LoginResponse>>(
      '/api/logins',
      {
        user_name: username,
        password: password,
        app_name: 'Patients'
      },
      { skipAuth: true } // Skip adding Authorization header
    )

    if (response.is_succeeded && response.data) {
      const { access_token, refresh_token } = response.data
      // Save tokens (handled by Redux in your app)
      return response.data
    }
  } catch (error) {
    console.error('Login failed:', error)
    throw error
  }
}
```

### Protected API Call
```typescript
// Tokens are automatically added by interceptor
async function getCurrentUser() {
  const user = await api.get('/api/auth/me')
  return user
}

async function updateProfile(data: UpdateProfilePayload) {
  const updated = await api.put('/api/users/profile', data)
  return updated
}
```

### Custom Headers
```typescript
// Add custom headers per request
const data = await api.get('/api/data', {
  headers: {
    'X-Custom-Header': 'value',
    'Accept-Language': 'en-US'
  }
})
```

---

## 🔄 Token Refresh Flow

The API automatically handles token refresh when receiving 401 errors:

1. **Request fails with 401** → Interceptor catches it
2. **Refresh token** → Calls `/api/auth/refresh` endpoint
3. **Save new tokens** → Updates localStorage
4. **Retry original request** → With new token
5. **Queue concurrent requests** → All waiting requests retry after refresh

### Refresh Token Endpoint

**Important**: You need to implement this endpoint in your backend:

```typescript
// Expected endpoint: POST /api/auth/refresh
// Request body: { refresh_token: string }
// Response format:
{
  "code": 200,
  "is_succeeded": true,
  "message": null,
  "data": {
    "access_token": "new_access_token",
    "refresh_token": "new_refresh_token"
  }
}
```

If refresh fails, the user is automatically logged out via Redux.

---

## 🛠️ Advanced Usage

### Skip Authentication
```typescript
// Public endpoint - don't add Authorization header
const publicData = await api.get('/api/public/data', {
  skipAuth: true
})
```

### Skip Error Handling
```typescript
// Handle errors manually
try {
  const data = await api.get('/api/risky-endpoint', {
    skipErrorHandling: true
  })
} catch (error) {
  // error is raw AxiosError, not ApiError
  console.error('Raw error:', error)
}
```

### Using Base Instance Directly
```typescript
import { baseApi } from '@/api'

// For advanced use cases (FormData, file upload, etc.)
const formData = new FormData()
formData.append('file', file)

const response = await baseApi.post('/api/upload', formData, {
  headers: {
    'Content-Type': 'multipart/form-data'
  }
})
```

### Request Cancellation
```typescript
import { baseApi } from '@/api'

const controller = new AbortController()

const request = api.get('/api/slow-endpoint', {
  signal: controller.signal
})

// Cancel request
controller.abort()

try {
  await request
} catch (error) {
  if (error.code === 'ERR_CANCELED') {
    console.log('Request was cancelled')
  }
}
```

---

## 🎯 Redux Toolkit Integration

### Using in Thunks

```typescript
import { createAsyncThunk } from '@reduxjs/toolkit'
import api from '@/api'
import type { ApiError } from '@/api'

export const fetchUsersThunk = createAsyncThunk(
  'users/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<User[]>('/api/users')
      return response
    } catch (error) {
      const apiError = error as ApiError
      return rejectWithValue(apiError.message)
    }
  }
)

export const createUserThunk = createAsyncThunk(
  'users/create',
  async (userData: CreateUserPayload, { rejectWithValue }) => {
    try {
      const user = await api.post<User>('/api/users', userData)
      return user
    } catch (error) {
      const apiError = error as ApiError
      return rejectWithValue({
        message: apiError.message,
        errors: apiError.errors
      })
    }
  }
)
```

### Handling in Reducers

```typescript
import { createSlice } from '@reduxjs/toolkit'

const usersSlice = createSlice({
  name: 'users',
  initialState: {
    list: [],
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsersThunk.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchUsersThunk.fulfilled, (state, action) => {
        state.loading = false
        state.list = action.payload
      })
      .addCase(fetchUsersThunk.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  }
})
```

---

## 🐛 Error Handling

### Error Shape

All errors are normalized to:

```typescript
interface ApiError {
  message: string           // User-friendly message
  status?: number          // HTTP status code
  code?: string | number   // Error code from backend
  errors?: Record<string, string[]>  // Validation errors
  originalError?: any      // Original Axios error
}
```

### Handling Errors

```typescript
import type { ApiError } from '@/api'

try {
  await api.post('/api/users', userData)
} catch (error) {
  const apiError = error as ApiError
  
  console.error('Error:', apiError.message)
  console.error('Status:', apiError.status)
  
  // Validation errors
  if (apiError.errors) {
    Object.entries(apiError.errors).forEach(([field, messages]) => {
      console.error(`${field}:`, messages)
    })
  }
}
```

### Common Error Types

```typescript
// Network error
{
  message: "Network error. Please check your internet connection.",
  status: 0,
  code: "NETWORK_ERROR"
}

// Timeout
{
  message: "Request timeout. Please check your connection and try again.",
  status: 408,
  code: "TIMEOUT"
}

// Validation error (422)
{
  message: "Validation failed",
  status: 422,
  code: 422,
  errors: {
    email: ["Email is required", "Email must be valid"],
    password: ["Password must be at least 8 characters"]
  }
}

// Server error (500)
{
  message: "Internal server error",
  status: 500,
  code: 500
}
```

---

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in your project root:

```env
# Primary API base URL
VITE_API_BASE_URL=http://localhost:8080

# Auth API base URL (fallback)
VITE_AUTH_API_BASE=http://localhost:8080

# Or for production
VITE_API_BASE_URL=https://api.yourdomain.com
```

### Timeout Configuration

Default timeout is 15 seconds. To change it:

```typescript
// In src/api/baseApi.ts
const REQUEST_TIMEOUT = 30000 // 30 seconds
```

### Logging

Request/response logging is enabled in development mode:

```typescript
// Disable logging
const IS_DEV = false // Change in baseApi.ts

// Or use environment variable
const IS_DEV = import.meta.env.DEV && import.meta.env.VITE_ENABLE_API_LOGS !== 'false'
```

---

## 🧪 Testing

### Mock API for Tests

```typescript
import { vi } from 'vitest'
import * as apiModule from '@/api'

// Mock the entire module
vi.mock('@/api', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
    patch: vi.fn(),
  }
}))

// In tests
import { api } from '@/api'

test('should fetch users', async () => {
  const mockUsers = [{ id: '1', name: 'John' }]
  ;(api.get as jest.Mock).mockResolvedValue(mockUsers)
  
  const users = await api.get('/api/users')
  
  expect(users).toEqual(mockUsers)
  expect(api.get).toHaveBeenCalledWith('/api/users')
})
```

---

## 🔮 Future Extensions

The baseApi is designed to support:

### Retry Policies
```typescript
// Add to baseApi.ts
import axiosRetry from 'axios-retry'

axiosRetry(baseApi, {
  retries: 3,
  retryDelay: axiosRetry.exponentialDelay,
  retryCondition: (error) => {
    return error.response?.status >= 500
  }
})
```

### Request Deduplication
```typescript
// Prevent duplicate concurrent requests
const pendingRequests = new Map()

// Add to request interceptor
const requestKey = `${config.method}:${config.url}`
if (pendingRequests.has(requestKey)) {
  config.signal = pendingRequests.get(requestKey).signal
}
```

### Analytics/Monitoring
```typescript
// Track API performance
baseApi.interceptors.response.use(
  (response) => {
    const duration = Date.now() - response.config.metadata.startTime
    analytics.track('api_call', {
      url: response.config.url,
      duration,
      status: response.status
    })
    return response
  }
)
```

---

## 📚 API Reference

### api.get(url, config?)
- **url**: string - Request URL
- **config**: ExtendedAxiosConfig - Optional config
- **Returns**: Promise<T>

### api.post(url, data?, config?)
- **url**: string - Request URL
- **data**: unknown - Request body
- **config**: ExtendedAxiosConfig - Optional config
- **Returns**: Promise<T>

### api.put(url, data?, config?)
- **url**: string - Request URL
- **data**: unknown - Request body
- **config**: ExtendedAxiosConfig - Optional config
- **Returns**: Promise<T>

### api.patch(url, data?, config?)
- **url**: string - Request URL
- **data**: unknown - Request body (partial)
- **config**: ExtendedAxiosConfig - Optional config
- **Returns**: Promise<T>

### api.delete(url, config?)
- **url**: string - Request URL
- **config**: ExtendedAxiosConfig - Optional config
- **Returns**: Promise<T>

### setupInterceptors(dispatch)
- **dispatch**: AppDispatch - Redux store dispatch
- Configures auto-logout on auth failure

---

## ✅ Best Practices

1. **Always type your responses**
   ```typescript
   const users = await api.get<User[]>('/api/users')
   ```

2. **Use skipAuth for public endpoints**
   ```typescript
   await api.post('/api/login', credentials, { skipAuth: true })
   ```

3. **Handle errors in thunks**
   ```typescript
   try {
     return await api.get('/api/data')
   } catch (error) {
     return rejectWithValue((error as ApiError).message)
   }
   ```

4. **Don't store sensitive data in Redux**
   - Tokens are in localStorage (managed by interceptors)
   - Only store user info in Redux state

5. **Use environment variables for URLs**
   ```env
   VITE_API_BASE_URL=https://api.production.com
   ```

---

**Your baseApi is ready to use! 🚀**

All your API calls now have automatic auth, error handling, and token refresh built-in.
