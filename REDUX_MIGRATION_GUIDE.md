# Redux Toolkit Migration - Complete Guide

## 📋 Summary of Changes

Successfully migrated the React application from Context-based state management to **Redux Toolkit** with full TypeScript support.

---

## 🏗️ Architecture Overview

### **Redux Store Structure**

```
src/
  app/
    ├── store.ts          # Root Redux store configuration
    └── hooks.ts          # Typed useAppDispatch & useAppSelector hooks
  features/
    auth/
      ├── authSlice.ts    # Auth state slice with thunks
      ├── hooks/
      │   └── useAuth.ts  # Custom auth hook (Redux-backed)
      ├── login.tsx       # Login page (migrated to Redux)
      ├── usecase.ts      # Auth business logic
      └── model.ts        # Auth types
```

### **Implemented Slices**

1. **`authSlice`** (`src/features/auth/authSlice.ts`)
   - **State**: `{ user, accessToken, refreshToken, loading, error, isAuthenticated }`
   - **Thunks**: 
     - `loginThunk` - Handles user login with API integration
     - `logoutThunk` - Clears session and tokens
     - `checkAuthThunk` - Restores session from localStorage on app init
   - **Reducers**: 
     - `clearAuth` - Manually clear auth state
     - `setUser` - Update user info
     - `clearError` - Clear error messages

---

## 📦 Files Created

### 1. **`src/app/store.ts`**
Root Redux store with `authReducer` integrated. Exports `RootState` and `AppDispatch` types.

### 2. **`src/app/hooks.ts`**
Typed Redux hooks (`useAppDispatch`, `useAppSelector`) for type-safe Redux usage throughout the app.

### 3. **`src/features/auth/authSlice.ts`**
Complete auth slice with:
- Initial state definition
- Three async thunks (login, logout, checkAuth)
- Synchronous reducers (clearAuth, setUser, clearError)
- Proper TypeScript typing for all actions

### 4. **`src/features/auth/hooks/useAuth.ts`**
Custom hook that wraps Redux auth operations in a clean API (similar to the old Context hook).

---

## 🔄 Files Modified

### 1. **`src/main.tsx`**
**Change**: Wrapped app with Redux `<Provider>`
```tsx
import { Provider } from 'react-redux'
import { store } from '@/app/store'

<Provider store={store}>
  <App />
</Provider>
```

### 2. **`src/app/routes/App.tsx`**
**Changes**:
- Removed local `useState` for `isLoggedIn`
- Added `useAppSelector` to read auth state from Redux
- Added `useAppDispatch` and `checkAuthThunk` to restore session on mount
- Now shows spinner during initial auth check

**Before**:
```tsx
const [isLoggedIn, setIsLoggedIn] = useState(false)
```

**After**:
```tsx
const { isAuthenticated, loading } = useAppSelector((state) => state.auth)
useEffect(() => {
  dispatch(checkAuthThunk())
}, [dispatch])
```

### 3. **`src/features/auth/login.tsx`**
**Changes**:
- Replaced direct `authUsecase.login()` call with `dispatch(loginThunk(...))`
- Removed local `isLoading` state (now uses Redux `loading` state)
- Added error display from Redux state
- Uses `dispatch(clearError())` on unmount and input changes

**Before**:
```tsx
const [isLoading, setIsLoading] = useState(false)
await authUsecase.login(loginRequest)
```

**After**:
```tsx
const { loading, error } = useAppSelector((state) => state.auth)
await dispatch(loginThunk({ user_name: username, password })).unwrap()
```

### 4. **`src/app/routes/ProtectedRoute.tsx`**
**Changes**:
- Replaced `useAuth()` from Context with Redux `useAppSelector`
- Now reads `isAuthenticated` and `loading` directly from Redux state

**Before**:
```tsx
const { isAuthenticated, isLoading } = useAuth()
```

**After**:
```tsx
const { isAuthenticated, loading } = useAppSelector((state) => state.auth)
```

### 5. **`src/features/auth/usecase.ts`**
**Changes**:
- Added proper transformation between API format and model format
- Converts `LoginRequest` (username/password) to API format (user_name/password)
- Transforms API response to expected `LoginResult` format

---

## ✅ Migration Benefits

1. **Centralized State**: Auth state is now in a single, predictable location
2. **DevTools**: Full Redux DevTools support for debugging
3. **Type Safety**: Complete TypeScript typing for all state and actions
4. **Async Handling**: Standardized loading/error states for all async operations
5. **Scalability**: Easy to add new slices (patients, appointments, etc.)
6. **Time-Travel Debugging**: Can replay actions and inspect state changes
7. **Middleware Support**: Easy to add logging, persistence, or API middleware

---

## 🚀 How to Use Redux in Your App

### **Reading State**
```tsx
import { useAppSelector } from '@/app/hooks'

function MyComponent() {
  const { user, isAuthenticated } = useAppSelector((state) => state.auth)
  
  return <div>Welcome {user?.fullName}</div>
}
```

### **Dispatching Actions**
```tsx
import { useAppDispatch } from '@/app/hooks'
import { loginThunk, logoutThunk } from '@/features/auth/authSlice'

function MyComponent() {
  const dispatch = useAppDispatch()
  
  const handleLogin = async () => {
    try {
      await dispatch(loginThunk({ user_name: 'john', password: '123' })).unwrap()
      // Success!
    } catch (error) {
      // Handle error
    }
  }
  
  const handleLogout = () => {
    dispatch(logoutThunk())
  }
}
```

### **Using the Custom Hook**
```tsx
import { useAuth } from '@/features/auth/hooks/useAuth'

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth()
  
  return (
    <div>
      {isAuthenticated ? (
        <button onClick={logout}>Logout</button>
      ) : (
        <button onClick={() => login({ user_name: 'john', password: '123' })}>
          Login
        </button>
      )}
    </div>
  )
}
```

---

## 📘 Adding New Slices (Step-by-Step)

### Example: Adding a `patientSlice`

#### 1. Create the slice file
**`src/features/patient/patientSlice.ts`**:
```tsx
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

interface Patient {
  id: string
  name: string
  age: number
}

interface PatientState {
  patients: Patient[]
  selectedPatient: Patient | null
  loading: boolean
  error: string | null
}

const initialState: PatientState = {
  patients: [],
  selectedPatient: null,
  loading: false,
  error: null,
}

// Async thunk example
export const fetchPatientsThunk = createAsyncThunk(
  'patient/fetchPatients',
  async () => {
    const response = await fetch('/api/patients')
    return response.json()
  }
)

const patientSlice = createSlice({
  name: 'patient',
  initialState,
  reducers: {
    selectPatient: (state, action: PayloadAction<Patient>) => {
      state.selectedPatient = action.payload
    },
    clearPatients: (state) => {
      state.patients = []
      state.selectedPatient = null
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchPatientsThunk.pending, (state) => {
      state.loading = true
    })
    builder.addCase(fetchPatientsThunk.fulfilled, (state, action) => {
      state.loading = false
      state.patients = action.payload
    })
    builder.addCase(fetchPatientsThunk.rejected, (state, action) => {
      state.loading = false
      state.error = action.error.message || 'Failed to fetch patients'
    })
  },
})

export const { selectPatient, clearPatients } = patientSlice.actions
export default patientSlice.reducer
```

#### 2. Add to store
**`src/app/store.ts`**:
```tsx
import { configureStore } from '@reduxjs/toolkit'
import authReducer from '@/features/auth/authSlice'
import patientReducer from '@/features/patient/patientSlice'  // Add this

export const store = configureStore({
  reducer: {
    auth: authReducer,
    patient: patientReducer,  // Add this
  },
})
```

#### 3. Use in components
```tsx
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { fetchPatientsThunk, selectPatient } from '@/features/patient/patientSlice'

function PatientList() {
  const dispatch = useAppDispatch()
  const { patients, selectedPatient, loading } = useAppSelector((state) => state.patient)
  
  useEffect(() => {
    dispatch(fetchPatientsThunk())
  }, [dispatch])
  
  return (
    <div>
      {loading ? 'Loading...' : patients.map(p => (
        <div key={p.id} onClick={() => dispatch(selectPatient(p))}>
          {p.name}
        </div>
      ))}
    </div>
  )
}
```

---

## ⚠️ Common Pitfalls to Avoid

### 1. **Over-globalizing State**
❌ **Bad**: Putting every piece of UI state in Redux
```tsx
// Don't do this for dropdown open/close state
const { isDropdownOpen } = useAppSelector(state => state.ui.dropdown)
```

✅ **Good**: Keep local UI state in components
```tsx
// Do this instead
const [isDropdownOpen, setIsDropdownOpen] = useState(false)
```

**Rule of Thumb**: Only put state in Redux if:
- Multiple components need it
- It needs to persist across route changes
- It represents domain data (users, patients, etc.)

### 2. **Not Using `unwrap()`**
❌ **Bad**: No error handling
```tsx
dispatch(loginThunk(credentials))
// Can't catch errors here!
```

✅ **Good**: Use `.unwrap()` for proper error handling
```tsx
try {
  await dispatch(loginThunk(credentials)).unwrap()
} catch (error) {
  toast.error(error)
}
```

### 3. **Mutating State Outside Reducers**
❌ **Bad**: Direct mutation
```tsx
const user = useAppSelector(state => state.auth.user)
user.name = 'New Name' // This won't work!
```

✅ **Good**: Dispatch actions
```tsx
dispatch(setUser({ ...user, name: 'New Name' }))
```

### 4. **Unnecessary Re-renders**
❌ **Bad**: Selecting entire state object
```tsx
const auth = useAppSelector(state => state.auth)
// Re-renders whenever ANY auth property changes
```

✅ **Good**: Select only what you need
```tsx
const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated)
const user = useAppSelector(state => state.auth.user)
// Only re-renders when these specific values change
```

### 5. **Storing Non-Serializable Data**
❌ **Bad**: Functions, Promises, class instances in state
```tsx
const initialState = {
  apiClient: new ApiClient(), // Don't do this
  callback: () => {}, // Don't do this
}
```

✅ **Good**: Only serializable data
```tsx
const initialState = {
  data: [],
  loading: false,
  error: null,
}
```

---

## 🔄 Migration Checklist for Other Features

When migrating other parts of the app to Redux:

- [ ] Identify global state (used by 2+ components)
- [ ] Create a new slice in `src/features/<domain>/<domain>Slice.ts`
- [ ] Define initial state with TypeScript types
- [ ] Create thunks for async operations
- [ ] Create reducers for synchronous state changes
- [ ] Add reducer to `src/app/store.ts`
- [ ] Update components to use `useAppSelector` and `useAppDispatch`
- [ ] Remove old Context providers (if applicable)
- [ ] Test the feature thoroughly
- [ ] Check Redux DevTools for proper state flow

---

## 🛠️ Debugging with Redux DevTools

1. **Install Redux DevTools Extension** (Chrome/Firefox)
2. **Open DevTools** → Redux tab
3. **Inspect State**: See current Redux state
4. **View Actions**: See all dispatched actions
5. **Time Travel**: Replay actions to debug
6. **Diff View**: See what changed between states

---

## 📚 Additional Resources

- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)
- [React-Redux Hooks](https://react-redux.js.org/api/hooks)
- [Redux DevTools Extension](https://github.com/reduxjs/redux-devtools)
- [TypeScript with Redux](https://redux.js.org/usage/usage-with-typescript)

---

## 🎯 Next Steps

1. **Test the current implementation**:
   ```bash
   npm run dev
   ```
   - Try logging in
   - Verify token persistence on refresh
   - Check Redux DevTools

2. **Migrate additional features** (suggested order):
   - Patient management → `patientSlice`
   - Appointments → `appointmentSlice`
   - User preferences/settings → `settingsSlice`

3. **Optional enhancements**:
   - Add Redux Persist for state persistence
   - Implement RTK Query for API calls
   - Add middleware for logging/analytics
   - Create selectors with `createSelector` for complex derivations

---

## 🐛 Troubleshooting

### Build errors?
```bash
npm run build
```
Check TypeScript errors and fix imports.

### State not updating?
- Verify reducer is added to `store.ts`
- Check if you're dispatching the action correctly
- Ensure you're not mutating state directly

### Infinite re-renders?
- Don't dispatch actions inside render (use `useEffect`)
- Be careful with selector dependencies

---

**Migration completed successfully! 🎉**

You now have a robust, scalable Redux architecture ready for your HIS application.
