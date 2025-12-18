import type { ReactNode } from "react";
import { Camera, Hospital, QrCode, User } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";
import { Label } from "@/shared/ui/label";
import { useTiepNhanForm } from "../hooks/useTiepNhanForm";
import { getFieldError } from "../model/tiepnhan.validation";
import { LookupField, type LookupOption } from "@/shared/ui/lookups";
import { useSelector } from "react-redux";
import { selectHanhChinhStatus, selectOptionsByKey } from "@/features/hanhchinh/model/hanhchinhSlice";
import { SectionTitle } from "@/shared/ui/sectiontitle";
import { Checkbox } from "@/shared/ui/checkbox";

function toLookupOptions(items: Array<{ id: string; ma?: string; ten?: string }> = []) {
  return items
    .filter(Boolean)
    .map((item) => ({
      value: item.ma || item.id,
      label: item.ten || item.ma || item.id,
      ma: item.ma,
    }))
}

export function DangKyKham() {
  const { formData, updateDangKyKham, fieldErrors } = useTiepNhanForm()
  const dangKyData = formData.dangKyKham
  const hanhChinhStatus = useSelector(selectHanhChinhStatus)
  const loading = hanhChinhStatus === "loading"
  const phongBanOptions = useSelector(selectOptionsByKey("PhongBan"))
  const uuTienOptions = useSelector(selectOptionsByKey("UuTien"))
  const bsGioiThieuOptions = useSelector(selectOptionsByKey("BsGioiThieu"))
  const loaiKcbOptions = useSelector(selectOptionsByKey("LoaiKCB"))
  const doiTuongKcbOptions = useSelector(selectOptionsByKey("DoiTuongKCB"))

  const loaiKcbLookupOptions = toLookupOptions(loaiKcbOptions)
  const doiTuongKcbLookupOptions = toLookupOptions(doiTuongKcbOptions)
  const phongBanLookupOptions = toLookupOptions(phongBanOptions)
  const uuTienLookupOptions = toLookupOptions(uuTienOptions)
  const bsGioiThieuLookupOptions = toLookupOptions(bsGioiThieuOptions)

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
          {/* <div className="mx-auto flex flex-col items-center gap-3 rounded-2xl bg-white p-4 shadow-sm shadow-sky-100">
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
          </div> */}

          <div className="flex-1 grid grid-cols-1 gap-4 md:grid-cols-12">

            <div className="md:col-span-6">
              <LookupField
                label="Loại KCB"
                required
                value={dangKyData.visitType}
                onChange={(value) => updateDangKyKham({ visitType: value })}
                options={loaiKcbLookupOptions}
                loading={loading}
                error={getFieldError(fieldErrors, "dangKyKham.visitType")}
              />
            </div>

            <div className="md:col-span-6">
              <LookupField
                label="Đối tượng KCB"
                required
                value={dangKyData.department}
                onChange={(value) => updateDangKyKham({ department: value })}
                options={doiTuongKcbLookupOptions}
                loading={loading}
                error={getFieldError(fieldErrors, "dangKyKham.department")}
              />
            </div>
            <div className="md:col-span-6">

 <Field label="Hộ nghèo / cận nghèo">
               <div className="flex items-center gap-2">
                <Checkbox
                  id="poorHousehold"
               
                />
               
                <div className="flex-1 ml-3">
                  <Input
                    // value={baoHiemData.poorHouseholdNumber}
                    // onChange={(e) =>
                    //   updateTheBaoHiem({
                    //     poorHouseholdNumber: e.target.value,
                    //   })
                    // }
                    placeholder="Số sổ"
                  />
                </div>
              </div> 
              </Field>

            </div>
            <div className="md:col-span-6">
              <LookupField
                label="Loại ưu tiên"
                value={dangKyData.uuTien}
                onChange={(value) => {
                  updateDangKyKham({
                    uuTien: value,
                    priorityLevel: value, // TODO: remove priorityLevel when legacy usages are cleaned up
                  })
                }}
                options={uuTienLookupOptions}
                loading={loading}
                error={getFieldError(fieldErrors, "dangKyKham.uuTien")}
              />
            </div>
            {/* 2. THÔNG TIN LIÊN HỆ & NGƯỜI THÂN */}
            <div className="md:col-span-12">
              <SectionTitle label="Nơi chuyển tuyến" icon={Hospital} />
            </div>
            <div className="md:col-span-8">
              <LookupField
                label="Tên nơi chuyển tuyến (nếu có)"
                required
                value={dangKyData.department}
                onChange={(value) => updateDangKyKham({ department: value })}
                options={doiTuongKcbLookupOptions}
                loading={loading}
                error={getFieldError(fieldErrors, "dangKyKham.department")}
              />
            </div>
            <div className="md:col-span-4">
              <Field label="Giấy chuyển tuyến">
                <Input
                  //  value={baoHiemData.referralPlace}
                  //  onChange={(e) =>
                  //    updateTheBaoHiem({ referralPlace: e.target.value })
                  //  }
                  className="h-9 min-w-0 text-sm"
                  placeholder="Nhập số giấy"
                />
              </Field>
            </div>

            <div className="md:col-span-8">
              <Field label="Chẩn đoán">
                <Input
                  // value={baoHiemData.icdDiagnosis}
                  // onChange={(e) =>
                  //   updateTheBaoHiem({ icdDiagnosis: e.target.value })
                  // }
                  className="h-9 min-w-0 text-sm"
                  placeholder="Nhập mô tả chẩn đoán"
                />
              </Field>
            </div>
            <div className="md:col-span-4">
              <Field label="Mã ICD chẩn đoán">
                <Input
                  // value={baoHiemData.transferNumber}
                  // onChange={(e) =>
                  //   updateTheBaoHiem({ transferNumber: e.target.value })
                  // }
                  className="h-9 min-w-0 text-sm"
                  placeholder="VD: J18.9"
                />
              </Field>
            </div>

            <div className="md:col-span-12">
              <SectionTitle label="Đăng ký phòng khám" icon={Hospital} />
            </div>
            <div className="md:col-span-8">
              <Field
                label="Lý do đến khám"
                required
                error={getFieldError(fieldErrors, "dangKyKham.visitReason")}
                fieldPath="dangKyKham.visitReason"
              >
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
              <LookupField
                label="Người giới thiệu"
                value={dangKyData.referrer}
                onChange={(value) => updateDangKyKham({ referrer: value })}
                options={bsGioiThieuLookupOptions}
                loading={loading}
              />
            </div>

            <div className="md:col-span-8">
              <LookupField
                label="Phòng khám"
                required
                value={dangKyData.room}
                onChange={(value) => updateDangKyKham({ room: value })}
                options={phongBanLookupOptions}
                loading={loading}
                error={getFieldError(fieldErrors, "dangKyKham.room")}
                placeholder="Chọn phòng"
              />
            </div>

            <div className="md:col-span-4">
              <LookupField
                label="Đối tượng"
                value={dangKyData.uuTien}
                onChange={(value) => {
                  updateDangKyKham({
                    uuTien: value,
                    priorityLevel: value, // TODO: remove priorityLevel when legacy usages are cleaned up
                  })
                }}
                options={uuTienLookupOptions}
                loading={loading}
                error={getFieldError(fieldErrors, "dangKyKham.uuTien")}
              />
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
  error,
  fieldPath,
}: {
  label: string;
  children: ReactNode;
  required?: boolean;
  error?: string;
  fieldPath?: string;
}) {
  // Tách sao nếu label có *
  const hasStar = label.includes("*");
  const cleanLabel = hasStar ? label.replace("*", "").trim() : label;

  return (
    <div className="space-y-1.5" data-field-path={fieldPath}>
      <Label className="text-sm font-medium text-gray-700 flex items-center gap-1">
        {cleanLabel}
        {(required || hasStar) && (
          <span className="text-red-600">*</span>
        )}
      </Label>

      {children}
      {error && (
        <p className="text-xs text-red-600">{error}</p>
      )}
    </div>
  );
}
