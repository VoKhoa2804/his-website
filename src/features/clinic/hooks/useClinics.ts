import { useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import {
  fetchClinicsThunk,
  fetchClinicByIdThunk,
  createClinicThunk,
  updateClinicThunk,
  deleteClinicThunk,
  setSearch,
  setPageIndex,
  setPageSize,
  selectClinic,
  clearError,
  resetFilters,
} from '../model/clinicSlice'
import type {
  CreateClinicPayload,
  UpdateClinicPayload,
  Clinic,
} from '../model/clinicTypes'

/**
 * Custom hook for clinic operations
 * Abstracts Redux complexity from UI components
 */
export function useClinics() {
  const dispatch = useAppDispatch()
  const {
    items,
    selectedClinic,
    totalCount,
    pageIndex,
    pageSize,
    search,
    loading,
    error,
  } = useAppSelector((state) => state.clinic)

  // Load clinics with current filters
  const loadClinics = useCallback(() => {
    dispatch(
      fetchClinicsThunk({
        pageIndex,
        pageSize,
        search,
      })
    )
  }, [dispatch, pageIndex, pageSize, search])

  // Load single clinic by ID
  const loadClinicById = useCallback(
    async (id: string) => {
      return dispatch(fetchClinicByIdThunk(id)).unwrap()
    },
    [dispatch]
  )

  // Create new clinic
  const createClinic = useCallback(
    async (payload: CreateClinicPayload) => {
      return dispatch(createClinicThunk(payload)).unwrap()
    },
    [dispatch]
  )

  // Update clinic
  const updateClinic = useCallback(
    async (payload: UpdateClinicPayload) => {
      return dispatch(updateClinicThunk(payload)).unwrap()
    },
    [dispatch]
  )

  // Delete clinic
  const deleteClinic = useCallback(
    async (id: string) => {
      return dispatch(deleteClinicThunk(id)).unwrap()
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

  // Select clinic
  const selectClinicItem = useCallback(
    (clinic: Clinic | null) => {
      dispatch(selectClinic(clinic))
    },
    [dispatch]
  )

  // Clear error
  const clearClinicError = useCallback(() => {
    dispatch(clearError())
  }, [dispatch])

  // Reset filters
  const resetClinicFilters = useCallback(() => {
    dispatch(resetFilters())
  }, [dispatch])

  return {
    // State
    items,
    selectedClinic,
    totalCount,
    pageIndex,
    pageSize,
    search,
    loading,
    error,
    // Actions
    loadClinics,
    loadClinicById,
    createClinic,
    updateClinic,
    deleteClinic,
    updateSearch,
    changePage,
    changePageSize,
    selectClinicItem,
    clearClinicError,
    resetClinicFilters,
  }
}
