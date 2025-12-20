import * as React from "react"
import { AlertCircle, CheckCircle2 } from "lucide-react"

import { cn } from "@/shared/utils/cn"

export type ValidationState = "default" | "error" | "success"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  validationState?: ValidationState
  showStatusIcon?: boolean
  statusIconMode?: "auto" | "always"
  statusIconAriaLabel?: string
  statusIconOffset?: number
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      validationState = "default",
      showStatusIcon = false,
      statusIconMode = "auto",
      statusIconAriaLabel,
      statusIconOffset = 0,
      ...props
    },
    ref,
  ) => {
    const isError = validationState === "error"
    const isSuccess = validationState === "success"
    const shouldShowIcon =
      showStatusIcon && (validationState !== "default" || statusIconMode === "always")

    // Reserve space whenever icons may appear to avoid layout shifts
    const shouldReserveSpace = showStatusIcon || statusIconMode === "always"

    const iconClass = cn(
      "pointer-events-none absolute top-1/2 h-4 w-4 -translate-y-1/2",
      isError && "text-red-500",
      isSuccess && "text-emerald-500",
    )
    const iconStyle = {
      right: `calc(0.75rem + ${statusIconOffset}px)`,
    }

    const baseClasses =
      "flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
    const stateClasses = cn(
      validationState === "default" && "border-input focus-visible:ring-ring",
      isError && "border-red-500 focus-visible:ring-red-500",
      isSuccess && "border-emerald-500 focus-visible:ring-emerald-500",
    )

    const iconAriaProps = statusIconAriaLabel
      ? { "aria-label": statusIconAriaLabel }
      : { "aria-hidden": true as const }

    return (
      <div className="relative">
        <input
          type={type}
          className={cn(baseClasses, stateClasses, shouldReserveSpace && "pr-10", className)}
          ref={ref}
          {...props}
        />
        {shouldShowIcon && isError && (
          <AlertCircle className={iconClass} style={iconStyle} {...iconAriaProps} />
        )}
        {shouldShowIcon && isSuccess && (
          <CheckCircle2 className={iconClass} style={iconStyle} {...iconAriaProps} />
        )}
      </div>
    )
  },
)
Input.displayName = "Input"

export { Input }
