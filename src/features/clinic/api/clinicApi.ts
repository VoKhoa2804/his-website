/**
 * Clinic API
 * Handles all clinic-related API calls using baseApi.
 */

import { api } from '@/api'
import type {
  Clinic,
  ClinicFilter,
  ClinicPagingResult,
  CreateClinicPayload,
  UpdateClinicPayload,
} from '../model/clinicTypes'

const PK_API_BASE = import.meta.env.VITE_PK_API_BASE as string

/**
 * Fetch paginated clinics with optional search filter
 */
export async function getClinics(
  filter: ClinicFilter
): Promise<ClinicPagingResult> {
  // Call backend with specific baseURL override
  const response = await api.get<{ data: Clinic[] }>('/api/phongkhams/getall', {
    baseURL: PK_API_BASE,
  })

  // Client-side filtering and pagination (matching current behavior)
  let list = response?.data || []
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
 * Fetch single clinic by ID
 */
export async function getClinicById(id: string): Promise<Clinic> {
  return api.get<Clinic>(`/api/phongkhams/${id}`, {
    baseURL: PK_API_BASE,
  })
}

/**
 * Create new clinic
 */
export async function createClinic(
  payload: CreateClinicPayload
): Promise<Clinic> {
  return api.post<Clinic>('/api/phongkhams', payload, {
    baseURL: PK_API_BASE,
  })
}

/**
 * Update existing clinic
 */
export async function updateClinic(
  payload: UpdateClinicPayload
): Promise<Clinic> {
  return api.put<Clinic>(`/api/phongkhams/${payload.id}`, payload, {
    baseURL: PK_API_BASE,
  })
}

/**
 * Delete clinic by ID
 */
export async function deleteClinic(id: string): Promise<void> {
  await api.delete(`/api/phongkhams/${id}`, {
    baseURL: PK_API_BASE,
  })
}

export const clinicApi = {
  getClinics,
  getClinicById,
  createClinic,
  updateClinic,
  deleteClinic,
}
