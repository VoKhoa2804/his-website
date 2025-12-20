import { useMemo, useState } from "react"
import { Button } from "@/shared/ui/button"
import { DangKyKham } from "./ui/DangKyKham"
import { TiepNhanBenhNhan } from "./ui/TiepNhanBenhNhan"
import { tiepNhanApi } from "./api/tiepNhanApi"
import { toast } from "sonner"
import { TiepNhanFormProvider } from "./context/TiepNhanFormContext"
import { useTiepNhanForm } from "./hooks/useTiepNhanForm"
import type { BhytInfo, BhytStatus, PaymentType } from "./model/bhytTypes"
import type { TiepNhanFormData } from "./context/TiepNhanFormContext"
import { PaymentTypeSegment } from "./ui/PaymentTypeSegment"
import { BhytSheet } from "./ui/BhytSheet"
import { BhytSummaryCard } from "./ui/BhytSummaryCard"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/shared/ui/dialog"
import type { FieldErrorMap } from "./model/tiepnhan.validation"

const isoToDisplayDate = (value?: string) => {
  if (!value) return ""
  const [year, month, day] = value.split("-")
  if (!year || !month || !day) return ""
  return `${day}/${month}/${year}`
}

const displayToIsoDate = (value?: string) => {
  if (!value) return ""
  const parts = value.split("/")
  if (parts.length !== 3) return ""
  const [day, month, year] = parts
  if (!day || !month || !year) return ""
  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`
}

const mapBhytInfoToFormData = (info: BhytInfo): Partial<TiepNhanFormData["theBaoHiem"]> => ({
  insuranceNumber: info.maThe || "",
  benefitLevel: info.mucHuong || "",
  insuranceFrom: displayToIsoDate(info.tuNgay) || "",
  insuranceTo: displayToIsoDate(info.denNgay) || "",
  ngayDu5Nam: displayToIsoDate(info.ngayDu5Nam) || "",
  ngayMienCCT: displayToIsoDate(info.ngayMienCct) || "",
  registrationPlace: info.noiDangKyKcb || "",
  addressOnCard: info.diaChiThe || "",
  maKV: info.maKV || "",
  soGiayChuyenTuyen: info.soGiayChuyenTuyen || "",
  chanDoan: info.chanDoan || "",
  maIcdChanDoan: info.maIcdChanDoan || "",
})

const mapFormDataToBhytInfo = (
  formBhyt: TiepNhanFormData["theBaoHiem"],
  status: BhytStatus = "UNKNOWN",
  statusMessage = "Chưa kiểm tra",
): BhytInfo => ({
  maThe: formBhyt.insuranceNumber,
  mucHuong: formBhyt.benefitLevel,
  maKV: formBhyt.maKV,
  diaChiThe: formBhyt.addressOnCard,
  tuNgay: isoToDisplayDate(formBhyt.insuranceFrom),
  denNgay: isoToDisplayDate(formBhyt.insuranceTo),
  ngayDu5Nam: isoToDisplayDate(formBhyt.ngayDu5Nam),
  ngayMienCct: isoToDisplayDate(formBhyt.ngayMienCCT),
  noiDangKyKcb: formBhyt.registrationPlace,
  soGiayChuyenTuyen: formBhyt.soGiayChuyenTuyen,
  maIcdChanDoan: formBhyt.maIcdChanDoan,
  chanDoan: formBhyt.chanDoan,
  status,
  statusMessage,
})

const clearBhytFormData = (): Partial<TiepNhanFormData["theBaoHiem"]> => ({
  insuranceNumber: "",
  benefitLevel: "",
  insuranceFrom: "",
  insuranceTo: "",
  registrationPlace: "",
  referralPlace: "",
  transferNumber: "",
  icdDiagnosis: "",
  diagnosisText: "",
  poorHousehold: false,
  poorHouseholdNumber: "",
  hasAppointment: false,
  appointmentDate: "",
  appointmentTime: "",
  addressOnCard: "",
  maKV: "",
  ngayDu5Nam: "",
  ngayMienCCT: "",
  tenNoiChuyenTuyen: "",
  soGiayChuyenTuyen: "",
  chanDoan: "",
  maIcdChanDoan: "",
})

function TiepNhanPageContent() {
  const [isLoading, setIsLoading] = useState(false)
  const { getApiRequest, resetForm, validateAll, updateTheBaoHiem, formData } = useTiepNhanForm()
  const [paymentType, setPaymentType] = useState<PaymentType>("THU_PHI")
  const [bhytSheetOpen, setBhytSheetOpen] = useState(false)
  const [bhytStatus, setBhytStatus] = useState<{ status: BhytStatus; statusMessage?: string } | null>(null)
  const [pendingPaymentType, setPendingPaymentType] = useState<PaymentType | null>(null)
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const bhytInfo = useMemo(() => {
    const status = bhytStatus?.status ?? "UNKNOWN"
    const statusMessage = bhytStatus?.statusMessage ?? "Chưa kiểm tra"
    return mapFormDataToBhytInfo(formData.theBaoHiem, status, statusMessage)
  }, [formData.theBaoHiem, bhytStatus])
  const hasBhytData = Boolean(formData.theBaoHiem.insuranceNumber)

  const focusFirstInvalidField = (errors: FieldErrorMap) => {
    const firstPath = Object.keys(errors)[0]
    if (!firstPath) return
    const fieldContainer = document.querySelector<HTMLElement>(`[data-field-path="${firstPath}"]`)
    if (!fieldContainer) return
    const focusable =
      fieldContainer.querySelector<HTMLElement>("input, select, textarea, [role='combobox']") ||
      fieldContainer as HTMLElement
    focusable.focus()
  }

  const handleSave = async () => {
    const validation = validateAll({ paymentType })
    if (!validation.ok) {
      focusFirstInvalidField(validation.errors)
      toast.error("Vui lòng kiểm tra lại thông tin bắt buộc")
      return
    }

    setIsLoading(true)

    try {
      const requestData = getApiRequest()
      const result = await tiepNhanApi.createTiepNhan(requestData)

      if (result.is_succeeded && result.code === 200) {
        toast.success(result.message || "Lưu thông tin thành công!")
      } else {
        toast.error(result.message || "Lưu thông tin thất bại!")
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Có lỗi xảy ra khi lưu thông tin!"
      toast.error(message)
      console.error("Save error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    resetForm()
    toast.info("Đã hủy tiếp đón và xóa dữ liệu form")
  }

  const handlePaymentChange = (nextType: PaymentType) => {
    if (nextType === paymentType) return
    if (nextType === "BHYT") {
      setPaymentType("BHYT")
      setBhytSheetOpen(true)
      return
    }

    if (hasBhytData) {
      setPendingPaymentType(nextType)
      setConfirmDialogOpen(true)
      return
    }

    setPaymentType(nextType)
  }

  const handleSaveBhytInfo = (info: BhytInfo) => {
    updateTheBaoHiem(mapBhytInfoToFormData(info))
    setBhytStatus({ status: info.status, statusMessage: info.statusMessage })
    setPaymentType("BHYT")
    setBhytSheetOpen(false)
  }

  const handleEditBhyt = () => {
    setBhytSheetOpen(true)
  }

  const handleDeleteBhyt = () => {
    updateTheBaoHiem(clearBhytFormData())
    setBhytStatus(null)
    setPaymentType("THU_PHI")
  }

  const handleConfirmKeep = () => {
    if (pendingPaymentType) {
      setPaymentType(pendingPaymentType)
    }
    setPendingPaymentType(null)
    setConfirmDialogOpen(false)
  }

  const handleConfirmDelete = () => {
    if (pendingPaymentType) {
      setPaymentType(pendingPaymentType)
    } else {
      setPaymentType("THU_PHI")
    }
    updateTheBaoHiem(clearBhytFormData())
    setBhytStatus(null)
    setPendingPaymentType(null)
    setConfirmDialogOpen(false)
  }

  return (
    <div className="flex h-[calc(100vh-56px)] flex-col bg-gray-50">
      <div className="flex-1 min-h-0 overflow-visible">
        <div className="h-full overflow-hidden rounded-xl border border-sky-100 bg-white shadow-sm">
          <div className="flex h-full flex-col">
            <div className="flex-1 overflow-y-auto px-2 py-2 pb-2">
              <div className="grid gap-6 lg:grid-cols-10">
                <div className="space-y-6 lg:col-span-6">
                  <TiepNhanBenhNhan />

                  <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
                    <div className="flex items-center justify-between gap-2 pb-3">
                      <div>
                        <p className="text-sm font-semibold text-slate-700">Đối tượng thanh toán</p>
                        <p className="text-xs text-slate-500">Chọn hình thức phù hợp. Chọn BHYT để nhập thông tin thẻ.</p>
                      </div>
                      {hasBhytData && (
                        <span className="text-xs text-slate-500">Đang sử dụng thẻ BHYT</span>
                      )}
                    </div>
                    <PaymentTypeSegment value={paymentType} onChange={handlePaymentChange} />
                    {hasBhytData && (
                      <div className="mt-4">
                        <BhytSummaryCard
                          data={bhytInfo}
                          onEdit={handleEditBhyt}
                          onDelete={handleDeleteBhyt}
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-6 lg:col-span-4">
                  <DangKyKham />
                </div>
              </div>

              <div className="mt-2 flex justify-end gap-3">
                <Button
                  variant="outline"
                  className="w-full sm:w-auto text-sm font-medium"
                  onClick={handleCancel}
                  disabled={isLoading}
                >
                  Hủy tiếp đón
                </Button>

                <Button
                  className="w-full sm:w-auto text-sm font-medium"
                  onClick={handleSave}
                  disabled={isLoading}
                >
                  {isLoading ? "Đang lưu..." : "Lưu thông tin [F4]"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <BhytSheet
        open={bhytSheetOpen}
        initialValue={hasBhytData ? bhytInfo : null}
        onOpenChange={setBhytSheetOpen}
        onSave={handleSaveBhytInfo}
      />

      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Giữ thông tin thẻ BHYT?</DialogTitle>
            <DialogDescription>
              Bạn muốn giữ thông tin BHYT để dùng lại không?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:flex-row sm:justify-end">
            <Button variant="outline" onClick={handleConfirmKeep}>
              Giữ
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Xoá
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export function TiepNhanPage() {
  return (
    <TiepNhanFormProvider>
      <TiepNhanPageContent />
    </TiepNhanFormProvider>
  )
}
