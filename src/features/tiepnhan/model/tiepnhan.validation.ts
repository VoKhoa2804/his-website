import type { TiepNhanFormData } from "../context/TiepNhanFormContext"
import type { PaymentType } from "./bhytTypes"
import { dangKyKhamSchema, theBaoHiemSchema, tiepNhanBenhNhanSchema } from "./tiepnhan.schemas"

export type FieldErrorMap = Record<string, string>

export interface ValidateContext {
  paymentType?: PaymentType
}

export interface ValidationResult {
  ok: boolean
  errors: FieldErrorMap
}

function appendIssues(issues: { path: (string | number)[]; message: string }[], prefix: string, errors: FieldErrorMap) {
  for (const issue of issues) {
    const joinedPath = [prefix, ...issue.path].filter(Boolean).join(".")
    if (!errors[joinedPath]) {
      errors[joinedPath] = issue.message
    }
  }
}

export function validateTiepNhanForm(formData: TiepNhanFormData, context?: ValidateContext): ValidationResult {
  const errors: FieldErrorMap = {}

  const dangKyResult = dangKyKhamSchema.safeParse(formData.dangKyKham)
  if (!dangKyResult.success) {
    appendIssues(dangKyResult.error.issues, "dangKyKham", errors)
  }

  const benhNhanResult = tiepNhanBenhNhanSchema.safeParse(formData.tiepNhanBenhNhan)
  if (!benhNhanResult.success) {
    appendIssues(benhNhanResult.error.issues, "tiepNhanBenhNhan", errors)
  }

  if (context?.paymentType === "BHYT") {
    const bhytResult = theBaoHiemSchema.safeParse(formData.theBaoHiem)
    if (!bhytResult.success) {
      appendIssues(bhytResult.error.issues, "theBaoHiem", errors)
    }
  }

  return {
    ok: Object.keys(errors).length === 0,
    errors,
  }
}

export function getFieldError(errors: FieldErrorMap, path: string) {
  return errors[path]
}
