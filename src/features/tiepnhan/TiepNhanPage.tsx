import { Button } from "@/shared/ui/button";
import { DangKyKham } from "./ui/DangKyKham";
import { TiepNhanGoiSTT } from "./ui/TiepNhanGoiSTT";
import { TiepNhanBenhNhan } from "./ui/TiepNhanBenhNhan";
import { TheBaoHiemYTe } from "./ui/TheBaoHiemYTe";


export function TiepNhanPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="flex-1 overflow-auto">
        <div className="w-full mx-auto px-4 py-6 space-y-4">
          {/* Patient Info and Order Management Section */}
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2">
              <DangKyKham />
            </div>
            <TiepNhanGoiSTT />
          </div>

          {/* Row 1 */}


          <div className="grid grid-cols-3 gap-4">
             <div className="col-span-2">
              <TiepNhanBenhNhan />
            </div>
            <TheBaoHiemYTe />
          </div>

          {/* Action Buttons */}
          <div className="sticky bottom-0 bg-gray-50 py-4 flex flex-col sm:flex-row justify-end gap-3 border-t border-gray-200">
            <Button
              variant="outline"
              className="w-full sm:w-auto text-sm font-medium"
            >
              Hủy tiếp đón
            </Button>

            <Button
              className="w-full sm:w-auto text-sm font-medium"
            >
              Lưu thông tin [F4]
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
