import type { ReactNode } from "react"
import { Label } from "@/shared/ui/label"
import type { ValidationState } from "@/shared/ui/input"
import { cn } from "@/shared/utils/cn"

type InteractionBooleans = {
  touched?: boolean
  dirty?: boolean
  submitted?: boolean
  valuePresent?: boolean
}

type LegacyInteractionBooleans = {
  isTouched?: boolean
  isDirty?: boolean
  isSubmitted?: boolean
  hasValue?: boolean
}

export type ValidatedFieldProps = {
  label?: ReactNode
  required?: boolean
  error?: string
  helperText?: ReactNode
  className?: string
  fieldPath?: string
  showErrorMessage?: boolean
  children: (args: {
    validationState: ValidationState
    showStatusIcon: boolean
    statusIconAriaLabel?: string
  }) => ReactNode
} & InteractionBooleans &
  LegacyInteractionBooleans

const STATUS_LABELS: Record<Exclude<ValidationState, "default">, string> = {
  error: "Trường không hợp lệ",
  success: "Trường hợp lệ",
}

export function ValidatedField({
  label,
  required,
  error,
  helperText,
  className,
  fieldPath,
  children,
  showErrorMessage,
  touched,
  dirty,
  submitted,
  valuePresent,
  isTouched,
  isDirty,
  isSubmitted,
  hasValue,
}: ValidatedFieldProps) {
  const resolvedTouched = touched ?? isTouched ?? false
  const resolvedDirty = dirty ?? isDirty ?? false
  const resolvedSubmitted = submitted ?? isSubmitted ?? false
  const resolvedValuePresent = valuePresent ?? hasValue ?? false

  const interacted = Boolean(resolvedTouched || resolvedDirty || resolvedSubmitted)
  const showError = Boolean(error)
  const showSuccess = !showError && interacted && Boolean(resolvedValuePresent)

  let validationState: ValidationState = "default"
  let showStatusIcon = false
  let statusIconAriaLabel: string | undefined

  if (showError) {
    validationState = "error"
    showStatusIcon = true
    statusIconAriaLabel = STATUS_LABELS.error
  } else if (showSuccess) {
    validationState = "success"
    showStatusIcon = true
    statusIconAriaLabel = STATUS_LABELS.success
  }

  const shouldShowErrorMessage = showErrorMessage === true

  return (
    <div className={cn("space-y-1.5", className)} data-field-path={fieldPath}>
      {label !== undefined && (
        <Label className="flex items-center gap-1 text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-600">*</span>}
        </Label>
      )}

      {children({ validationState, showStatusIcon, statusIconAriaLabel })}

      {helperText && !showError && <p className="text-xs text-muted-foreground">{helperText}</p>}

      {showError && shouldShowErrorMessage && <p className="text-xs text-red-600">{error}</p>}
    </div>
  )
}
