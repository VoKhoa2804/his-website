/**
 * Example: Using the Redux-based IcdSelectDialog
 * 
 * This example shows how to use the refactored IcdSelectDialog that leverages
 * Redux Toolkit for state management.
 */

import { useState } from 'react'
import { IcdSelectDialog, IcdDialogResult } from './IcdSelectDialog.redux'
import { Button } from '@/shared/ui/button'

export function IcdSelectDialogExample() {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedDiagnoses, setSelectedDiagnoses] = useState<
    Array<{ id: string; code: string; name: string }>
  >([])

  const handleOpenDialog = () => {
    setIsOpen(true)
    // Redux will handle the rest when IcdSelectDialog mounts
  }

  const handleCloseDialog = () => {
    setIsOpen(false)
  }

  const handleConfirm = (result: IcdDialogResult) => {
    console.log('Selected IDs:', result.selectedIds)
    console.log('Selected Rows:', result.selectedRows)
    console.log('Category ID:', result.categoryId)

    // Update local state with selected diagnoses
    const newDiagnoses = result.selectedRows.map((row) => ({
      id: row.id,
      code: row.code,
      name: row.name,
    }))

    setSelectedDiagnoses((prev) => [...prev, ...newDiagnoses])
    setIsOpen(false)
  }

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4">ICD Dialog Example (Redux)</h2>

      <Button onClick={handleOpenDialog} className="mb-4">
        Open ICD Dialog
      </Button>

      {selectedDiagnoses.length > 0 && (
        <div className="mt-4">
          <h3 className="text-sm font-medium mb-2">Selected Diagnoses:</h3>
          <ul className="space-y-1">
            {selectedDiagnoses.map((diagnosis) => (
              <li key={diagnosis.id} className="text-sm">
                <strong>{diagnosis.code}</strong>: {diagnosis.name}
              </li>
            ))}
          </ul>
        </div>
      )}

      <IcdSelectDialog
        open={isOpen}
        onClose={handleCloseDialog}
        onConfirm={handleConfirm}
        title="Chẩn đoán bệnh"
      />
    </div>
  )
}

/**
 * Key Differences from the Old (Local State) Version:
 * 
 * 1. No internal state management - all state is in Redux
 * 2. Can dispatch actions from anywhere in the app
 * 3. Redux DevTools shows full state and action history
 * 4. Multiple dialogs can coexist without conflicts
 * 5. State is predictable and debuggable
 * 
 * Redux DevTools will show:
 * - [selectDialog] openDialog: "icd-select"
 * - [selectDialog] setSearchTerm: { dialogId: "icd-select", value: "viêm" }
 * - [selectDialog] toggleSelect: { dialogId: "icd-select", id: "20" }
 * - [selectDialog] closeDialog: "icd-select"
 */

/**
 * Advanced Usage: Programmatic Control
 * 
 * You can control the dialog from anywhere in your app using Redux actions:
 */

import { useDispatch } from 'react-redux'
import { openDialog, toggleSelect } from '@/shared/store/selectDialog'

export function AdvancedExample() {
  const dispatch = useDispatch()

  const openDialogFromAnywhere = () => {
    // Open the dialog programmatically
    dispatch(openDialog('icd-select'))
  }

  const preSelectItems = () => {
    // Pre-select items programmatically
    dispatch(toggleSelect({ dialogId: 'icd-select', id: '1' }))
    dispatch(toggleSelect({ dialogId: 'icd-select', id: '2' }))
  }

  return (
    <div>
      <Button onClick={openDialogFromAnywhere}>
        Open ICD Dialog (Programmatic)
      </Button>
      <Button onClick={preSelectItems} className="ml-2">
        Pre-select Items
      </Button>
    </div>
  )
}
