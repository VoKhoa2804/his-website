# Base API - Real-World Examples

## 🎯 Complete Examples for Common Use Cases

---

## 1. Patient Management Module

### Patient Service (`src/services/patient.service.ts`)

```typescript
import { api } from '@/api'
import type { ApiResponse } from '@/api'

export interface Patient {
  id: string
  fullName: string
  dateOfBirth: string
  gender: 'male' | 'female' | 'other'
  phoneNumber: string
  email?: string
  address: string
  medicalRecordNumber: string
}

export interface CreatePatientPayload {
  fullName: string
  dateOfBirth: string
  gender: 'male' | 'female' | 'other'
  phoneNumber: string
  email?: string
  address: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
}

export const patientService = {
  /**
   * Get all patients with pagination
   */
  async getPatients(page = 1, pageSize = 20, search?: string) {
    const response = await api.get<ApiResponse<PaginatedResponse<Patient>>>(
      '/api/patients',
      {
        params: { page, pageSize, search }
      }
    )
    return response.data
  },

  /**
   * Get single patient by ID
   */
  async getPatientById(id: string) {
    const response = await api.get<ApiResponse<Patient>>(`/api/patients/${id}`)
    return response.data
  },

  /**
   * Create new patient
   */
  async createPatient(payload: CreatePatientPayload) {
    const response = await api.post<ApiResponse<Patient>>(
      '/api/patients',
      payload
    )
    return response.data
  },

  /**
   * Update patient
   */
  async updatePatient(id: string, payload: Partial<CreatePatientPayload>) {
    const response = await api.put<ApiResponse<Patient>>(
      `/api/patients/${id}`,
      payload
    )
    return response.data
  },

  /**
   * Delete patient
   */
  async deletePatient(id: string) {
    await api.delete(`/api/patients/${id}`)
  },

  /**
   * Search patients by medical record number
   */
  async searchByMRN(mrn: string) {
    const response = await api.get<ApiResponse<Patient>>(
      `/api/patients/search/mrn/${mrn}`
    )
    return response.data
  }
}
```

---

## 2. Redux Slice with BaseAPI

### Patient Slice (`src/features/patient/patientSlice.ts`)

```typescript
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { patientService, type Patient } from '@/services/patient.service'
import type { ApiError } from '@/api'

interface PatientState {
  patients: Patient[]
  selectedPatient: Patient | null
  total: number
  page: number
  pageSize: number
  loading: boolean
  error: string | null
}

const initialState: PatientState = {
  patients: [],
  selectedPatient: null,
  total: 0,
  page: 1,
  pageSize: 20,
  loading: false,
  error: null,
}

// Thunks
export const fetchPatientsThunk = createAsyncThunk(
  'patient/fetchAll',
  async (
    params: { page?: number; pageSize?: number; search?: string },
    { rejectWithValue }
  ) => {
    try {
      const data = await patientService.getPatients(
        params.page,
        params.pageSize,
        params.search
      )
      return data
    } catch (error) {
      const apiError = error as ApiError
      return rejectWithValue(apiError.message)
    }
  }
)

export const fetchPatientByIdThunk = createAsyncThunk(
  'patient/fetchById',
  async (id: string, { rejectWithValue }) => {
    try {
      const patient = await patientService.getPatientById(id)
      return patient
    } catch (error) {
      const apiError = error as ApiError
      return rejectWithValue(apiError.message)
    }
  }
)

export const createPatientThunk = createAsyncThunk(
  'patient/create',
  async (payload: CreatePatientPayload, { rejectWithValue }) => {
    try {
      const patient = await patientService.createPatient(payload)
      return patient
    } catch (error) {
      const apiError = error as ApiError
      return rejectWithValue({
        message: apiError.message,
        errors: apiError.errors
      })
    }
  }
)

export const updatePatientThunk = createAsyncThunk(
  'patient/update',
  async (
    { id, data }: { id: string; data: Partial<CreatePatientPayload> },
    { rejectWithValue }
  ) => {
    try {
      const patient = await patientService.updatePatient(id, data)
      return patient
    } catch (error) {
      const apiError = error as ApiError
      return rejectWithValue(apiError.message)
    }
  }
)

export const deletePatientThunk = createAsyncThunk(
  'patient/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await patientService.deletePatient(id)
      return id
    } catch (error) {
      const apiError = error as ApiError
      return rejectWithValue(apiError.message)
    }
  }
)

// Slice
const patientSlice = createSlice({
  name: 'patient',
  initialState,
  reducers: {
    selectPatient: (state, action) => {
      state.selectedPatient = action.payload
    },
    clearSelectedPatient: (state) => {
      state.selectedPatient = null
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    // Fetch patients
    builder
      .addCase(fetchPatientsThunk.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchPatientsThunk.fulfilled, (state, action) => {
        state.loading = false
        state.patients = action.payload.data
        state.total = action.payload.total
        state.page = action.payload.page
        state.pageSize = action.payload.pageSize
      })
      .addCase(fetchPatientsThunk.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

    // Fetch patient by ID
    builder
      .addCase(fetchPatientByIdThunk.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchPatientByIdThunk.fulfilled, (state, action) => {
        state.loading = false
        state.selectedPatient = action.payload
      })
      .addCase(fetchPatientByIdThunk.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

    // Create patient
    builder
      .addCase(createPatientThunk.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createPatientThunk.fulfilled, (state, action) => {
        state.loading = false
        state.patients.unshift(action.payload)
        state.total += 1
      })
      .addCase(createPatientThunk.rejected, (state, action) => {
        state.loading = false
        state.error = (action.payload as any).message
      })

    // Update patient
    builder
      .addCase(updatePatientThunk.fulfilled, (state, action) => {
        const index = state.patients.findIndex(p => p.id === action.payload.id)
        if (index !== -1) {
          state.patients[index] = action.payload
        }
        if (state.selectedPatient?.id === action.payload.id) {
          state.selectedPatient = action.payload
        }
      })

    // Delete patient
    builder
      .addCase(deletePatientThunk.fulfilled, (state, action) => {
        state.patients = state.patients.filter(p => p.id !== action.payload)
        if (state.selectedPatient?.id === action.payload) {
          state.selectedPatient = null
        }
        state.total -= 1
      })
  },
})

export const { selectPatient, clearSelectedPatient, clearError } = patientSlice.actions
export default patientSlice.reducer
```

---

## 3. React Component Usage

### Patient List Component

```typescript
import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { fetchPatientsThunk, deletePatientThunk } from '@/features/patient/patientSlice'
import { toast } from '@/shared/ui/sonner'

export function PatientList() {
  const dispatch = useAppDispatch()
  const { patients, loading, error, page, pageSize, total } = useAppSelector(
    (state) => state.patient
  )

  useEffect(() => {
    dispatch(fetchPatientsThunk({ page, pageSize }))
  }, [dispatch, page, pageSize])

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this patient?')) return

    try {
      await dispatch(deletePatientThunk(id)).unwrap()
      toast.success('Patient deleted successfully')
    } catch (error) {
      toast.error(`Failed to delete patient: ${error}`)
    }
  }

  const handlePageChange = (newPage: number) => {
    dispatch(fetchPatientsThunk({ page: newPage, pageSize }))
  }

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div>
      <h1>Patients ({total})</h1>
      
      <table>
        <thead>
          <tr>
            <th>MRN</th>
            <th>Name</th>
            <th>Date of Birth</th>
            <th>Phone</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((patient) => (
            <tr key={patient.id}>
              <td>{patient.medicalRecordNumber}</td>
              <td>{patient.fullName}</td>
              <td>{patient.dateOfBirth}</td>
              <td>{patient.phoneNumber}</td>
              <td>
                <button onClick={() => handleDelete(patient.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Pagination
        currentPage={page}
        totalPages={Math.ceil(total / pageSize)}
        onPageChange={handlePageChange}
      />
    </div>
  )
}
```

### Create Patient Form

```typescript
import { useState } from 'react'
import { useAppDispatch } from '@/app/hooks'
import { createPatientThunk } from '@/features/patient/patientSlice'
import { toast } from '@/shared/ui/sonner'
import type { ApiError } from '@/api'

export function CreatePatientForm() {
  const dispatch = useAppDispatch()
  const [formData, setFormData] = useState({
    fullName: '',
    dateOfBirth: '',
    gender: 'male' as const,
    phoneNumber: '',
    email: '',
    address: '',
  })
  const [errors, setErrors] = useState<Record<string, string[]>>({})

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    try {
      await dispatch(createPatientThunk(formData)).unwrap()
      toast.success('Patient created successfully')
      
      // Reset form
      setFormData({
        fullName: '',
        dateOfBirth: '',
        gender: 'male',
        phoneNumber: '',
        email: '',
        address: '',
      })
    } catch (error: any) {
      // Handle validation errors
      if (error.errors) {
        setErrors(error.errors)
        toast.error('Please fix the form errors')
      } else {
        toast.error(`Failed to create patient: ${error.message || error}`)
      }
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Full Name</label>
        <input
          type="text"
          value={formData.fullName}
          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
        />
        {errors.fullName && (
          <span className="error">{errors.fullName.join(', ')}</span>
        )}
      </div>

      <div>
        <label>Date of Birth</label>
        <input
          type="date"
          value={formData.dateOfBirth}
          onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
        />
        {errors.dateOfBirth && (
          <span className="error">{errors.dateOfBirth.join(', ')}</span>
        )}
      </div>

      <div>
        <label>Gender</label>
        <select
          value={formData.gender}
          onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
        >
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div>
        <label>Phone Number</label>
        <input
          type="tel"
          value={formData.phoneNumber}
          onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
        />
        {errors.phoneNumber && (
          <span className="error">{errors.phoneNumber.join(', ')}</span>
        )}
      </div>

      <div>
        <label>Email (Optional)</label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
      </div>

      <div>
        <label>Address</label>
        <textarea
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
        />
        {errors.address && (
          <span className="error">{errors.address.join(', ')}</span>
        )}
      </div>

      <button type="submit">Create Patient</button>
    </form>
  )
}
```

---

## 4. File Upload Example

### Upload Service

```typescript
import { baseApi } from '@/api'
import type { ApiResponse } from '@/api'

export interface UploadResponse {
  fileId: string
  fileName: string
  fileUrl: string
  fileSize: number
}

export const uploadService = {
  /**
   * Upload file with progress tracking
   */
  async uploadFile(
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<UploadResponse> {
    const formData = new FormData()
    formData.append('file', file)

    const response = await baseApi.post<ApiResponse<UploadResponse>>(
      '/api/upload',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total && onProgress) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            )
            onProgress(percentCompleted)
          }
        },
      }
    )

    return response.data!
  },

  /**
   * Upload multiple files
   */
  async uploadMultipleFiles(files: File[]): Promise<UploadResponse[]> {
    const formData = new FormData()
    files.forEach((file) => {
      formData.append('files', file)
    })

    const response = await baseApi.post<ApiResponse<UploadResponse[]>>(
      '/api/upload/multiple',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    )

    return response.data!
  },
}
```

### Upload Component

```typescript
import { useState } from 'react'
import { uploadService } from '@/services/upload.service'
import { toast } from '@/shared/ui/sonner'

export function FileUpload() {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setProgress(0)

    try {
      const result = await uploadService.uploadFile(file, setProgress)
      toast.success(`File uploaded: ${result.fileName}`)
      console.log('Uploaded file URL:', result.fileUrl)
    } catch (error: any) {
      toast.error(`Upload failed: ${error.message}`)
    } finally {
      setUploading(false)
      setProgress(0)
    }
  }

  return (
    <div>
      <input
        type="file"
        onChange={handleFileChange}
        disabled={uploading}
      />
      
      {uploading && (
        <div>
          <progress value={progress} max={100} />
          <span>{progress}%</span>
        </div>
      )}
    </div>
  )
}
```

---

## 5. Real-time Search with Debounce

```typescript
import { useState, useEffect } from 'react'
import { patientService } from '@/services/patient.service'
import { useDebounce } from '@/hooks/useDebounce'

export function PatientSearch() {
  const [searchTerm, setSearchTerm] = useState('')
  const [results, setResults] = useState<Patient[]>([])
  const [loading, setLoading] = useState(false)
  
  const debouncedSearch = useDebounce(searchTerm, 500)

  useEffect(() => {
    if (!debouncedSearch) {
      setResults([])
      return
    }

    const searchPatients = async () => {
      setLoading(true)
      try {
        const data = await patientService.getPatients(1, 10, debouncedSearch)
        setResults(data.data)
      } catch (error) {
        console.error('Search failed:', error)
      } finally {
        setLoading(false)
      }
    }

    searchPatients()
  }, [debouncedSearch])

  return (
    <div>
      <input
        type="text"
        placeholder="Search patients..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      
      {loading && <div>Searching...</div>}
      
      {results.length > 0 && (
        <ul>
          {results.map((patient) => (
            <li key={patient.id}>
              {patient.fullName} - {patient.medicalRecordNumber}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
```

---

## 6. Custom Hook for API Calls

```typescript
import { useState, useCallback } from 'react'
import type { ApiError } from '@/api'

export function useApi<T, P extends unknown[] = []>(
  apiFunc: (...args: P) => Promise<T>
) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const execute = useCallback(
    async (...args: P) => {
      setLoading(true)
      setError(null)

      try {
        const result = await apiFunc(...args)
        setData(result)
        return result
      } catch (err) {
        const apiError = err as ApiError
        setError(apiError.message)
        throw err
      } finally {
        setLoading(false)
      }
    },
    [apiFunc]
  )

  const reset = useCallback(() => {
    setData(null)
    setError(null)
    setLoading(false)
  }, [])

  return { data, loading, error, execute, reset }
}

// Usage
function MyComponent() {
  const {
    data: patients,
    loading,
    error,
    execute: fetchPatients
  } = useApi(patientService.getPatients)

  useEffect(() => {
    fetchPatients(1, 20)
  }, [fetchPatients])

  return (
    <div>
      {loading && <div>Loading...</div>}
      {error && <div>Error: {error}</div>}
      {patients && <div>Found {patients.total} patients</div>}
    </div>
  )
}
```

---

These examples demonstrate production-ready patterns for using the baseApi module in a real healthcare application!
