/**
 * Work Shift API
 * Handles all work-shift-related API calls using baseApi.
 */

import { api } from '@/api'
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
  const response = await api.get<{ data: WorkShift[] }>('/api/calamviecs/getall', {
    baseURL: CV_API_BASE,
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
