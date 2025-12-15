import { LookupAutocomplete, type LookupValue } from "@/shared/ui/lookup-autocomplete"
import { Label } from "@/shared/ui/label"
import { cn } from "@/shared/utils/cn"

export type LookupOption = {
  value: string
  label: string
  ma?: string
  meta?: Record<string, any>
}

export interface LookupFieldProps {
  label: string
  value?: string
  onChange: (nextValue: string) => void
  options: LookupOption[]
  loading?: boolean
  placeholder?: string
  emptyText?: string
  disabled?: boolean
  error?: string
  required?: boolean
  onSearch?: (query: string) => Promise<LookupOption[]>
  valueLabel?: string
  onSelectOption?: (option: LookupOption) => void
  showAllOnEmpty?: boolean
  emptyResultLimit?: number
}

function mapToLookupAutocompleteData(options: LookupOption[]) {
  return options.map((option) => ({
    ...option,
    id: option.value,
    ma: option.ma ?? option.value,
    ten: option.label ?? option.value,
    originalOption: option,
  }))
}

export function LookupField({
  label,
  value,
  onChange,
  options,
  loading = false,
  placeholder = "Chọn",
  emptyText = "Chưa có dữ liệu",
  disabled = false,
  error,
  required,
  onSearch,
  valueLabel,
  onSelectOption,
  showAllOnEmpty,
  emptyResultLimit,
}: LookupFieldProps) {
  const dataset = mapToLookupAutocompleteData(options)
  const isDisabled = disabled || loading
  const resolvedPlaceholder = loading ? "Đang tải..." : placeholder
  const currentOption = options.find((option) => option.value === value)

  const handleSelect = (selection: LookupValue) => {
    onChange(selection.id)
    const option =
      (selection.item && (selection.item.originalOption as LookupOption)) ||
      (selection.name ? { value: selection.id, label: selection.name } : undefined)
    if (option) {
      onSelectOption?.(option)
    }
  }

  const handleFetchData = onSearch
    ? async (query: string) => {
        const result = await onSearch(query)
        return mapToLookupAutocompleteData(result)
      }
    : undefined

  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-medium text-gray-700 flex items-center gap-1">
        {label}
        {required && <span className="text-red-600">*</span>}
      </Label>

      <LookupAutocomplete
        key={`${label}-${value || "empty"}`}
        localData={dataset}
        minChars={0}
        take={50}
        placeholder={resolvedPlaceholder}
        className={cn(isDisabled && "pointer-events-none opacity-60")}
        inputClassName="h-9 text-sm"
        initialId={value}
        initialName={currentOption?.label ?? valueLabel}
        showHeader={false}
        showBorders
        popupAppendToBody={false}
        onSelect={(selection) => handleSelect(selection)}
        onFetchData={handleFetchData}
        showAllOnEmpty={showAllOnEmpty}
        emptyResultLimit={emptyResultLimit}
      />

      {!loading && dataset.length === 0 && !onSearch && (
        <p className="text-xs text-gray-500">{emptyText}</p>
      )}

      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  )
}
