import { createSlice, PayloadAction } from '@reduxjs/toolkit'

/**
 * Generic Select Dialog State
 * Each dialog instance is identified by a unique dialogId
 */
export interface SelectDialogState {
  open: boolean
  searchTerm: string
  selectedIds: string[]
  focusedIndex: number
  categoryId: string | null
}

/**
 * Store structure: dialogId -> SelectDialogState
 * Multiple dialogs can coexist independently
 */
export type SelectDialogStore = {
  [dialogId: string]: SelectDialogState
}

const initialDialogState: SelectDialogState = {
  open: false,
  searchTerm: '',
  selectedIds: [],
  focusedIndex: 0,
  categoryId: null,
}

const initialState: SelectDialogStore = {}

const selectDialogSlice = createSlice({
  name: 'selectDialog',
  initialState,
  reducers: {
    /**
     * Opens a dialog and resets its state
     * Optionally accepts initial selectedIds to pre-populate
     */
    openDialog: (
      state,
      action: PayloadAction<string | { dialogId: string; initialSelectedIds?: string[] }>
    ) => {
      const dialogId = typeof action.payload === 'string' 
        ? action.payload 
        : action.payload.dialogId
      const initialSelectedIds = typeof action.payload === 'object' 
        ? action.payload.initialSelectedIds || []
        : []
      
      state[dialogId] = { 
        ...initialDialogState, 
        open: true,
        selectedIds: initialSelectedIds,
      }
    },

    /**
     * Closes a dialog (preserves state for potential reopen)
     */
    closeDialog: (state, action: PayloadAction<string>) => {
      const dialogId = action.payload
      if (state[dialogId]) {
        state[dialogId].open = false
      }
    },

    /**
     * Updates search term
     */
    setSearchTerm: (
      state,
      action: PayloadAction<{ dialogId: string; value: string }>
    ) => {
      const { dialogId, value } = action.payload
      if (state[dialogId]) {
        state[dialogId].searchTerm = value
        state[dialogId].focusedIndex = 0 // Reset focus when searching
      }
    },

    /**
     * Toggles selection of a single ID
     */
    toggleSelect: (
      state,
      action: PayloadAction<{ dialogId: string; id: string }>
    ) => {
      const { dialogId, id } = action.payload
      if (!state[dialogId]) return

      const selectedIds = state[dialogId].selectedIds
      const index = selectedIds.indexOf(id)

      if (index > -1) {
        selectedIds.splice(index, 1)
      } else {
        selectedIds.push(id)
      }
    },

    /**
     * Clears all selections
     */
    clearSelection: (state, action: PayloadAction<string>) => {
      const dialogId = action.payload
      if (state[dialogId]) {
        state[dialogId].selectedIds = []
      }
    },

    /**
     * Sets focused row index (for keyboard navigation)
     */
    setFocusedIndex: (
      state,
      action: PayloadAction<{ dialogId: string; index: number }>
    ) => {
      const { dialogId, index } = action.payload
      if (state[dialogId]) {
        state[dialogId].focusedIndex = Math.max(0, index)
      }
    },

    /**
     * Sets active category ID
     */
    setCategory: (
      state,
      action: PayloadAction<{ dialogId: string; categoryId: string | null }>
    ) => {
      const { dialogId, categoryId } = action.payload
      if (state[dialogId]) {
        state[dialogId].categoryId = categoryId
      }
    },

    /**
     * Resets dialog to initial state (useful for cleanup)
     */
    resetDialog: (state, action: PayloadAction<string>) => {
      const dialogId = action.payload
      state[dialogId] = { ...initialDialogState }
    },
  },
})

export const {
  openDialog,
  closeDialog,
  setSearchTerm,
  toggleSelect,
  clearSelection,
  setFocusedIndex,
  setCategory,
  resetDialog,
} = selectDialogSlice.actions

export default selectDialogSlice.reducer
