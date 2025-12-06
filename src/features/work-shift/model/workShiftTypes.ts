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
