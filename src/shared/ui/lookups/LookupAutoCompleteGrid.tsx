import { useMemo, useCallback } from "react"
import type { ReactNode } from "react"
import { LookupAutocomplete, type LookupValue } from "@/shared/ui/lookup-autocomplete"
import { ValidatedField } from "@/shared/ui/validated-field"
import { cn } from "@/shared/utils/cn"
import type { LookupOption } from "./LookupField"

export type LookupAutoCompleteGridColumn = {
  header: string
  accessor: (option: LookupOption) => ReactNode
  width?: number | string
  searchValue?: (option: LookupOption) => string | number | null | undefined
}

export interface LookupAutoCompleteGridProps {
  label: string
  value?: string
  onChange: (value: string) => void
  options: LookupOption[]
  columns: LookupAutoCompleteGridColumn[]
  required?: boolean
  loading?: boolean
  placeholder?: string
  error?: string
  fieldPath?: string
  disabled?: boolean
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
}

type DatasetItem = Record<string, any>

function resolveWidth(column: LookupAutoCompleteGridColumn, fallbackPercent: number) {
  if (column.width === undefined || column.width === null) {
    return `${fallbackPercent}%`
  }
  if (typeof column.width === "number") {
    return `${column.width}%`
  }
  return column.width
}

function toPlainText(value: React.ReactNode): string {
  if (value === null || value === undefined) return ""
  if (typeof value === "string" || typeof value === "number") {
    return String(value)
  }
  return ""
}

export function LookupAutoCompleteGrid({
  label,
  value,
  onChange,
  options,
  columns,
  required,
  loading,
  placeholder = "Chọn",
  error,
  fieldPath,
  disabled,
  showAllOnEmpty = true,
  emptyResultLimit = 100,
  touched,
  dirty,
  submitted,
  valuePresent,
  isTouched,
  isDirty,
  isSubmitted,
  hasValue,
  helperText,
}: LookupAutoCompleteGridProps) {
  const columnFields = useMemo(
    () => columns.map((_, index) => `__col_${index}`),
    [columns],
  )

  const dataset: DatasetItem[] = useMemo(() => {
    return options.map((option) => {
      const item: DatasetItem = {
        id: option.value,
        ma: option.ma ?? option.value,
        ten: option.label ?? option.value,
        originalOption: option,
        __option: option,
        meta: option.meta,
      }

      columnFields.forEach((field, idx) => {
        const column = columns[idx]
        if (!column) return
        const searchValue = column.searchValue?.(option)
        if (searchValue !== undefined && searchValue !== null) {
          item[field] = searchValue
          return
        }
        const rendered = column.accessor(option)
        item[field] = toPlainText(rendered)
      })

      return item
    })
  }, [options, columns, columnFields])

  const displayColumns = useMemo(
    () =>
      columns.map((column, index) => ({
        headerName: column.header,
        field: columnFields[index],
        width: column.width,
      })),
    [columns, columnFields],
  )

  const searchFields = useMemo(
    () => ["ma", "ten", ...columnFields],
    [columnFields],
  )

  const currentOption = useMemo(
    () => options.find((option) => option.value === value),
    [options, value],
  )

  const handleSelect = useCallback(
    (selection: LookupValue) => {
      if (!selection?.id) return
      onChange(selection.id)
    },
    [onChange],
  )

  const renderColumns = useCallback(
    (option: LookupOption) => {
      const total = columns.length || 1
      return (
        <div className="flex w-full items-center">
          {columns.map((column, index) => (
            <div
              key={`${option.value}-${index}`}
              className="px-2 text-sm"
              style={{ width: resolveWidth(column, 100 / total), flexShrink: 0 }}
            >
              <div className="truncate">{column.accessor(option)}</div>
            </div>
          ))}
        </div>
      )
    },
    [columns],
  )

  const renderItem = useCallback(
    (item: DatasetItem, _query: string) => {
      const option = (item.__option as LookupOption) ?? item.originalOption
      if (!option) return null
      return <div className="py-1.5">{renderColumns(option)}</div>
    },
    [renderColumns],
  )

  const resolvedPlaceholder = loading ? "Đang tải..." : placeholder
  const isDisabled = disabled || loading

  const resolvedHasValue = valuePresent ?? hasValue ?? Boolean(value)
  const resolvedTouched = touched ?? isTouched
  const resolvedDirty = dirty ?? isDirty
  const resolvedSubmitted = submitted ?? isSubmitted
  const computedHelperText = helperText

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
          localData={dataset}
          minChars={0}
          take={50}
          placeholder={resolvedPlaceholder}
          inputClassName="h-9 text-sm"
          initialId={value}
          initialName={currentOption?.label}
          showHeader
          showBorders
          popupAppendToBody={false}
          onSelect={handleSelect}
          displayColumns={displayColumns}
          renderItem={renderItem}
          searchFields={searchFields}
          showAllOnEmpty={showAllOnEmpty}
          emptyResultLimit={emptyResultLimit}
          disabled={isDisabled}
          validationState={validationState}
          showStatusIcon={showStatusIcon}
          statusIconAriaLabel={statusIconAriaLabel}
        />
      )}
    </ValidatedField>
  )
}
