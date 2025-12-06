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
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to fetch work shifts'
      return rejectWithValue(message)
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
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to fetch work shift'
      return rejectWithValue(message)
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
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to create work shift'
      return rejectWithValue(message)
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
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to update work shift'
      return rejectWithValue(message)
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
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to delete work shift'
      return rejectWithValue(message)
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
