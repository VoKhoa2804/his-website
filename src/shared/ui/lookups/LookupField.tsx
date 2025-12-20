import { LookupAutocomplete, type LookupValue } from "@/shared/ui/lookup-autocomplete"
import { ValidatedField } from "@/shared/ui/validated-field"
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
  touched?: boolean
  dirty?: boolean
  submitted?: boolean
  valuePresent?: boolean
  isTouched?: boolean
  isDirty?: boolean
  isSubmitted?: boolean
  hasValue?: boolean
  helperText?: string
  fieldPath?: string
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
  touched,
  dirty,
  submitted,
  valuePresent,
  isTouched,
  isDirty,
  isSubmitted,
  hasValue,
  helperText,
  fieldPath,
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

  const computedHelperText =
    helperText || (!loading && dataset.length === 0 && !onSearch ? emptyText : undefined)
  const resolvedHasValue = valuePresent ?? hasValue ?? Boolean(value ?? valueLabel)
  const resolvedTouched = touched ?? isTouched
  const resolvedDirty = dirty ?? isDirty
  const resolvedSubmitted = submitted ?? isSubmitted

  return (
    <ValidatedField
      label={label}
      required={required}
      error={error}
      helperText={computedHelperText}
      touched={resolvedTouched}
      dirty={resolvedDirty}
      submitted={resolvedSubmitted}
      valuePresent={resolvedHasValue}
      fieldPath={fieldPath}
      className={cn(isDisabled && "pointer-events-none opacity-60")}
    >
      {({ validationState, showStatusIcon, statusIconAriaLabel }) => (
        <LookupAutocomplete
          key={`${label}-${value || "empty"}`}
          localData={dataset}
          minChars={0}
          take={50}
          placeholder={resolvedPlaceholder}
          inputClassName="h-9 text-sm"
          initialId={value}
          initialName={currentOption?.label ?? valueLabel}
          showHeader={false}
          showBorders
          popupAppendToBody={false}
          onSelect={handleSelect}
          onFetchData={handleFetchData}
          showAllOnEmpty={showAllOnEmpty}
          emptyResultLimit={emptyResultLimit}
          disabled={isDisabled}
          validationState={validationState}
          showStatusIcon={showStatusIcon}
          statusIconMode="auto"
          statusIconAriaLabel={statusIconAriaLabel}
        />
      )}
    </ValidatedField>
  )
}
