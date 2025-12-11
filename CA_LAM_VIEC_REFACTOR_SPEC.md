# Ca Làm Việc (Work Shifts) - Refactoring Specification

## 📋 Executive Summary

**Objective**: Refactor the `ca-lam-viec` feature to mirror the proven architecture pattern established by the `auth` feature.

**Status**: The ca-lam-viec feature is currently **structurally inconsistent** with the rest of the application:
- ❌ References non-existent `http` utility (`import { http } from '../shared/utils/http'`)
- ❌ Service layer lives in `src/services/` instead of feature folder
- ❌ No Redux integration (uses local component state)
- ❌ Business logic mixed with UI in List component
- ❌ Does not leverage the new `baseApi` module with interceptors

**Goal**: Transform ca-lam-viec to use the same layered architecture as auth, making it maintainable, testable, and consistent with project standards.

---

## 🏗️ Current State Analysis

### 1. Auth Feature Architecture (Reference Standard)

```
src/features/auth/
├── authSlice.ts                 # Redux slice with thunks
├── hooks/
│   └── useAuth.ts              # Custom hook abstracting Redux logic
├── login.tsx                    # UI component (presentational)
├── model.ts                     # Domain types (unused, legacy)
└── usecase.ts                   # Transformation layer (auth → Redux migration artifact)
```

**Auth Architecture Patterns:**

#### Layer 1: API Service
- **Location**: `src/services/auth.service.ts`
- **Purpose**: HTTP calls using native `fetch`
- **Inputs**: API request types (`LoginRequest`)
- **Outputs**: API response types (`LoginApiResponse`)
- **Error Handling**: Throws with user-friendly messages
- **Key Code**:
  ```typescript
  // Uses fetch directly, not baseApi (legacy before baseApi existed)
  export async function login(payload: LoginRequest): Promise<LoginApiResponse> {
    const response = await fetch(`${AUTH_API_BASE}/api/logins`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...payload, app_name: 'Patients' }),
    })
    const data: LoginApiResponse = await response.json()
    if (!response.ok || !data.is_succeeded) {
      throw new Error(data.message || 'Login failed')
    }
    return data
  }
  ```

#### Layer 2: Redux State Management
- **Location**: `src/features/auth/authSlice.ts`
- **Purpose**: Global state, async thunks, reducers
- **Pattern**: Redux Toolkit `createSlice` + `createAsyncThunk`
- **State Shape**:
  ```typescript
  interface AuthState {
    user: AuthUser | null
    accessToken: string | null
    refreshToken: string | null
    loading: boolean
    error: string | null
    isAuthenticated: boolean
  }
  ```
- **Thunks**:
  - `loginThunk` - Calls `authService.login()`, saves tokens, updates state
  - `logoutThunk` - Clears tokens and state
  - `checkAuthThunk` - Restores session from localStorage
- **Reducers**:
  - `clearAuth`, `setUser`, `clearError` - Synchronous state updates

#### Layer 3: Custom Hooks
- **Location**: `src/features/auth/hooks/useAuth.ts`
- **Purpose**: Abstracts Redux dispatch/selectors into clean API
- **Pattern**: Returns functions and state from Redux
- **Exports**:
  ```typescript
  export function useAuth() {
    return {
      user,
      isAuthenticated,
      loading,
      error,
      login: (credentials) => dispatch(loginThunk(credentials)).unwrap(),
      logout: () => dispatch(logoutThunk()),
      clearAuthState: () => dispatch(clearAuth())
    }
  }
  ```

#### Layer 4: UI Components
- **Location**: `src/features/auth/login.tsx`
- **Purpose**: Render UI, handle events, NO business logic
- **Pattern**: Uses `useAuth()` hook, `useAppSelector`, toast notifications
- **Responsibilities**:
  - Form validation (local)
  - Call `dispatch(loginThunk())` on submit
  - Display loading/error states from Redux
  - Show success toast
  - NO direct API calls
  - NO data transformation

---

### 2. Ca Làm Việc Current State (Problems)

```
src/features/ca-lam-viec/
├── List.tsx                    # ❌ MIXED: UI + business logic + state management
├── model.ts                    # ✅ GOOD: Domain types
└── usecase.ts                  # ❌ USELESS: Just passes through to service

src/services/
└── calamviec.service.ts        # ❌ BROKEN: Imports non-existent 'http' utility
```

#### Problem 1: Non-existent HTTP Utility
```typescript
// src/services/calamviec.service.ts
import { http } from '../shared/utils/http';  // ❌ FILE DOES NOT EXIST
```

The `http` utility was never created. The service is **completely broken** and cannot execute.

#### Problem 2: No Redux Integration
```typescript
// List.tsx uses local useState instead of Redux
const [items, setItems] = useState<CaLamViec[]>([]);
const [totalCount, setTotalCount] = useState(0);
const [loading, setIsLoading] = useState(false);
const [error, setError] = useState<string | null>(null);
```

**Issues:**
- State doesn't persist across navigation
- Can't share state with other components
- Re-fetches data on every mount
- No centralized error handling

#### Problem 3: Business Logic in UI Component
```typescript
// List.tsx line 23-37
const loadData = async () => {
  setIsLoading(true);
  setError(null);
  try {
    const res = await caLamViecUsecase.getPaged({
      pageIndex,
      pageSize,
      search,
    });
    setItems(res.items);
    setTotalCount(res.totalCount);
  } catch (err: any) {
    setError(err?.message || 'Lỗi tải dữ liệu');
  } finally {
    setIsLoading(false);
  }
};
```

**Issues:**
- Component handles loading/error states manually
- Duplicates logic that should be in Redux
- Hard to test
- Hard to reuse logic

#### Problem 4: Service Layer Not Using BaseAPI
The service was written before `baseApi` existed. It references a non-existent `http` utility instead of using the production-ready `src/api/baseApi.ts` with:
- Automatic JWT token injection
- 401 auto-refresh
- Unified error handling
- Request/response logging

#### Problem 5: Useless Usecase Layer
```typescript
// usecase.ts just passes through - adds NO value
export const caLamViecUsecase = {
  getPaged: (filter: CaLamViecFilter) => caLamViecService.getPaged(filter),
  getById: (id: string) => caLamViecService.getById(id),
  // ... etc
};
```

This layer does no transformation, no validation, no business logic. **Delete it.**

---

## 🎯 Target Architecture (Mirroring Auth)

### Folder Structure

```
src/features/caLamViec/                    # ✅ Rename folder from ca-lam-viec
├── api/
│   └── workShiftApi.ts                   # ✅ API calls using baseApi
├── model/
│   ├── workShiftTypes.ts                 # ✅ All domain types
│   └── workShiftSlice.ts                 # ✅ Redux slice + thunks
├── hooks/
│   └── useWorkShifts.ts                  # ✅ Custom hook (abstracts Redux)
└── ui/
    ├── WorkShiftListPage.tsx             # ✅ List view (presentational)
    ├── WorkShiftForm.tsx                 # ✅ Create/Edit form (presentational)
    └── WorkShiftStatusBadge.tsx          # ✅ Reusable status display
```

### Files to Delete

```
src/features/ca-lam-viec/usecase.ts       # ❌ DELETE - adds no value
src/services/calamviec.service.ts         # ❌ DELETE - broken, will be replaced by api/workShiftApi.ts
```

---

## 📐 Detailed Implementation Plan

### Step 1: Create API Layer (Mirror authService)

**File**: `src/features/caLamViec/api/workShiftApi.ts`

**Purpose**: HTTP calls to backend using `baseApi` with interceptors

**Pattern**: Same as `authService.login()` but using `api` from `src/api`

```typescript
/**
 * Work Shift API
 * Handles all work-shift-related API calls using baseApi.
 */

import { api } from '@/api'
import type { ApiResponse } from '@/api'
import type {
  WorkShift,
  WorkShiftFilter,
  WorkShiftPagingResult,
  CreateWorkShiftPayload,
  UpdateWorkShiftPayload,
} from '../model/workShiftTypes'

const CV_API_BASE = import.meta.env.VITE_CV_API_BASE as string

/**
 * Fetch paginated work shifts with optional search filter
 */
export async function getWorkShifts(
  filter: WorkShiftFilter
): Promise<WorkShiftPagingResult> {
  // Call backend with specific baseURL override
  const response = await api.get<WorkShift[]>('/api/calamviecs/getall', {
    baseURL: CV_API_BASE,
  })

  // Client-side filtering and pagination (matching current behavior)
  let list = response || []
  const keyword = (filter.search || '').toLowerCase().trim()
  
  if (keyword) {
    list = list.filter(
      (x) =>
        x.ma.toLowerCase().includes(keyword) ||
        x.ten.toLowerCase().includes(keyword)
    )
  }

  const { pageIndex, pageSize } = filter
  const start = (pageIndex - 1) * pageSize
  const items = list.slice(start, start + pageSize)

  return {
    items,
    totalCount: list.length,
    pageIndex,
    pageSize,
  }
}

/**
 * Fetch single work shift by ID
 */
export async function getWorkShiftById(id: string): Promise<WorkShift> {
  return api.get<WorkShift>(`/api/calamviecs/${id}`, {
    baseURL: CV_API_BASE,
  })
}

/**
 * Create new work shift
 */
export async function createWorkShift(
  payload: CreateWorkShiftPayload
): Promise<WorkShift> {
  return api.post<WorkShift>('/api/calamviecs', payload, {
    baseURL: CV_API_BASE,
  })
}

/**
 * Update existing work shift
 */
export async function updateWorkShift(
  payload: UpdateWorkShiftPayload
): Promise<WorkShift> {
  return api.put<WorkShift>(`/api/calamviecs/${payload.id}`, payload, {
    baseURL: CV_API_BASE,
  })
}

/**
 * Delete work shift by ID
 */
export async function deleteWorkShift(id: string): Promise<void> {
  await api.delete(`/api/calamviecs/${id}`, {
    baseURL: CV_API_BASE,
  })
}

export const workShiftApi = {
  getWorkShifts,
  getWorkShiftById,
  createWorkShift,
  updateWorkShift,
  deleteWorkShift,
}
```

**Key Differences from authService:**
- ✅ Uses `api` from `@/api` (baseApi with interceptors) instead of `fetch`
- ✅ Automatic token injection
- ✅ Automatic error normalization
- ✅ Overrides `baseURL` with `VITE_CV_API_BASE` for this specific API
- ✅ Client-side filtering matches existing behavior (no backend changes)

---

### Step 2: Create Domain Types (Consolidate from model.ts)

**File**: `src/features/caLamViec/model/workShiftTypes.ts`

**Purpose**: All TypeScript interfaces for work shifts

**Pattern**: Same structure as `auth.types.ts`

```typescript
/**
 * Work Shift Domain Types
 */

import type { PagingRequest, PagingResult } from '@/shared/types/api'

/**
 * Work shift entity
 */
export interface WorkShift {
  id: string
  ma: string              // Code
  ten: string             // Name
  hien_thi: boolean       // Display/Active status
}

/**
 * Filter for paginated work shift queries
 */
export interface WorkShiftFilter extends PagingRequest {
  search?: string
}

/**
 * Paginated work shift result
 */
export type WorkShiftPagingResult = PagingResult<WorkShift>

/**
 * Payload for creating a new work shift
 */
export interface CreateWorkShiftPayload {
  ma: string
  ten: string
  hien_thi: boolean
}

/**
 * Payload for updating an existing work shift
 */
export interface UpdateWorkShiftPayload extends CreateWorkShiftPayload {
  id: string
}

/**
 * Redux state shape for work shifts
 */
export interface WorkShiftState {
  items: WorkShift[]
  selectedShift: WorkShift | null
  totalCount: number
  pageIndex: number
  pageSize: number
  search: string
  loading: boolean
  error: string | null
}
```

---

### Step 3: Create Redux Slice (Mirror authSlice)

**File**: `src/features/caLamViec/model/workShiftSlice.ts`

**Purpose**: Redux state management with async thunks

**Pattern**: Exact same as `authSlice.ts` structure

```typescript
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type {
  WorkShift,
  WorkShiftFilter,
  WorkShiftState,
  CreateWorkShiftPayload,
  UpdateWorkShiftPayload,
} from './workShiftTypes'
import { workShiftApi } from '../api/workShiftApi'

// Initial state
const initialState: WorkShiftState = {
  items: [],
  selectedShift: null,
  totalCount: 0,
  pageIndex: 1,
  pageSize: 10,
  search: '',
  loading: false,
  error: null,
}

// Async Thunks

/**
 * Fetch paginated work shifts
 */
export const fetchWorkShiftsThunk = createAsyncThunk(
  'workShift/fetchAll',
  async (filter: WorkShiftFilter, { rejectWithValue }) => {
    try {
      const result = await workShiftApi.getWorkShifts(filter)
      return result
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch work shifts')
    }
  }
)

/**
 * Fetch single work shift by ID
 */
export const fetchWorkShiftByIdThunk = createAsyncThunk(
  'workShift/fetchById',
  async (id: string, { rejectWithValue }) => {
    try {
      const shift = await workShiftApi.getWorkShiftById(id)
      return shift
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch work shift')
    }
  }
)

/**
 * Create new work shift
 */
export const createWorkShiftThunk = createAsyncThunk(
  'workShift/create',
  async (payload: CreateWorkShiftPayload, { rejectWithValue }) => {
    try {
      const shift = await workShiftApi.createWorkShift(payload)
      return shift
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create work shift')
    }
  }
)

/**
 * Update existing work shift
 */
export const updateWorkShiftThunk = createAsyncThunk(
  'workShift/update',
  async (payload: UpdateWorkShiftPayload, { rejectWithValue }) => {
    try {
      const shift = await workShiftApi.updateWorkShift(payload)
      return shift
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update work shift')
    }
  }
)

/**
 * Delete work shift
 */
export const deleteWorkShiftThunk = createAsyncThunk(
  'workShift/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await workShiftApi.deleteWorkShift(id)
      return id
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to delete work shift')
    }
  }
)

// Slice
const workShiftSlice = createSlice({
  name: 'workShift',
  initialState,
  reducers: {
    setSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload
    },
    setPageIndex: (state, action: PayloadAction<number>) => {
      state.pageIndex = action.payload
    },
    setPageSize: (state, action: PayloadAction<number>) => {
      state.pageSize = action.payload
    },
    selectShift: (state, action: PayloadAction<WorkShift | null>) => {
      state.selectedShift = action.payload
    },
    clearError: (state) => {
      state.error = null
    },
    resetFilters: (state) => {
      state.search = ''
      state.pageIndex = 1
    },
  },
  extraReducers: (builder) => {
    // Fetch all work shifts
    builder
      .addCase(fetchWorkShiftsThunk.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchWorkShiftsThunk.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload.items
        state.totalCount = action.payload.totalCount
        state.pageIndex = action.payload.pageIndex
        state.pageSize = action.payload.pageSize
      })
      .addCase(fetchWorkShiftsThunk.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

    // Fetch by ID
    builder
      .addCase(fetchWorkShiftByIdThunk.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchWorkShiftByIdThunk.fulfilled, (state, action) => {
        state.loading = false
        state.selectedShift = action.payload
      })
      .addCase(fetchWorkShiftByIdThunk.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

    // Create
    builder
      .addCase(createWorkShiftThunk.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createWorkShiftThunk.fulfilled, (state, action) => {
        state.loading = false
        state.items.unshift(action.payload)
        state.totalCount += 1
      })
      .addCase(createWorkShiftThunk.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

    // Update
    builder
      .addCase(updateWorkShiftThunk.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateWorkShiftThunk.fulfilled, (state, action) => {
        state.loading = false
        const index = state.items.findIndex((s) => s.id === action.payload.id)
        if (index !== -1) {
          state.items[index] = action.payload
        }
        if (state.selectedShift?.id === action.payload.id) {
          state.selectedShift = action.payload
        }
      })
      .addCase(updateWorkShiftThunk.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

    // Delete
    builder
      .addCase(deleteWorkShiftThunk.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteWorkShiftThunk.fulfilled, (state, action) => {
        state.loading = false
        state.items = state.items.filter((s) => s.id !== action.payload)
        if (state.selectedShift?.id === action.payload) {
          state.selectedShift = null
        }
        state.totalCount -= 1
      })
      .addCase(deleteWorkShiftThunk.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export const {
  setSearch,
  setPageIndex,
  setPageSize,
  selectShift,
  clearError,
  resetFilters,
} = workShiftSlice.actions

export default workShiftSlice.reducer
```

---

### Step 4: Create Custom Hook (Mirror useAuth)

**File**: `src/features/caLamViec/hooks/useWorkShifts.ts`

**Purpose**: Clean API for components to interact with Redux

**Pattern**: Same as `useAuth.ts`

```typescript
import { useCallback, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import {
  fetchWorkShiftsThunk,
  fetchWorkShiftByIdThunk,
  createWorkShiftThunk,
  updateWorkShiftThunk,
  deleteWorkShiftThunk,
  setSearch,
  setPageIndex,
  setPageSize,
  selectShift,
  clearError,
  resetFilters,
} from '../model/workShiftSlice'
import type {
  CreateWorkShiftPayload,
  UpdateWorkShiftPayload,
  WorkShift,
} from '../model/workShiftTypes'

/**
 * Custom hook for work shift operations
 * Abstracts Redux complexity from UI components
 */
export function useWorkShifts() {
  const dispatch = useAppDispatch()
  const {
    items,
    selectedShift,
    totalCount,
    pageIndex,
    pageSize,
    search,
    loading,
    error,
  } = useAppSelector((state) => state.workShift)

  // Load work shifts with current filters
  const loadWorkShifts = useCallback(() => {
    dispatch(
      fetchWorkShiftsThunk({
        pageIndex,
        pageSize,
        search,
      })
    )
  }, [dispatch, pageIndex, pageSize, search])

  // Load single work shift by ID
  const loadWorkShiftById = useCallback(
    async (id: string) => {
      return dispatch(fetchWorkShiftByIdThunk(id)).unwrap()
    },
    [dispatch]
  )

  // Create new work shift
  const createShift = useCallback(
    async (payload: CreateWorkShiftPayload) => {
      return dispatch(createWorkShiftThunk(payload)).unwrap()
    },
    [dispatch]
  )

  // Update work shift
  const updateShift = useCallback(
    async (payload: UpdateWorkShiftPayload) => {
      return dispatch(updateWorkShiftThunk(payload)).unwrap()
    },
    [dispatch]
  )

  // Delete work shift
  const deleteShift = useCallback(
    async (id: string) => {
      return dispatch(deleteWorkShiftThunk(id)).unwrap()
    },
    [dispatch]
  )

  // Update search filter
  const updateSearch = useCallback(
    (value: string) => {
      dispatch(setSearch(value))
    },
    [dispatch]
  )

  // Change page
  const changePage = useCallback(
    (page: number) => {
      dispatch(setPageIndex(page))
    },
    [dispatch]
  )

  // Change page size
  const changePageSize = useCallback(
    (size: number) => {
      dispatch(setPageSize(size))
    },
    [dispatch]
  )

  // Select shift for editing
  const selectWorkShift = useCallback(
    (shift: WorkShift | null) => {
      dispatch(selectShift(shift))
    },
    [dispatch]
  )

  // Clear error
  const clearErrorState = useCallback(() => {
    dispatch(clearError())
  }, [dispatch])

  // Reset all filters
  const resetAllFilters = useCallback(() => {
    dispatch(resetFilters())
  }, [dispatch])

  return {
    // State
    items,
    selectedShift,
    totalCount,
    pageIndex,
    pageSize,
    search,
    loading,
    error,
    
    // Actions
    loadWorkShifts,
    loadWorkShiftById,
    createShift,
    updateShift,
    deleteShift,
    updateSearch,
    changePage,
    changePageSize,
    selectWorkShift,
    clearError: clearErrorState,
    resetFilters: resetAllFilters,
  }
}
```

---

### Step 5: Refactor List Component (Mirror LoginPage)

**File**: `src/features/caLamViec/ui/WorkShiftListPage.tsx`

**Purpose**: Presentational component, NO business logic

**Pattern**: Same as `login.tsx` - uses hooks, dispatch, toast

```typescript
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'
import { Spinner } from '@/shared/ui/spinner'
import { toast } from '@/shared/ui/sonner'
import { useWorkShifts } from '../hooks/useWorkShifts'
import { WorkShiftStatusBadge } from './WorkShiftStatusBadge'

export const WorkShiftListPage: React.FC = () => {
  const navigate = useNavigate()
  const {
    items,
    totalCount,
    pageIndex,
    pageSize,
    search,
    loading,
    error,
    loadWorkShifts,
    deleteShift,
    updateSearch,
    changePage,
  } = useWorkShifts()

  // Load data on mount and when filters change
  useEffect(() => {
    loadWorkShifts()
  }, [loadWorkShifts])

  // Handle search form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    changePage(1)
    loadWorkShifts()
  }

  // Handle delete with confirmation
  const handleDelete = async (id: string) => {
    if (!window.confirm('Xóa ca làm việc này?')) return

    try {
      await deleteShift(id)
      toast.success('Đã xóa ca làm việc')
      loadWorkShifts() // Refresh list
    } catch (err: any) {
      toast.error(`Xóa thất bại: ${err}`)
    }
  }

  const totalPages = Math.ceil(totalCount / pageSize) || 1

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">Danh sách ca làm việc</h1>
        <Button onClick={() => navigate('/ca-lam-viec/create')}>
          + Thêm ca làm việc
        </Button>
      </div>

      {/* Filter Card */}
      <Card>
        <CardHeader>
          <CardTitle>Bộ lọc</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="flex flex-wrap items-center gap-3" onSubmit={handleSearch}>
            <Input
              placeholder="Tìm mã / tên ca..."
              value={search}
              onChange={(e) => updateSearch(e.target.value)}
              className="w-full sm:w-64"
            />
            <Button type="submit">Tìm</Button>
          </form>
        </CardContent>
      </Card>

      {/* Results Card */}
      <Card>
        <CardHeader>
          <CardTitle>Kết quả</CardTitle>
        </CardHeader>
        <CardContent>
          {loading && (
            <div className="flex items-center justify-center py-10">
              <Spinner size={24} />
            </div>
          )}

          {error && (
            <div className="rounded-md border border-red-300 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          {!loading && !error && (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="border-b bg-slate-50 text-left text-xs font-semibold uppercase text-slate-600">
                      <th className="px-3 py-2">Mã</th>
                      <th className="px-3 py-2">Tên</th>
                      <th className="px-3 py-2">Hiển thị</th>
                      <th className="px-3 py-2 text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.length === 0 && (
                      <tr>
                        <td className="px-3 py-4 text-center text-slate-500" colSpan={4}>
                          Không có dữ liệu
                        </td>
                      </tr>
                    )}

                    {items.map((item) => (
                      <tr
                        key={item.id}
                        className="border-b last:border-b-0 hover:bg-slate-50"
                      >
                        <td className="px-3 py-2">{item.ma}</td>
                        <td className="px-3 py-2">{item.ten}</td>
                        <td className="px-3 py-2">
                          <WorkShiftStatusBadge active={item.hien_thi} />
                        </td>
                        <td className="px-3 py-2 text-right">
                          <div className="inline-flex gap-2">
                            <button
                              type="button"
                              className="text-xs font-semibold text-blue-600 hover:underline"
                              onClick={() => navigate(`/ca-lam-viec/${item.id}/edit`)}
                            >
                              Sửa
                            </button>
                            <button
                              type="button"
                              className="text-xs font-semibold text-red-600 hover:underline"
                              onClick={() => handleDelete(item.id)}
                            >
                              Xóa
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-4 flex items-center justify-between text-xs text-slate-600">
                  <div>
                    Trang {pageIndex}/{totalPages} — Tổng {totalCount} dòng
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={pageIndex === 1}
                      onClick={() => changePage(pageIndex - 1)}
                    >
                      ← Trước
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={pageIndex === totalPages}
                      onClick={() => changePage(pageIndex + 1)}
                    >
                      Sau →
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
```

---

### Step 6: Create Reusable Status Badge Component

**File**: `src/features/caLamViec/ui/WorkShiftStatusBadge.tsx`

**Purpose**: Reusable component for displaying active/inactive status

```typescript
import React from 'react'

interface WorkShiftStatusBadgeProps {
  active: boolean
}

export const WorkShiftStatusBadge: React.FC<WorkShiftStatusBadgeProps> = ({ active }) => {
  if (active) {
    return (
      <span className="rounded-full bg-green-50 px-2 py-0.5 text-xs font-semibold text-green-700">
        Hiển thị
      </span>
    )
  }

  return (
    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-500">
      Ẩn
    </span>
  )
}
```

---

### Step 7: Register Reducer in Store

**File**: `src/app/store.ts`

**Changes**:
```typescript
import { configureStore } from '@reduxjs/toolkit'
import authReducer from '@/features/auth/authSlice'
import workShiftReducer from '@/features/caLamViec/model/workShiftSlice'  // ✅ ADD

export const store = configureStore({
  reducer: {
    auth: authReducer,
    workShift: workShiftReducer,  // ✅ ADD
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types if needed
        // ignoredActions: ['your/action/type'],
      },
    }),
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
```

---

## 🗂️ Migration Checklist

### Pre-Migration
- [x] Analyze auth feature architecture
- [x] Document current ca-lam-viec problems
- [x] Design target folder structure
- [x] Write detailed implementation spec

### Implementation
- [ ] Create `src/features/caLamViec/api/workShiftApi.ts`
- [ ] Create `src/features/caLamViec/model/workShiftTypes.ts`
- [ ] Create `src/features/caLamViec/model/workShiftSlice.ts`
- [ ] Create `src/features/caLamViec/hooks/useWorkShifts.ts`
- [ ] Create `src/features/caLamViec/ui/WorkShiftListPage.tsx`
- [ ] Create `src/features/caLamViec/ui/WorkShiftStatusBadge.tsx`
- [ ] Update `src/app/store.ts` to register workShiftReducer
- [ ] Delete `src/features/ca-lam-viec/usecase.ts`
- [ ] Delete `src/features/ca-lam-viec/List.tsx`
- [ ] Delete `src/features/ca-lam-viec/model.ts`
- [ ] Delete `src/services/calamviec.service.ts`
- [ ] Rename folder `src/features/ca-lam-viec` → `src/features/caLamViec`

### Testing
- [ ] Test fetch work shifts (list view loads)
- [ ] Test pagination (next/previous buttons work)
- [ ] Test search filter (filters items correctly)
- [ ] Test create work shift (form submission works)
- [ ] Test update work shift (edit flow works)
- [ ] Test delete work shift (deletion + confirmation works)
- [ ] Test error states (shows user-friendly errors)
- [ ] Test loading states (spinner displays during async ops)
- [ ] Verify Redux DevTools shows state updates
- [ ] Verify console shows baseApi request/response logs (dev mode)

### Verification
- [ ] No TypeScript errors
- [ ] No ESLint warnings
- [ ] Build passes (`npm run build`)
- [ ] Dev server runs (`npm run dev`)
- [ ] All existing ca-lam-viec routes still work
- [ ] Token injection works (check Network tab for Authorization header)
- [ ] 401 errors trigger auto-refresh (if token expires)

---

## 🔍 Architecture Comparison

| Aspect | Auth Feature ✅ | Ca Làm Việc (Before) ❌ | Ca Làm Việc (After) ✅ |
|--------|-----------------|------------------------|----------------------|
| **API Layer** | `authService.ts` (fetch) | `calamviec.service.ts` (broken http) | `workShiftApi.ts` (baseApi) |
| **State Management** | Redux Toolkit | Local useState | Redux Toolkit |
| **Async Logic** | createAsyncThunk | try/catch in component | createAsyncThunk |
| **Custom Hooks** | `useAuth()` | None | `useWorkShifts()` |
| **UI Components** | Presentational | Mixed logic | Presentational |
| **Folder Structure** | authSlice + hooks/ + login.tsx | Flat (List/model/usecase) | api/ + model/ + hooks/ + ui/ |
| **Error Handling** | Unified (toast) | Manual setState | Unified (toast) |
| **Loading States** | Redux state | Local useState | Redux state |
| **Reusability** | High | Low | High |
| **Testability** | High | Low | High |
| **Type Safety** | Full | Partial | Full |

---

## 🎓 Key Architectural Principles

### 1. Separation of Concerns
- **API Layer**: HTTP calls only, no state
- **Redux Slice**: State + async thunks, no UI
- **Custom Hooks**: Abstraction layer, business logic
- **UI Components**: Rendering + events, NO business logic

### 2. Single Source of Truth
- All ca-lam-viec state lives in Redux store
- Components read from Redux via `useAppSelector`
- Components update via `dispatch(thunk)` or `useWorkShifts()` hooks

### 3. Unidirectional Data Flow
```
User Action → dispatch(thunk) → API call → Redux state update → Component re-render
```

### 4. Error Handling Strategy
- API layer throws errors
- Thunks catch and return `rejectWithValue`
- Components use `.unwrap()` to get success/error
- Toast notifications for user feedback

### 5. Loading State Management
- Redux slice handles `loading` flag
- Thunks set `pending`, `fulfilled`, `rejected` states
- Components display spinner based on Redux `loading` state

### 6. Reusable Patterns
- Every feature should follow this structure
- Copy auth → adapt for new domain
- Consistency = maintainability

---

## 📚 Reference Files

### Files to Study (Auth Pattern)
1. `src/features/auth/authSlice.ts` - Redux slice structure
2. `src/features/auth/hooks/useAuth.ts` - Custom hook pattern
3. `src/features/auth/login.tsx` - Presentational component
4. `src/services/auth.service.ts` - API service layer
5. `src/api/baseApi.ts` - HTTP client with interceptors

### Files to Replace (Ca Làm Việc)
1. `src/features/ca-lam-viec/List.tsx` → `caLamViec/ui/WorkShiftListPage.tsx`
2. `src/features/ca-lam-viec/model.ts` → `caLamViec/model/workShiftTypes.ts`
3. `src/features/ca-lam-viec/usecase.ts` → **DELETE** (useless)
4. `src/services/calamviec.service.ts` → `caLamViec/api/workShiftApi.ts`

---

## 🚀 Next Steps

1. **Review this specification** - Understand the complete architecture
2. **Create folder structure** - Set up the new directories
3. **Implement API layer** - Start with `workShiftApi.ts` using baseApi
4. **Create Redux slice** - Mirror authSlice pattern
5. **Build custom hook** - Abstract Redux for components
6. **Refactor UI** - Make components presentational
7. **Test thoroughly** - Verify all CRUD operations work
8. **Delete old files** - Remove broken/obsolete code
9. **Document patterns** - Update team docs if needed
10. **Apply to other features** - Use this as template for future refactors

---

## 📞 Support

If you encounter issues during refactoring:
1. Compare your code to the auth feature implementation
2. Check Redux DevTools for state updates
3. Check browser console for baseApi request/response logs
4. Verify environment variables (`VITE_CV_API_BASE`)
5. Test API endpoints with Postman/curl if needed

---

**Status**: Ready for implementation ✅  
**Estimated Effort**: 2-3 hours  
**Risk Level**: Low (well-defined pattern, proven architecture)  
**Dependencies**: None (baseApi already exists)
