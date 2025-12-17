import { useState } from "react"
import { Button } from "@/shared/ui/button"
import { DangKyKham } from "./ui/DangKyKham"
import { TiepNhanBenhNhan } from "./ui/TiepNhanBenhNhan"
import { tiepNhanApi } from "./api/tiepNhanApi"
import { toast } from "sonner"
import { TiepNhanFormProvider } from "./context/TiepNhanFormContext"
import { useTiepNhanForm } from "./hooks/useTiepNhanForm"
import type { PaymentType } from "./model/bhytTypes"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/shared/ui/dialog"
import type { FieldErrorMap } from "./model/tiepnhan.validation"
import { createDefaultTheBaoHiem } from "./context/TiepNhanFormContext"

function TiepNhanPageContent() {
  const [isLoading, setIsLoading] = useState(false)
  const { formData, getApiRequest, resetForm, validateAll, updateTheBaoHiem } = useTiepNhanForm()
  const [paymentType, setPaymentType] = useState<PaymentType>("THU_PHI")
  const [pendingPaymentType, setPendingPaymentType] = useState<PaymentType | null>(null)
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const hasBhytData = Boolean(
    formData.theBaoHiem.insuranceNumber ||
      formData.theBaoHiem.registrationPlace ||
      formData.theBaoHiem.addressOnCard
  )

  const clearBhytData = () => {
    updateTheBaoHiem(createDefaultTheBaoHiem())
  }

  const focusFirstInvalidField = (errors: FieldErrorMap) => {
    if (typeof document === "undefined") return
    const firstPath = Object.keys(errors)[0]
    if (!firstPath) return
    const fieldContainer = document.querySelector<HTMLElement>(`[data-field-path="${firstPath}"]`)
    if (!fieldContainer) return
    const isFocusable = (el: HTMLElement) =>
      ["INPUT", "SELECT", "TEXTAREA", "BUTTON"].includes(el.tagName) || el.hasAttribute("tabindex")
    const fallbackTarget =
      fieldContainer.querySelector<HTMLElement>("input, select, textarea, button, [tabindex]:not([tabindex='-1'])") ||
      (isFocusable(fieldContainer) ? fieldContainer : null)

    if (!fallbackTarget) return
    try {
      fallbackTarget.focus()
      fallbackTarget.scrollIntoView({ block: "center", behavior: "smooth" })
    } catch {
      // no-op
    }
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
      // Collect data from form context and transform to API request
      const requestData = getApiRequest()

      console.log("Submitting data:", requestData)

      const result = await tiepNhanApi.createTiepNhan(requestData)

      if (result.is_succeeded && result.code === 200) {
        toast.success(result.message || "Lưu thông tin thành công!")

        // Log response data for debugging
        if (result.data) {
          console.log("Registration successful:", {
            id: result.data.id,
            tiep_nhan_id: result.data.tiep_nhan_id,
            benh_nhan_id: result.data.benh_nhan_id,
            ho_ten: result.data.ho_ten,
          })
        }
      } else {
        toast.error(result.message || "Lưu thông tin thất bại!")
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra khi lưu thông tin!")
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
      return
    }

    if (hasBhytData) {
      setPendingPaymentType(nextType)
      setConfirmDialogOpen(true)
      return
    }

    setPaymentType(nextType)
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
    clearBhytData()
    setPendingPaymentType(null)
    setConfirmDialogOpen(false)
  }

  return (
    <div className="flex h-[calc(100vh-56px)] flex-col bg-gray-50">
      <div className="flex-1 min-h-0 overflow-visible">
        <div className="h-full overflow-hidden rounded-xl border border-sky-100 bg-white shadow-sm">
          <div className="flex h-full flex-col">
            <div className="flex-1 overflow-y-auto px-2 py-2 pb-32">
              <div className="grid gap-6 lg:grid-cols-10">
                <div className="space-y-6 lg:col-span-6">
                  <TiepNhanBenhNhan
                    paymentType={paymentType}
                    onPaymentChange={handlePaymentChange}
                    hasBhytData={hasBhytData}
                  />
                </div>

                <div className="space-y-6 lg:col-span-4">
                  <DangKyKham paymentType={paymentType} />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pointer-events-none sticky bottom-0 left-0 right-0 mt-8 border-t border-slate-200 bg-white/90 px-4 py-4 backdrop-blur">
                <div className="pointer-events-auto flex flex-wrap justify-end gap-3">
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
      </div>
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
