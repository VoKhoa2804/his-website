import { useState } from "react"
import { Button } from "@/shared/ui/button"
import { DangKyKham } from "./ui/DangKyKham"
import { TiepNhanBenhNhan } from "./ui/TiepNhanBenhNhan"
import { TheBaoHiemYTe } from "./ui/TheBaoHiemYTe"
import { tiepNhanApi } from "./api/tiepNhanApi"
import { toast } from "sonner"
import { TiepNhanFormProvider } from "./context/TiepNhanFormContext"
import { useTiepNhanForm } from "./hooks/useTiepNhanForm"

function TiepNhanPageContent() {
  const [isLoading, setIsLoading] = useState(false)
  const { getApiRequest, resetForm } = useTiepNhanForm()

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
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="flex-1 overflow-auto">
        <div className="w-full mx-auto px-4 py-6 pb-24">
          {/* Patient Info and Order Management Section */}
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2">
              <div className="grid gap-4">
                <DangKyKham />
                <TiepNhanBenhNhan />
              </div>
            </div>
            <TheBaoHiemYTe />

            {/* <TiepNhanGoiSTT /> */}
          </div>
        </div>
      </div>

      {/* Action Buttons - Fixed to Bottom */}
      <div className="fixed bottom-0 left-0 right-0 bg-white py-4 px-4 flex flex-col sm:flex-row justify-end gap-3 border-t border-gray-200 shadow-lg z-10">
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
  )
}

export function TiepNhanPage() {
  return (
    <TiepNhanFormProvider>
      <TiepNhanPageContent />
    </TiepNhanFormProvider>
  )
}
