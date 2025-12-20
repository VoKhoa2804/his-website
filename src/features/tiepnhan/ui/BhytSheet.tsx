import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/ui/dialog"
import { Input } from "@/shared/ui/input"
import { Button } from "@/shared/ui/button"
import { ValidatedField } from "@/shared/ui/validated-field"
import type { BhytInfo, BhytStatus } from "../model/bhytTypes"

interface BhytSheetProps {
  open: boolean
  initialValue?: BhytInfo | null
  onOpenChange: (open: boolean) => void
  onSave: (info: BhytInfo) => void
}

const STATUS_COLORS: Record<BhytStatus, string> = {
  VALID: "bg-emerald-100 text-emerald-800",
  INVALID: "bg-red-100 text-red-700",
  EXPIRED: "bg-amber-100 text-amber-800",
  UNKNOWN: "bg-gray-100 text-gray-600",
}

const EMPTY_INFO: BhytInfo = {
  maThe: "",
  mucHuong: "",
  maKV: "",
  diaChiThe: "",
  tuNgay: "",
  denNgay: "",
  ngayDu5Nam: "",
  ngayMienCct: "",
  noiDangKyKcb: "",
  soGiayChuyenTuyen: "",
  maIcdChanDoan: "",
  chanDoan: "",
  status: "UNKNOWN",
  statusMessage: "Chưa kiểm tra",
}

function isValidDate(value?: string) {
  if (!value) return true
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(value)) return false
  const [day, month, year] = value.split("/").map(Number)
  const date = new Date(year, month - 1, day)
  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  )
}

function parseDate(value?: string) {
  if (!value || !isValidDate(value)) return null
  const [day, month, year] = value.split("/").map(Number)
  return new Date(year, month - 1, day)
}

type InteractionState = {
  touched: boolean
  dirty: boolean
}

type BhytFieldKey = keyof BhytInfo

export function BhytSheet({ open, initialValue, onOpenChange, onSave }: BhytSheetProps) {
  const [form, setForm] = useState<BhytInfo>(initialValue || EMPTY_INFO)
  const [status, setStatus] = useState<BhytStatus>(initialValue?.status || "UNKNOWN")
  const [statusMessage, setStatusMessage] = useState<string>(initialValue?.statusMessage || "Chưa kiểm tra")
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [interactions, setInteractions] = useState<Record<BhytFieldKey, InteractionState>>({})
  const maTheRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    if (!open) return
    const timer = window.setTimeout(() => {
      setForm(initialValue || EMPTY_INFO)
      setStatus(initialValue?.status || "UNKNOWN")
      setStatusMessage(initialValue?.statusMessage || "Chưa kiểm tra")
      setFieldErrors({})
      setInteractions({})
      setTimeout(() => maTheRef.current?.focus(), 20)
    }, 0)
    return () => window.clearTimeout(timer)
  }, [open, initialValue])

  const disableSave = useMemo(() => !form.maThe || form.maThe.trim().length < 10, [form.maThe])

  const markTouched = useCallback((field: BhytFieldKey) => {
    setInteractions((prev) => ({
      ...prev,
      [field]: { touched: true, dirty: prev[field]?.dirty ?? false },
    }))
  }, [])

  const markDirty = useCallback((field: BhytFieldKey) => {
    setInteractions((prev) => ({
      ...prev,
      [field]: { touched: prev[field]?.touched ?? false, dirty: true },
    }))
  }, [])

  const getInteraction = useCallback(
    (field: BhytFieldKey): InteractionState => interactions[field] ?? { touched: false, dirty: false },
    [interactions],
  )

  const hasValue = (field: BhytFieldKey) => {
    const value = form[field]
    if (typeof value === "string") {
      return value.trim().length > 0
    }
    return Boolean(value)
  }

  const clearFieldError = (field: BhytFieldKey) => {
    setFieldErrors((prev) => {
      if (!prev[field]) return prev
      const next = { ...prev }
      delete next[field]
      return next
    })
  }

  const setValidationState = useCallback((nextStatus: BhytStatus, message: string) => {
    setStatus(nextStatus)
    setStatusMessage(message)
  }, [])

  const handleValidate = useCallback(() => {
    const nextErrors: Record<string, string> = {}
    if (!form.maThe?.trim()) {
      nextErrors.maThe = "Vui lòng nhập mã thẻ BHYT"
    } else if (form.maThe.trim().length < 10) {
      nextErrors.maThe = "Mã thẻ cần tối thiểu 10 ký tự"
    }
    if (!form.maKV?.trim()) {
      nextErrors.maKV = "Vui lòng nhập mã KV"
    }
    if (!form.diaChiThe?.trim()) {
      nextErrors.diaChiThe = "Vui lòng nhập địa chỉ theo thẻ"
    }
    if (!form.noiDangKyKcb?.trim()) {
      nextErrors.noiDangKyKcb = "Vui lòng nhập nơi đăng ký KCB"
    }

    ;(["tuNgay", "denNgay", "ngayDu5Nam", "ngayMienCct"] as BhytFieldKey[]).forEach((field) => {
      const value = form[field]
      if (value && !isValidDate(value)) {
        nextErrors[field] = "Định dạng ngày phải là dd/MM/yyyy"
      }
    })

    setFieldErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      setValidationState("INVALID", "Vui lòng kiểm tra lại thông tin bắt buộc")
      return
    }

    const expireDate = parseDate(form.denNgay)
    if (expireDate && expireDate < new Date()) {
      setValidationState("EXPIRED", "Thẻ đã quá hạn hiệu lực")
      return
    }

    setValidationState("VALID", "Thông tin thẻ hợp lệ")
  }, [form, setValidationState])

  const handleInputChange = (field: BhytFieldKey) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }))
    markDirty(field)
    clearFieldError(field)
  }

  const handleSave = () => {
    onSave({
      ...form,
      status,
      statusMessage,
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="fixed right-0 top-0 left-auto z-50 h-full w-full max-w-xl translate-x-0 translate-y-0 rounded-none border-0 border-l bg-white shadow-2xl transition-transform data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:translate-x-full overflow-hidden p-0">
        <DialogHeader className="border-b px-6 py-4">
          <DialogTitle className="text-lg font-semibold">
            🪪 Thẻ Bảo hiểm y tế
          </DialogTitle>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_COLORS[status]}`}>
              {status === "VALID" && "Đã xác thực"}
              {status === "INVALID" && "Sai thông tin"}
              {status === "EXPIRED" && "Hết hạn"}
              {status === "UNKNOWN" && "Chưa kiểm tra"}
            </span>
            {statusMessage && <span>{statusMessage}</span>}
          </div>
        </DialogHeader>

        <div className="flex h-full flex-col overflow-hidden">
          <div className="flex-1 space-y-8 overflow-y-auto px-6 py-6">
            <section className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Thông tin thẻ</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="col-span-1 sm:col-span-2">
                  <ValidatedField
                    label="Mã thẻ *"
                    required
                    error={fieldErrors.maThe}
                    touched={getInteraction("maThe").touched}
                    dirty={getInteraction("maThe").dirty}
                    valuePresent={hasValue("maThe")}
                  >
                    {({ validationState, showStatusIcon, statusIconAriaLabel }) => (
                      <Input
                        ref={maTheRef}
                        value={form.maThe}
                        onChange={(event) => {
                          handleInputChange("maThe")(event)
                        }}
                        onBlur={() => markTouched("maThe")}
                        onKeyDown={(event) => {
                          if (event.key === "Enter") {
                            event.preventDefault()
                            handleValidate()
                          }
                        }}
                        placeholder="VD: HC4010123456789"
                        className="mt-1 h-10 text-sm"
                        validationState={validationState}
                        showStatusIcon={showStatusIcon}
                        statusIconAriaLabel={statusIconAriaLabel}
                      />
                    )}
                  </ValidatedField>
                </div>
                <div>
                  <ValidatedField
                    label="Mức hưởng"
                    touched={getInteraction("mucHuong").touched}
                    dirty={getInteraction("mucHuong").dirty}
                    valuePresent={hasValue("mucHuong")}
                  >
                    {({ validationState, showStatusIcon, statusIconAriaLabel }) => (
                      <Input
                        value={form.mucHuong || ""}
                        onChange={handleInputChange("mucHuong")}
                        onBlur={() => markTouched("mucHuong")}
                        placeholder="VD: 80%"
                        className="mt-1 h-10 text-sm"
                        validationState={validationState}
                        showStatusIcon={showStatusIcon}
                        statusIconAriaLabel={statusIconAriaLabel}
                      />
                    )}
                  </ValidatedField>
                </div>
                <div>
                  <ValidatedField
                    label="Mã KV"
                    required
                    error={fieldErrors.maKV}
                    touched={getInteraction("maKV").touched}
                    dirty={getInteraction("maKV").dirty}
                    valuePresent={hasValue("maKV")}
                  >
                    {({ validationState, showStatusIcon, statusIconAriaLabel }) => (
                      <Input
                        value={form.maKV || ""}
                        onChange={handleInputChange("maKV")}
                        onBlur={() => markTouched("maKV")}
                        placeholder="Nhập mã khu vực"
                        className="mt-1 h-10 text-sm"
                        validationState={validationState}
                        showStatusIcon={showStatusIcon}
                        statusIconAriaLabel={statusIconAriaLabel}
                      />
                    )}
                  </ValidatedField>
                </div>
                <div className="sm:col-span-2">
                  <ValidatedField
                    label="Địa chỉ theo thẻ"
                    required
                    error={fieldErrors.diaChiThe}
                    touched={getInteraction("diaChiThe").touched}
                    dirty={getInteraction("diaChiThe").dirty}
                    valuePresent={hasValue("diaChiThe")}
                  >
                    {({ validationState, showStatusIcon, statusIconAriaLabel }) => (
                      <Input
                        value={form.diaChiThe || ""}
                        onChange={handleInputChange("diaChiThe")}
                        onBlur={() => markTouched("diaChiThe")}
                        placeholder="Nhập địa chỉ thẻ"
                        className="mt-1 h-10 text-sm"
                        validationState={validationState}
                        showStatusIcon={showStatusIcon}
                        statusIconAriaLabel={statusIconAriaLabel}
                      />
                    )}
                  </ValidatedField>
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Hiệu lực</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <ValidatedField
                    label="Bảo hiểm từ ngày"
                    error={fieldErrors.tuNgay}
                    touched={getInteraction("tuNgay").touched}
                    dirty={getInteraction("tuNgay").dirty}
                    valuePresent={hasValue("tuNgay")}
                  >
                    {({ validationState, showStatusIcon, statusIconAriaLabel }) => (
                      <Input
                        value={form.tuNgay || ""}
                        onChange={handleInputChange("tuNgay")}
                        onBlur={() => markTouched("tuNgay")}
                        placeholder="dd/MM/yyyy"
                        className="mt-1 h-10 text-sm"
                        validationState={validationState}
                        showStatusIcon={showStatusIcon}
                        statusIconAriaLabel={statusIconAriaLabel}
                      />
                    )}
                  </ValidatedField>
                </div>
                <div>
                  <ValidatedField
                    label="Bảo hiểm đến ngày"
                    error={fieldErrors.denNgay}
                    touched={getInteraction("denNgay").touched}
                    dirty={getInteraction("denNgay").dirty}
                    valuePresent={hasValue("denNgay")}
                  >
                    {({ validationState, showStatusIcon, statusIconAriaLabel }) => (
                      <Input
                        value={form.denNgay || ""}
                        onChange={handleInputChange("denNgay")}
                        onBlur={() => markTouched("denNgay")}
                        placeholder="dd/MM/yyyy"
                        className="mt-1 h-10 text-sm"
                        validationState={validationState}
                        showStatusIcon={showStatusIcon}
                        statusIconAriaLabel={statusIconAriaLabel}
                      />
                    )}
                  </ValidatedField>
                </div>
                <div>
                  <ValidatedField
                    label="Ngày đủ 5 năm"
                    error={fieldErrors.ngayDu5Nam}
                    touched={getInteraction("ngayDu5Nam").touched}
                    dirty={getInteraction("ngayDu5Nam").dirty}
                    valuePresent={hasValue("ngayDu5Nam")}
                  >
                    {({ validationState, showStatusIcon, statusIconAriaLabel }) => (
                      <Input
                        value={form.ngayDu5Nam || ""}
                        onChange={handleInputChange("ngayDu5Nam")}
                        onBlur={() => markTouched("ngayDu5Nam")}
                        placeholder="dd/MM/yyyy"
                        className="mt-1 h-10 text-sm"
                        validationState={validationState}
                        showStatusIcon={showStatusIcon}
                        statusIconAriaLabel={statusIconAriaLabel}
                      />
                    )}
                  </ValidatedField>
                </div>
                <div>
                  <ValidatedField
                    label="Ngày miễn CCT"
                    error={fieldErrors.ngayMienCct}
                    touched={getInteraction("ngayMienCct").touched}
                    dirty={getInteraction("ngayMienCct").dirty}
                    valuePresent={hasValue("ngayMienCct")}
                  >
                    {({ validationState, showStatusIcon, statusIconAriaLabel }) => (
                      <Input
                        value={form.ngayMienCct || ""}
                        onChange={handleInputChange("ngayMienCct")}
                        onBlur={() => markTouched("ngayMienCct")}
                        placeholder="dd/MM/yyyy"
                        className="mt-1 h-10 text-sm"
                        validationState={validationState}
                        showStatusIcon={showStatusIcon}
                        statusIconAriaLabel={statusIconAriaLabel}
                      />
                    )}
                  </ValidatedField>
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Nơi KCB & chuyển tuyến</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <ValidatedField
                    label="Nơi đăng ký KCB ban đầu"
                    required
                    error={fieldErrors.noiDangKyKcb}
                    touched={getInteraction("noiDangKyKcb").touched}
                    dirty={getInteraction("noiDangKyKcb").dirty}
                    valuePresent={hasValue("noiDangKyKcb")}
                  >
                    {({ validationState, showStatusIcon, statusIconAriaLabel }) => (
                      <Input
                        value={form.noiDangKyKcb || ""}
                        onChange={handleInputChange("noiDangKyKcb")}
                        onBlur={() => markTouched("noiDangKyKcb")}
                        placeholder="Tên cơ sở KCB"
                        className="mt-1 h-10 text-sm"
                        validationState={validationState}
                        showStatusIcon={showStatusIcon}
                        statusIconAriaLabel={statusIconAriaLabel}
                      />
                    )}
                  </ValidatedField>
                </div>
                <div>
                  <ValidatedField
                    label="Số giấy chuyển tuyến"
                    touched={getInteraction("soGiayChuyenTuyen").touched}
                    dirty={getInteraction("soGiayChuyenTuyen").dirty}
                    valuePresent={hasValue("soGiayChuyenTuyen")}
                  >
                    {({ validationState, showStatusIcon, statusIconAriaLabel }) => (
                      <Input
                        value={form.soGiayChuyenTuyen || ""}
                        onChange={handleInputChange("soGiayChuyenTuyen")}
                        onBlur={() => markTouched("soGiayChuyenTuyen")}
                        placeholder="Nhập số giấy"
                        className="mt-1 h-10 text-sm"
                        validationState={validationState}
                        showStatusIcon={showStatusIcon}
                        statusIconAriaLabel={statusIconAriaLabel}
                      />
                    )}
                  </ValidatedField>
                </div>
                <div>
                  <ValidatedField
                    label="Mã ICD chẩn đoán"
                    touched={getInteraction("maIcdChanDoan").touched}
                    dirty={getInteraction("maIcdChanDoan").dirty}
                    valuePresent={hasValue("maIcdChanDoan")}
                  >
                    {({ validationState, showStatusIcon, statusIconAriaLabel }) => (
                      <Input
                        value={form.maIcdChanDoan || ""}
                        onChange={handleInputChange("maIcdChanDoan")}
                        onBlur={() => markTouched("maIcdChanDoan")}
                        placeholder="VD: J18.9"
                        className="mt-1 h-10 text-sm"
                        validationState={validationState}
                        showStatusIcon={showStatusIcon}
                        statusIconAriaLabel={statusIconAriaLabel}
                      />
                    )}
                  </ValidatedField>
                </div>
                <div className="sm:col-span-2">
                  <ValidatedField
                    label="Chẩn đoán"
                    touched={getInteraction("chanDoan").touched}
                    dirty={getInteraction("chanDoan").dirty}
                    valuePresent={hasValue("chanDoan")}
                  >
                    {({ validationState, showStatusIcon, statusIconAriaLabel }) => (
                      <Input
                        value={form.chanDoan || ""}
                        onChange={handleInputChange("chanDoan")}
                        onBlur={() => markTouched("chanDoan")}
                        placeholder="Nhập chẩn đoán"
                        className="mt-1 h-10 text-sm"
                        validationState={validationState}
                        showStatusIcon={showStatusIcon}
                        statusIconAriaLabel={statusIconAriaLabel}
                      />
                    )}
                  </ValidatedField>
                </div>
              </div>
            </section>
          </div>

          <div className="border-t bg-gray-50 px-6 py-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-xs text-gray-500">
                Nhấn "Kiểm tra thẻ" để xác minh thông tin trước khi lưu.
              </div>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <Button variant="outline" onClick={handleValidate}>
                  Kiểm tra thẻ
                </Button>
                <Button variant="ghost" onClick={() => onOpenChange(false)}>
                  Hủy
                </Button>
                <Button onClick={handleSave} disabled={disableSave}>
                  Lưu &amp; áp dụng
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
