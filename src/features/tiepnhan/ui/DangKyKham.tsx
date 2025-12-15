import type { ReactNode } from "react";
import { Camera, QrCode, User } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { Button } from "@/shared/ui/button";
import { Label } from "@/shared/ui/label";
import { useTiepNhanForm } from "../hooks/useTiepNhanForm";

export function DangKyKham() {
  const { formData, updateDangKyKham } = useTiepNhanForm()
  const dangKyData = formData.dangKyKham

  return (
    <Card className="border border-sky-100 bg-sky-50/50 shadow-sm ring-1 ring-sky-200">
      {/* HEADER */}
      <CardHeader className="bg-sky-700 text-white px-4 py-3 shadow-sm shadow-sky-800/30">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-sm font-semibold tracking-wide flex items-center gap-2">
            <User className="w-4 h-4 text-white" />
            THÔNG TIN TIẾP ĐÓN
          </CardTitle>
          <CardDescription className="text-[11px] text-white/80">
            Kiểm tra kỹ thông tin trước khi lưu
          </CardDescription>
        </div>
      </CardHeader>

      {/* BODY */}
      <CardContent className="p-5 space-y-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
          <div className="mx-auto flex flex-col items-center gap-3 rounded-2xl bg-white p-4 shadow-sm shadow-sky-100">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gray-200 flex items-center justify-center relative">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-300" />
              <Button
                type="button"
                size="icon"
                variant="default"
                className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-blue-600 hover:bg-blue-700"
              >
                <Camera className="w-3 h-3" />
              </Button>
            </div>
            <p className="text-xs text-gray-500 text-center max-w-[140px]">
              Nhấn để cập nhật ảnh bệnh nhân
            </p>
          </div>

          <div className="flex-1 grid grid-cols-1 gap-4 md:grid-cols-12">
            <div className="md:col-span-4">
              <Field label="Mã tiếp đón">
                <div className="relative">
                  <Input
                    value={dangKyData.receptionCode}
                    onChange={(e) =>
                      updateDangKyKham({ receptionCode: e.target.value })
                    }
                    placeholder="Quét QR hoặc nhập tay"
                    className="h-9 pr-10 text-sm"
                  />
                  <QrCode className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground cursor-pointer" />
                </div>
              </Field>
            </div>

            <div className="md:col-span-4">
              <Field label="Loại KCB">
                <Select
                  value={dangKyData.visitType}
                  onValueChange={(value) =>
                    updateDangKyKham({ visitType: value })
                  }
                >
                  <SelectTrigger className="h-9 text-sm bg-white">
                    <SelectValue placeholder="Chọn" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kham-moi">Khám mới</SelectItem>
                    <SelectItem value="tai-kham">Tái khám</SelectItem>
                    <SelectItem value="cap-cuu">Cấp cứu</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            </div>

            <div className="md:col-span-4">
              <Field label="Đối tượng KCB">
                <Select
                  value={dangKyData.department}
                  onValueChange={(value) =>
                    updateDangKyKham({ department: value })
                  }
                >
                  <SelectTrigger className="h-9 text-sm bg-white">
                    <SelectValue placeholder="Chọn" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ngoai-tong-quat">
                      Ngoại tổng quát
                    </SelectItem>
                    <SelectItem value="noi-tong-quat">
                      Nội tổng quát
                    </SelectItem>
                    <SelectItem value="kham-yc">Khám yêu cầu</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            </div>

            <div className="md:col-span-8">
              <Field label="Lý do đến khám">
                <Input
                  value={dangKyData.visitReason}
                  onChange={(e) =>
                    updateDangKyKham({ visitReason: e.target.value })
                  }
                  placeholder="VD: Đau bụng, tái khám..."
                  className="h-9 text-sm"
                />
              </Field>
            </div>

            <div className="md:col-span-4">
              <Field label="Người giới thiệu">
                <Select
                  value={dangKyData.referrer}
                  onValueChange={(value) =>
                    updateDangKyKham({ referrer: value })
                  }
                >
                  <SelectTrigger className="h-9 text-sm bg-white">
                    <SelectValue placeholder="Chọn" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tu-den">1. Tự đến</SelectItem>
                    <SelectItem value="chuyen-vien">
                      2. Giới thiệu / chuyển viện
                    </SelectItem>
                    <SelectItem value="dv">9. KCB Dịch vụ</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            </div>

            <div className="md:col-span-4">
              <Field label="Phòng khám">
                <Select
                  value={dangKyData.room}
                  onValueChange={(value) =>
                    updateDangKyKham({ room: value })
                  }
                >
                  <SelectTrigger className="h-9 text-sm bg-white">
                    <SelectValue placeholder="Chọn phòng" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pk-01">PK 01</SelectItem>
                    <SelectItem value="pk-02">PK 02</SelectItem>
                    <SelectItem value="pk-03">PK 03</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            </div>

            <div className="md:col-span-4">
              <Field label="Ưu tiên tiếp đón">
                <Select
                  value={dangKyData.priorityLevel}
                  onValueChange={(value) =>
                    updateDangKyKham({ priorityLevel: value })
                  }
                >
                  <SelectTrigger className="h-9 text-sm bg-white">
                    <SelectValue placeholder="Chọn" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="khong">Không ưu tiên</SelectItem>
                    <SelectItem value="cao-tuoi">Người cao tuổi</SelectItem>
                    <SelectItem value="tre-em">Trẻ em</SelectItem>
                    <SelectItem value="cap-cuu">Cấp cứu</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/* ============================== */
/* FIELD COMPONENT TÁI SỬ DỤNG    */
/* ============================== */
function Field({
  label,
  children,
  required,
}: {
  label: string;
  children: ReactNode;
  required?: boolean;
}) {
  // Tách sao nếu label có *
  const hasStar = label.includes("*");
  const cleanLabel = hasStar ? label.replace("*", "").trim() : label;

  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-medium text-gray-700 flex items-center gap-1">
        {cleanLabel}
        {(required || hasStar) && (
          <span className="text-red-600">*</span>
        )}
      </Label>

      {children}
    </div>
  );
}
