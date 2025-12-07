/**
 * Work Shift Feature Exports
 * Central export point for the work shift feature
 */

export { WorkShiftListPage } from './ui/WorkShiftListPage'
export { WorkShiftStatusBadge } from './ui/WorkShiftStatusBadge'
export { DataTable } from './ui/data-table'
export { columns } from './ui/columns'
export { useWorkShifts } from './hooks/useWorkShifts'
export type {
  WorkShift,
  WorkShiftFilter,
  WorkShiftPagingResult,
  CreateWorkShiftPayload,
  UpdateWorkShiftPayload,
  WorkShiftState,
} from './model/workShiftTypes'
export {
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
} from './model/workShiftSlice'
export { default as workShiftReducer } from './model/workShiftSlice'
