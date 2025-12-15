import { useState } from "react"
import { Button } from "@/shared/ui/button"
import { DangKyKham } from "./ui/DangKyKham"
import { TiepNhanBenhNhan } from "./ui/TiepNhanBenhNhan"
import { tiepNhanApi } from "./api/tiepNhanApi"
import { toast } from "sonner"
import { TiepNhanFormProvider } from "./context/TiepNhanFormContext"
import { useTiepNhanForm } from "./hooks/useTiepNhanForm"
import type { BhytInfo, PaymentType } from "./model/bhytTypes"
import { PaymentTypeSegment } from "./ui/PaymentTypeSegment"
import { BhytSheet } from "./ui/BhytSheet"
import { BhytSummaryCard } from "./ui/BhytSummaryCard"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/shared/ui/dialog"

function TiepNhanPageContent() {
  const [isLoading, setIsLoading] = useState(false)
  const { getApiRequest, resetForm } = useTiepNhanForm()
  const [paymentType, setPaymentType] = useState<PaymentType>("THU_PHI")
  const [bhytSheetOpen, setBhytSheetOpen] = useState(false)
  const [bhytInfo, setBhytInfo] = useState<BhytInfo | null>(null)
  const [pendingPaymentType, setPendingPaymentType] = useState<PaymentType | null>(null)
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)

  const handleSave = async () => {
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
      setBhytSheetOpen(true)
      return
    }

    if (bhytInfo) {
      setPendingPaymentType(nextType)
      setConfirmDialogOpen(true)
      return
    }

    setPaymentType(nextType)
  }

  const handleSaveBhytInfo = (info: BhytInfo) => {
    setBhytInfo(info)
    setPaymentType("BHYT")
    setBhytSheetOpen(false)
  }

  const handleEditBhyt = () => {
    setBhytSheetOpen(true)
  }

  const handleDeleteBhyt = () => {
    setBhytInfo(null)
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
    setBhytInfo(null)
    setPendingPaymentType(null)
    setConfirmDialogOpen(false)
  }

  return (
    <div className="flex h-[calc(100vh-56px)] flex-col bg-gray-50">
      <div className="flex-1 min-h-0 overflow-visible">
        <div className="h-full overflow-hidden rounded-xl border border-sky-100 bg-white shadow-sm">
          <div className="flex h-full flex-col">
            <div className="flex-1 overflow-y-auto px-6 py-6 pb-32">
              <div className="grid gap-6 lg:grid-cols-2">
                <div className="space-y-6">
                  <DangKyKham />

                  <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
                    <div className="flex items-center justify-between gap-2 pb-3">
                      <div>
                        <p className="text-sm font-semibold text-slate-700">Đối tượng thanh toán</p>
                        <p className="text-xs text-slate-500">Chọn hình thức phù hợp. Chọn BHYT để nhập thông tin thẻ.</p>
                      </div>
                      {bhytInfo && (
                        <span className="text-xs text-slate-500">Đang sử dụng thẻ BHYT</span>
                      )}
                    </div>
                    <PaymentTypeSegment value={paymentType} onChange={handlePaymentChange} />
                    {bhytInfo && (
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

                <div className="space-y-6">
                  <TiepNhanBenhNhan />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex justify-end gap-3">
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
        initialValue={bhytInfo}
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
