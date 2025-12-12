/**
 * Clinic Domain Types
 */

import type { PagingRequest, PagingResult } from '@/shared/types/api'

/**
 * Clinic entity
 */
export interface Clinic {
  id: string
  ma: string              // Code
  ten: string             // Name
  khoa?: string           // Department
  dia_chi?: string        // Address
  sdt?: string            // Phone
  hien_thi: boolean       // Display/Active status
  ghi_chu?: string        // Notes
}

/**
 * Filter for paginated clinic queries
 */
export interface ClinicFilter extends PagingRequest {
  search?: string
}

/**
 * Paginated clinic result
 */
export type ClinicPagingResult = PagingResult<Clinic>

/**
 * Payload for creating a new clinic
 */
export interface CreateClinicPayload {
  ma: string
  ten: string
  khoa?: string
  dia_chi?: string
  sdt?: string
  hien_thi: boolean
  ghi_chu?: string
}

/**
 * Payload for updating an existing clinic
 */
export interface UpdateClinicPayload extends CreateClinicPayload {
  id: string
}

/**
 * Redux state shape for clinics
 */
export interface ClinicState {
  items: Clinic[]
  selectedClinic: Clinic | null
  totalCount: number
  pageIndex: number
  pageSize: number
  search: string
  loading: boolean
  error: string | null
}
