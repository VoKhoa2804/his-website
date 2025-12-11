/**
 * Clinic Redux Slice
 */

import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit'
import type {
  Clinic,
  ClinicFilter,
  ClinicState,
  CreateClinicPayload,
  UpdateClinicPayload,
} from './clinicTypes'
import { clinicApi } from '../api/clinicApi'

const initialState: ClinicState = {
  items: [],
  selectedClinic: null,
  totalCount: 0,
  pageIndex: 1,
  pageSize: 10,
  search: '',
  loading: false,
  error: null,
}

// Async thunks
export const fetchClinicsThunk = createAsyncThunk(
  'clinic/fetchClinics',
  async (filter: ClinicFilter) => {
    return await clinicApi.getClinics(filter)
  }
)

export const fetchClinicByIdThunk = createAsyncThunk(
  'clinic/fetchClinicById',
  async (id: string) => {
    return await clinicApi.getClinicById(id)
  }
)

export const createClinicThunk = createAsyncThunk(
  'clinic/createClinic',
  async (payload: CreateClinicPayload) => {
    return await clinicApi.createClinic(payload)
  }
)

export const updateClinicThunk = createAsyncThunk(
  'clinic/updateClinic',
  async (payload: UpdateClinicPayload) => {
    return await clinicApi.updateClinic(payload)
  }
)

export const deleteClinicThunk = createAsyncThunk(
  'clinic/deleteClinic',
  async (id: string) => {
    await clinicApi.deleteClinic(id)
    return id
  }
)

const clinicSlice = createSlice({
  name: 'clinic',
  initialState,
  reducers: {
    setSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload
      state.pageIndex = 1
    },
    setPageIndex: (state, action: PayloadAction<number>) => {
      state.pageIndex = action.payload
    },
    setPageSize: (state, action: PayloadAction<number>) => {
      state.pageSize = action.payload
      state.pageIndex = 1
    },
    selectClinic: (state, action: PayloadAction<Clinic | null>) => {
      state.selectedClinic = action.payload
    },
    clearError: (state) => {
      state.error = null
    },
    resetFilters: (state) => {
      state.search = ''
      state.pageIndex = 1
      state.pageSize = 10
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch clinics
      .addCase(fetchClinicsThunk.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchClinicsThunk.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload.items
        state.totalCount = action.payload.totalCount
      })
      .addCase(fetchClinicsThunk.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch clinics'
      })
      // Fetch by ID
      .addCase(fetchClinicByIdThunk.fulfilled, (state, action) => {
        state.selectedClinic = action.payload
      })
      // Create
      .addCase(createClinicThunk.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createClinicThunk.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(createClinicThunk.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to create clinic'
      })
      // Update
      .addCase(updateClinicThunk.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateClinicThunk.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(updateClinicThunk.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to update clinic'
      })
      // Delete
      .addCase(deleteClinicThunk.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteClinicThunk.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(deleteClinicThunk.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to delete clinic'
      })
  },
})

export const {
  setSearch,
  setPageIndex,
  setPageSize,
  selectClinic,
  clearError,
  resetFilters,
} = clinicSlice.actions

export default clinicSlice.reducer
