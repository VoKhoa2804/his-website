import { useCallback } from 'react'
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
