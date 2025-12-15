import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/ui/dialog"
import { Input } from "@/shared/ui/input"
import { Label } from "@/shared/ui/label"
import { Button } from "@/shared/ui/button"
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

export function BhytSheet({ open, initialValue, onOpenChange, onSave }: BhytSheetProps) {
  const [form, setForm] = useState<BhytInfo>(initialValue || EMPTY_INFO)
  const [status, setStatus] = useState<BhytStatus>(initialValue?.status || "UNKNOWN")
  const [statusMessage, setStatusMessage] = useState<string>(initialValue?.statusMessage || "Chưa kiểm tra")
  const maTheRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    if (open) {
      setForm(initialValue || EMPTY_INFO)
      setStatus(initialValue?.status || "UNKNOWN")
      setStatusMessage(initialValue?.statusMessage || "Chưa kiểm tra")
      setTimeout(() => maTheRef.current?.focus(), 20)
    }
  }, [open, initialValue])

  const disableSave = useMemo(() => !form.maThe || form.maThe.trim().length < 10, [form.maThe])

  const setValidationState = useCallback((nextStatus: BhytStatus, message: string) => {
    setStatus(nextStatus)
    setStatusMessage(message)
  }, [])

  const handleValidate = useCallback(() => {
    if (!form.maThe || form.maThe.trim().length < 10) {
      setValidationState("INVALID", "Mã thẻ cần tối thiểu 10 ký tự")
      return
    }

    const dateFields = [form.tuNgay, form.denNgay, form.ngayDu5Nam, form.ngayMienCct]
    if (dateFields.some((value) => !isValidDate(value))) {
      setValidationState("INVALID", "Định dạng ngày phải là dd/MM/yyyy")
      return
    }

    const expireDate = parseDate(form.denNgay)
    if (expireDate && expireDate < new Date()) {
      setValidationState("EXPIRED", "Thẻ đã quá hạn hiệu lực")
      return
    }

    setValidationState("VALID", "Thông tin thẻ hợp lệ")
  }, [form, setValidationState])

  const handleInputChange = (field: keyof BhytInfo) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }))
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
                  <Label className="text-sm font-medium">Mã thẻ *</Label>
                  <Input
                    ref={maTheRef}
                    value={form.maThe}
                    onChange={handleInputChange("maThe")}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault()
                        handleValidate()
                      }
                    }}
                    placeholder="VD: HC4010123456789"
                    className="mt-1 h-10 text-sm"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium">Mức hưởng</Label>
                  <Input
                    value={form.mucHuong || ""}
                    onChange={handleInputChange("mucHuong")}
                    placeholder="VD: 80%"
                    className="mt-1 h-10 text-sm"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium">Mã KV</Label>
                  <Input
                    value={form.maKV || ""}
                    onChange={handleInputChange("maKV")}
                    placeholder="Nhập mã khu vực"
                    className="mt-1 h-10 text-sm"
                  />
                </div>
                <div className="sm:col-span-2">
                  <Label className="text-sm font-medium">Địa chỉ theo thẻ</Label>
                  <Input
                    value={form.diaChiThe || ""}
                    onChange={handleInputChange("diaChiThe")}
                    placeholder="Nhập địa chỉ thẻ"
                    className="mt-1 h-10 text-sm"
                  />
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Hiệu lực</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <Label className="text-sm font-medium">Bảo hiểm từ ngày</Label>
                  <Input
                    value={form.tuNgay || ""}
                    onChange={handleInputChange("tuNgay")}
                    placeholder="dd/MM/yyyy"
                    className="mt-1 h-10 text-sm"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium">Bảo hiểm đến ngày</Label>
                  <Input
                    value={form.denNgay || ""}
                    onChange={handleInputChange("denNgay")}
                    placeholder="dd/MM/yyyy"
                    className="mt-1 h-10 text-sm"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium">Ngày đủ 5 năm</Label>
                  <Input
                    value={form.ngayDu5Nam || ""}
                    onChange={handleInputChange("ngayDu5Nam")}
                    placeholder="dd/MM/yyyy"
                    className="mt-1 h-10 text-sm"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium">Ngày miễn CCT</Label>
                  <Input
                    value={form.ngayMienCct || ""}
                    onChange={handleInputChange("ngayMienCct")}
                    placeholder="dd/MM/yyyy"
                    className="mt-1 h-10 text-sm"
                  />
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Nơi KCB & chuyển tuyến</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <Label className="text-sm font-medium">Nơi đăng ký KCB ban đầu</Label>
                  <Input
                    value={form.noiDangKyKcb || ""}
                    onChange={handleInputChange("noiDangKyKcb")}
                    placeholder="Tên cơ sở KCB"
                    className="mt-1 h-10 text-sm"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium">Số giấy chuyển tuyến</Label>
                  <Input
                    value={form.soGiayChuyenTuyen || ""}
                    onChange={handleInputChange("soGiayChuyenTuyen")}
                    placeholder="Nhập số giấy"
                    className="mt-1 h-10 text-sm"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium">Mã ICD chẩn đoán</Label>
                  <Input
                    value={form.maIcdChanDoan || ""}
                    onChange={handleInputChange("maIcdChanDoan")}
                    placeholder="VD: J18.9"
                    className="mt-1 h-10 text-sm"
                  />
                </div>
                <div className="sm:col-span-2">
                  <Label className="text-sm font-medium">Chẩn đoán</Label>
                  <Input
                    value={form.chanDoan || ""}
                    onChange={handleInputChange("chanDoan")}
                    placeholder="Nhập chẩn đoán"
                    className="mt-1 h-10 text-sm"
                  />
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
