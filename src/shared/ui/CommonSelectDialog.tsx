import { useEffect, useRef, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Dialog, DialogContent, DialogTitle } from '@/shared/ui/dialog'
import { Button } from '@/shared/ui/button'
import { Checkbox } from '@/shared/ui/checkbox'
import { cn } from '@/shared/utils/cn'
import {
  selectDialogState,
  closeDialog,
  setSearchTerm,
  toggleSelect,
  setFocusedIndex,
} from '@/shared/store/selectDialog'

/**
 * Column definition for the table
 */
export interface ColumnDef<T> {
  key: string
  header: string
  width?: string // e.g., "40px", "112px", or leave undefined for auto
  render: (row: T, searchTerm: string, isSelected: boolean) => React.ReactNode
  className?: string
}

/**
 * Generic Select Dialog Props
 */
export interface CommonSelectDialogProps<T> {
  /** Unique identifier for this dialog instance (required for Redux) */
  dialogId: string

  /** Array of data rows to display */
  rows: T[]

  /** Function to extract unique key from each row */
  rowKey: (row: T) => string

  /** Column definitions for the table */
  columns: ColumnDef<T>[]

  /** Selection mode */
  selectable?: 'single' | 'multiple'

  /** Optional right panel content (e.g., categories) */
  rightPanel?: React.ReactNode

  /** Optional preview of selected items (displays above table) */
  selectedPreview?: (rows: T[]) => React.ReactNode

  /** Dialog title */
  title?: string

  /** Caption text below title */
  caption?: string

  /** Search placeholder */
  searchPlaceholder?: string

  /** Confirm button text */
  confirmText?: string

  /** Cancel button text */
  cancelText?: string

  /** Called when user confirms selection */
  onConfirm: (result: {
    selectedIds: string[]
    selectedRows: T[]
    categoryId: string | null
  }) => void

  /** Optional custom filter function (defaults to searching all columns) */
  filterRows?: (rows: T[], searchTerm: string) => T[]
}

/**
 * Generic reusable select dialog component
 * All state is managed by Redux - this is a pure UI component
 */
export function CommonSelectDialog<T>({
  dialogId,
  rows,
  rowKey,
  columns,
  selectable = 'multiple',
  rightPanel,
  selectedPreview,
  title = 'Select Items',
  caption,
  searchPlaceholder = 'Search...',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  filterRows,
}: CommonSelectDialogProps<T>) {
  const dispatch = useDispatch()
  const dialogState = useSelector(selectDialogState(dialogId))
  const { open, searchTerm, selectedIds, focusedIndex, categoryId } = dialogState

  const tableBodyRef = useRef<HTMLDivElement>(null)
  const rowRefs = useRef<Map<number, HTMLTableRowElement>>(new Map())

  // Filter rows based on search term
  const filteredRows = filterRows
    ? filterRows(rows, searchTerm)
    : rows // Let parent handle filtering if provided

  // Get selected rows for preview and confirmation
  const selectedRows = rows.filter((row) => selectedIds.includes(rowKey(row)))

  // Scroll focused row into view
  useEffect(() => {
    const focusedRow = rowRefs.current.get(focusedIndex)
    if (focusedRow && tableBodyRef.current) {
      const rowTop = focusedRow.offsetTop
      const rowBottom = rowTop + focusedRow.offsetHeight
      const scrollTop = tableBodyRef.current.scrollTop
      const scrollBottom = scrollTop + tableBodyRef.current.clientHeight

      if (rowTop < scrollTop) {
        tableBodyRef.current.scrollTop = rowTop
      } else if (rowBottom > scrollBottom) {
        tableBodyRef.current.scrollTop = rowBottom - tableBodyRef.current.clientHeight
      }
    }
  }, [focusedIndex])

  const handleToggleSelection = useCallback(
    (id: string) => {
      dispatch(toggleSelect({ dialogId, id }))
    },
    [dialogId, dispatch]
  )

  const handleConfirm = useCallback(() => {
    onConfirm({
      selectedIds,
      selectedRows,
      categoryId,
    })
    dispatch(closeDialog(dialogId))
  }, [selectedIds, selectedRows, categoryId, onConfirm, dialogId, dispatch])

  const handleClose = useCallback(() => {
    dispatch(closeDialog(dialogId))
  }, [dialogId, dispatch])

  // Keyboard navigation
  useEffect(() => {
    if (!open) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        handleClose()
        return
      }

      if (e.key === 'Enter') {
        e.preventDefault()
        handleConfirm()
        return
      }

      if (e.key === 'ArrowUp') {
        e.preventDefault()
        dispatch(setFocusedIndex({ dialogId, index: focusedIndex - 1 }))
        return
      }

      if (e.key === 'ArrowDown') {
        e.preventDefault()
        dispatch(
          setFocusedIndex({
            dialogId,
            index: Math.min(filteredRows.length - 1, focusedIndex + 1),
          })
        )
        return
      }

      if (e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault()
        const row = filteredRows[focusedIndex]
        if (row) {
          dispatch(toggleSelect({ dialogId, id: rowKey(row) }))
        }
        return
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open, focusedIndex, filteredRows, dialogId, dispatch, rowKey, handleConfirm, handleClose])

  return (
    <Dialog open={open} onOpenChange={handleClose} modal>
      <DialogContent
        className="p-0 gap-0 border-gray-400"
        style={{
          width: '80vw',
          height: '70vh',
          maxWidth: '80vw',
          maxHeight: '70vh',
          borderRadius: 0,
          boxShadow: 'none',
        }}
        onEscapeKeyDown={(e) => e.preventDefault()}
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
      >
        {/* Header - Blue bar */}
        <div className="bg-blue-600 text-white px-3 py-2 flex items-center justify-between border-b border-gray-400">
          <DialogTitle className="text-sm font-semibold">{title}</DialogTitle>
        </div>

        {/* Caption row */}
        {caption && (
          <div className="bg-gray-100 px-3 py-1 border-b border-gray-300">
            <span className="text-xs font-medium text-gray-700">{caption}</span>
          </div>
        )}

        {/* Search row */}
        <div className="px-3 py-2 border-b border-gray-300 bg-white">
          <div className="flex items-center gap-2">
            <input
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) =>
                dispatch(setSearchTerm({ dialogId, value: e.target.value }))
              }
              className="medical-input h-8 text-xs flex-1"
              autoFocus
            />
            <span className="text-[10px] text-gray-500 whitespace-nowrap">
              ↑↓: Di chuyển | Space: Chọn | Enter: Xác nhận
            </span>
          </div>
        </div>

        {/* Selected items preview */}
        {selectedPreview && selectedRows.length > 0 && (
          <div className="px-3 py-2 border-b border-gray-300 bg-blue-50">
            {selectedPreview(selectedRows)}
          </div>
        )}

        {/* Body - Table + Optional right panel */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left: Data Table */}
          <div className="flex-1 flex flex-col border-r border-gray-300 overflow-hidden">
            <div
              ref={tableBodyRef}
              className="flex-1 overflow-y-auto overflow-x-hidden"
            >
              <table className="w-full table-fixed">
                {/* Column widths */}
                <colgroup>
                  {selectable !== 'single' && <col style={{ width: '40px' }} />}
                  {columns.map((col, i) => (
                    <col key={i} style={col.width ? { width: col.width } : undefined} />
                  ))}
                </colgroup>

                {/* Table Header */}
                <thead className="sticky top-0 z-10 bg-gray-50 border-b border-gray-300">
                  <tr className="text-xs">
                    {selectable !== 'single' && (
                      <th className="px-2 py-1 text-left font-medium border-r border-gray-300"></th>
                    )}
                    {columns.map((col, i) => (
                      <th
                        key={i}
                        className={cn(
                          'px-2 py-1 text-left font-medium border-r border-gray-300',
                          col.className
                        )}
                      >
                        {col.header}
                      </th>
                    ))}
                  </tr>
                </thead>

                {/* Table Body */}
                <tbody>
                  {filteredRows.length === 0 ? (
                    <tr>
                      <td
                        colSpan={columns.length + (selectable !== 'single' ? 1 : 0)}
                        className="px-2 py-8 text-center text-xs text-gray-500"
                      >
                        Không tìm thấy kết quả phù hợp
                      </td>
                    </tr>
                  ) : (
                    filteredRows.map((row, index) => {
                      const id = rowKey(row)
                      const isSelected = selectedIds.includes(id)
                      const isFocused = index === focusedIndex

                      return (
                        <tr
                          key={id}
                          ref={(el) => {
                            if (el) rowRefs.current.set(index, el)
                            else rowRefs.current.delete(index)
                          }}
                          className={cn(
                            'text-xs border-b border-gray-200 cursor-pointer transition-colors',
                            isSelected && 'bg-blue-600 text-white hover:bg-blue-700',
                            !isSelected && 'hover:bg-gray-50',
                            isFocused &&
                              !isSelected &&
                              'ring-2 ring-inset ring-blue-400'
                          )}
                          onClick={() => handleToggleSelection(id)}
                        >
                          {selectable !== 'single' && (
                            <td className="px-2 py-1 border-r border-gray-300">
                              <Checkbox
                                checked={isSelected}
                                onCheckedChange={() => handleToggleSelection(id)}
                                className={cn(
                                  'h-4 w-4',
                                  isSelected &&
                                    'border-white data-[state=checked]:bg-white data-[state=checked]:text-blue-600'
                                )}
                              />
                            </td>
                          )}
                          {columns.map((col, i) => (
                            <td
                              key={i}
                              className={cn(
                                'px-2 py-1 border-r border-gray-300',
                                col.className
                              )}
                            >
                              {col.render(row, searchTerm, isSelected)}
                            </td>
                          ))}
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right: Optional panel (e.g., categories) */}
          {rightPanel && (
            <div className="w-52 flex flex-col bg-gray-50 overflow-hidden flex-shrink-0">
              {rightPanel}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 px-3 py-2 border-t border-gray-300 bg-gray-50 flex-shrink-0">
          <Button
            variant="outline"
            onClick={handleClose}
            className="h-8 text-xs rounded-none border-gray-400"
          >
            {cancelText}
          </Button>
          <Button
            onClick={handleConfirm}
            className="h-8 text-xs rounded-none bg-blue-600 hover:bg-blue-700"
            disabled={selectedIds.length === 0}
          >
            {confirmText} ({selectedIds.length})
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
