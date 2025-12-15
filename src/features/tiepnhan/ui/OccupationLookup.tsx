import React, { useEffect } from 'react'
import { LookupAutocomplete } from '@/shared/ui/lookup-autocomplete'
import { useOccupations } from '../hooks/useOccupations'
import type { Occupation } from '../model/occupationTypes'

interface OccupationLookupProps {
  onSelect?: (occupation: Occupation | null) => void
  placeholder?: string
  className?: string
  inputClassName?: string
  initialId?: string
  initialName?: string
  showHeader?: boolean
  showBorders?: boolean
}

/**
 * Occupation lookup component
 * Provides searchable autocomplete for occupation selection
 */
export const OccupationLookup: React.FC<OccupationLookupProps> = ({
  onSelect,
  placeholder = 'Nhập mã hoặc tên nghề nghiệp...',
  className,
  inputClassName,
  initialId,
  initialName,
  showHeader = true,
  showBorders = true,
}) => {
  const { items, loading, loadOccupations } = useOccupations()

  // Load data on mount if not already loaded
  useEffect(() => {
    if (items.length === 0 && !loading) {
      loadOccupations()
    }
  }, [items.length, loading, loadOccupations])

  return (
    <LookupAutocomplete
      localData={items}
      minChars={0}
      take={50}
      placeholder={placeholder}
      className={className}
      inputClassName={inputClassName}
      initialId={initialId}
      initialName={initialName}
      displayColumns={[
        { headerName: 'Mã', field: 'ma', width: 30 },
        { headerName: 'Nghề nghiệp', field: 'ten', width: 70 },
      ]}
      searchFields={['ma', 'ten']}
      showHeader={showHeader}
      showBorders={showBorders}
      popupAppendToBody={false}
      onSelect={(value) => {
        onSelect?.(value.item as Occupation)
      }}
    />
  )
}
