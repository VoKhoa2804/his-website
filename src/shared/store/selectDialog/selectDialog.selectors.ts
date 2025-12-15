import { RootState } from '@/app/store'
import { SelectDialogState } from './selectDialog.slice'

/**
 * Default state when dialog doesn't exist yet
 */
const defaultDialogState: SelectDialogState = {
  open: false,
  searchTerm: '',
  selectedIds: [],
  focusedIndex: 0,
  categoryId: null,
}

/**
 * Gets the entire state for a specific dialog
 */
export const selectDialogState = (dialogId: string) => (state: RootState): SelectDialogState => {
  return state.selectDialog[dialogId] || defaultDialogState
}

/**
 * Checks if dialog is open
 */
export const selectIsDialogOpen = (dialogId: string) => (state: RootState): boolean => {
  return state.selectDialog[dialogId]?.open || false
}

/**
 * Gets search term
 */
export const selectSearchTerm = (dialogId: string) => (state: RootState): string => {
  return state.selectDialog[dialogId]?.searchTerm || ''
}

/**
 * Gets selected IDs
 */
export const selectSelectedIds = (dialogId: string) => (state: RootState): string[] => {
  return state.selectDialog[dialogId]?.selectedIds || []
}

/**
 * Gets focused index
 */
export const selectFocusedIndex = (dialogId: string) => (state: RootState): number => {
  return state.selectDialog[dialogId]?.focusedIndex || 0
}

/**
 * Gets active category ID
 */
export const selectCategoryId = (dialogId: string) => (state: RootState): string | null => {
  return state.selectDialog[dialogId]?.categoryId || null
}

/**
 * Checks if specific ID is selected
 */
export const selectIsIdSelected = (dialogId: string, id: string) => (state: RootState): boolean => {
  const selectedIds = state.selectDialog[dialogId]?.selectedIds || []
  return selectedIds.includes(id)
}

/**
 * Gets selection count
 */
export const selectSelectionCount = (dialogId: string) => (state: RootState): number => {
  return state.selectDialog[dialogId]?.selectedIds.length || 0
}
