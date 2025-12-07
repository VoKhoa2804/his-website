import React, { useEffect } from 'react'
import { LookupAutocomplete } from '@/shared/ui/lookup-autocomplete'
import { useWorkShifts } from '../hooks/useWorkShifts'
import type { WorkShift } from '../model/workShiftTypes'

interface WorkShiftLookupProps {
  onSelect?: (shift: WorkShift | null) => void
  placeholder?: string
  className?: string
  initialId?: string
  initialName?: string
  showHeader?: boolean
  showBorders?: boolean
}

/**
 * Redux-integrated WorkShift lookup component
 * Automatically loads data from Redux store and keeps it in sync
 */
export const WorkShiftLookup: React.FC<WorkShiftLookupProps> = ({
  onSelect,
  placeholder = 'Nhập mã hoặc tên ca làm việc...',
  className,
  initialId,
  initialName,
  showHeader = true,
  showBorders = true,
}) => {
  const { items, loading, loadWorkShifts } = useWorkShifts()

  // Load data on mount if not already loaded
  useEffect(() => {
    if (items.length === 0 && !loading) {
      loadWorkShifts()
    }
  }, [items.length, loading, loadWorkShifts])

  return (
    <LookupAutocomplete
      localData={items}
      minChars={0}
      take={50}
      placeholder={placeholder}
      className={className}
      initialId={initialId}
      initialName={initialName}
      displayColumns={[
        { headerName: 'Mã', field: 'ma', width: 30 },
        { headerName: 'Tên ca', field: 'ten', width: 70 },
      ]}
      searchFields={['ma', 'ten']}
      showHeader={showHeader}
      showBorders={showBorders}
      popupAppendToBody={false}
      onSelect={(value) => {
        onSelect?.(value.item as WorkShift)
      }}
    />
  )
}
