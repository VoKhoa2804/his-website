import { useState, useEffect, type ReactNode, type ChangeEvent, useMemo } from "react";
import { QrCode, User } from "lucide-react";
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
import { useDispatch, useSelector } from "react-redux";
import { selectHanhChinhStatus, selectOptionsByKey } from "@/features/hanhchinh/model/hanhchinhSlice";
import { selectPhongKhamRows } from "@/features/hanhchinh/model/selectors"
import { openDialog } from "@/shared/store/selectDialog"
import { PhongKhamSelectDialog, PHONG_KHAM_DIALOG_ID, type PhongKhamDialogResult } from "@/features/phong-kham/ui/PhongKhamSelectDialog"
import type { PaymentType } from "../model/bhytTypes"
import type { TiepNhanFormData } from "../context/TiepNhanFormContext"
import { createDefaultTheBaoHiem } from "../context/TiepNhanFormContext"
import type { BhytStatus } from "../model/bhytTypes"

interface DangKyKhamProps {
  paymentType: PaymentType
}

function toLookupOptions(items: Array<{ id: string; ma?: string; ten?: string }> = []): LookupOption[] {
  return items
    .filter(Boolean)
    .map((item) => ({
      value: item.ma || item.id,
      label: item.ten || item.ma || item.id,
      ma: item.ma,
    }))
}

export function DangKyKham({ paymentType }: DangKyKhamProps) {
  const { formData, updateDangKyKham, updateTheBaoHiem, fieldErrors } = useTiepNhanForm()
  const dispatch = useDispatch()
  const dangKyData = formData.dangKyKham
  const bhytData = formData.theBaoHiem
  const hanhChinhStatus = useSelector(selectHanhChinhStatus)
  const loading = hanhChinhStatus === "loading"
  const uuTienOptions = useSelector(selectOptionsByKey("UuTien"))
  const bsGioiThieuOptions = useSelector(selectOptionsByKey("BsGioiThieu"))
  const loaiKcbOptions = useSelector(selectOptionsByKey("LoaiKCB"))
  const doiTuongKcbOptions = useSelector(selectOptionsByKey("DoiTuongKCB"))

  const phongKhamRows = useSelector(selectPhongKhamRows)
  const selectedPhongKhamIds = useMemo(() => {
    if (dangKyData.phongKhamIds?.length) return dangKyData.phongKhamIds
    return dangKyData.room ? [dangKyData.room] : []
  }, [dangKyData.phongKhamIds, dangKyData.room])
  const selectedPhongKhamRows = useMemo(
    () => phongKhamRows.filter((row) => selectedPhongKhamIds.includes(row.id)),
    [phongKhamRows, selectedPhongKhamIds],
  )
  const displayPhongKhamNames =
    selectedPhongKhamRows.length > 0
      ? selectedPhongKhamRows.map((row) => row.ten)
      : dangKyData.phongKhamNames ?? []

  const [bhytStatus, setBhytStatus] = useState<BhytStatus>("UNKNOWN")
  const [bhytStatusMessage, setBhytStatusMessage] = useState("Chưa kiểm tra")

  const loaiKcbLookupOptions = toLookupOptions(loaiKcbOptions)
  const doiTuongKcbLookupOptions = toLookupOptions(doiTuongKcbOptions)
  const uuTienLookupOptions = toLookupOptions(uuTienOptions)
  const bsGioiThieuLookupOptions = toLookupOptions(bsGioiThieuOptions)
  const statusColor: Record<BhytStatus, string> = {
    VALID: "text-emerald-700 bg-emerald-100",
    INVALID: "text-red-700 bg-red-100",
    EXPIRED: "text-amber-700 bg-amber-100",
    UNKNOWN: "text-slate-600 bg-slate-100",
  }

  const handleBhytInputChange =
    (field: keyof TiepNhanFormData["theBaoHiem"]) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      updateTheBaoHiem({
        [field]: event.target.value,
      })
    }

  const handleBhytValidate = () => {
    if (!bhytData.insuranceNumber || bhytData.insuranceNumber.trim().length < 10) {
      setBhytStatus("INVALID")
      setBhytStatusMessage("Mã thẻ cần tối thiểu 10 ký tự")
      return
    }
    const isIsoDate = (value?: string) => !value || /^\d{4}-\d{2}-\d{2}$/.test(value)
    if (
      !isIsoDate(bhytData.insuranceFrom) ||
      !isIsoDate(bhytData.insuranceTo) ||
      !isIsoDate(bhytData.ngayDu5Nam) ||
      !isIsoDate(bhytData.ngayMienCCT)
    ) {
      setBhytStatus("INVALID")
      setBhytStatusMessage("Định dạng ngày phải là yyyy-MM-dd")
      return
    }
    if (bhytData.insuranceTo) {
      const expireDate = new Date(bhytData.insuranceTo)
      if (!Number.isNaN(expireDate.valueOf()) && expireDate < new Date()) {
        setBhytStatus("EXPIRED")
        setBhytStatusMessage("Thẻ đã quá hạn hiệu lực")
        return
      }
    }
    setBhytStatus("VALID")
    setBhytStatusMessage("Thông tin thẻ hợp lệ")
  }

  const handleBhytSave = () => {
    if (
      bhytData.insuranceNumber &&
      bhytData.benefitLevel &&
      bhytData.addressOnCard &&
      bhytData.registrationPlace &&
      bhytData.maKV
    ) {
      setBhytStatus("VALID")
      setBhytStatusMessage("Đã lưu thông tin BHYT")
      return
    }
    setBhytStatus("INVALID")
    setBhytStatusMessage("Vui lòng nhập đầy đủ thông tin bắt buộc")
  }

  const handleBhytClear = () => {
    updateTheBaoHiem(createDefaultTheBaoHiem())
    setBhytStatus("UNKNOWN")
    setBhytStatusMessage("Chưa kiểm tra")
  }

  useEffect(() => {
    if (paymentType !== "BHYT") {
      setBhytStatus("UNKNOWN")
      setBhytStatusMessage("Chưa kiểm tra")
    }
  }, [paymentType])

  const handleOpenPhongKhamDialog = () => {
    dispatch(openDialog({ dialogId: PHONG_KHAM_DIALOG_ID, initialSelectedIds: selectedPhongKhamIds }))
  }

  const handlePhongKhamConfirm = (result: PhongKhamDialogResult) => {
    updateDangKyKham({
      room: result.selectedIds[0] || "",
      phongKhamIds: result.selectedIds,
      phongKhamNames: result.selectedRows.map((row) => row.ten),
    })
  }

  const handleClearPhongKham = () => {
    updateDangKyKham({
      room: "",
      phongKhamIds: [],
      phongKhamNames: [],
    })
  }

  return (
    <>
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
          <div className="flex-1 grid grid-cols-1 gap-4 md:grid-cols-12">
            
            <div className="md:col-span-4">
              <LookupField
                label="Ưu tiên tiếp đón"
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

            <div className="md:col-span-4">
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

            <div className="md:col-span-4">
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

            <div className="md:col-span-12">
              <Field
                label="Phòng khám"
                required
                error={getFieldError(fieldErrors, "dangKyKham.room")}
                fieldPath="dangKyKham.room"
              >
                <div className="flex flex-col gap-2">
                  <div className="min-h-[44px] rounded-2xl border border-dashed border-slate-300 bg-white px-3 py-2 text-sm text-slate-600">
                    {displayPhongKhamNames.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {displayPhongKhamNames.map((name) => (
                          <span
                            key={name}
                            className="rounded-full bg-sky-50 px-2 py-0.5 text-xs font-medium text-sky-700"
                          >
                            {name}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400">Chưa chọn phòng khám</span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleOpenPhongKhamDialog}
                      disabled={loading}
                    >
                      Chọn phòng khám
                    </Button>
                    {selectedPhongKhamIds.length > 0 && (
                      <Button type="button" variant="ghost" size="sm" onClick={handleClearPhongKham}>
                        Xóa lựa chọn
                      </Button>
                    )}
                  </div>
                </div>
              </Field>
            </div>
          </div>
        </div>

        {paymentType === "BHYT" && (
          <div className="space-y-6 rounded-2xl border border-emerald-200 bg-white p-5 shadow-inner">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-base font-semibold text-emerald-700">Thông tin thẻ BHYT</p>
                <p className="text-xs text-slate-500">
                  Điền đầy đủ thông tin để đối soát và lưu tiếp đón.
                </p>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusColor[bhytStatus]}`}>
                {bhytStatus === "VALID" && "Đã xác thực"}
                {bhytStatus === "INVALID" && "Thiếu/Sai thông tin"}
                {bhytStatus === "EXPIRED" && "Hết hạn"}
                {bhytStatus === "UNKNOWN" && "Chưa kiểm tra"}
              </span>
            </div>
            <p className="text-xs text-slate-500">{bhytStatusMessage}</p>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
              <div className="md:col-span-4">
                <Field
                  label="Mã thẻ BHYT *"
                  required
                  error={getFieldError(fieldErrors, "theBaoHiem.insuranceNumber")}
                  fieldPath="theBaoHiem.insuranceNumber"
                >
                  <Input
                    value={bhytData.insuranceNumber}
                    onChange={handleBhytInputChange("insuranceNumber")}
                    className="h-9 text-sm"
                    placeholder="VD: HC4010xxxx"
                  />
                </Field>
              </div>
              <div className="md:col-span-4">
                <Field
                  label="Mức hưởng *"
                  required
                  error={getFieldError(fieldErrors, "theBaoHiem.benefitLevel")}
                  fieldPath="theBaoHiem.benefitLevel"
                >
                  <Input
                    value={bhytData.benefitLevel}
                    onChange={handleBhytInputChange("benefitLevel")}
                    className="h-9 text-sm"
                    placeholder="VD: 80"
                  />
                </Field>
              </div>
              <div className="md:col-span-4">
                <Field
                  label="Mã KV *"
                  required
                  error={getFieldError(fieldErrors, "theBaoHiem.maKV")}
                  fieldPath="theBaoHiem.maKV"
                >
                  <Input
                    value={bhytData.maKV}
                    onChange={handleBhytInputChange("maKV")}
                    className="h-9 text-sm"
                    placeholder="VD: KV01"
                  />
                </Field>
              </div>
              <div className="md:col-span-12">
                <Field
                  label="Địa chỉ theo thẻ *"
                  required
                  error={getFieldError(fieldErrors, "theBaoHiem.addressOnCard")}
                  fieldPath="theBaoHiem.addressOnCard"
                >
                  <Input
                    value={bhytData.addressOnCard}
                    onChange={handleBhytInputChange("addressOnCard")}
                    className="h-9 text-sm"
                    placeholder="Nhập địa chỉ như trên thẻ"
                  />
                </Field>
              </div>
              <div className="md:col-span-3">
                <Field label="Bảo hiểm từ ngày" fieldPath="theBaoHiem.insuranceFrom">
                  <Input
                    type="date"
                    value={bhytData.insuranceFrom}
                    onChange={handleBhytInputChange("insuranceFrom")}
                    className="h-9 text-sm"
                  />
                </Field>
              </div>
              <div className="md:col-span-3">
                <Field label="Bảo hiểm đến ngày" fieldPath="theBaoHiem.insuranceTo">
                  <Input
                    type="date"
                    value={bhytData.insuranceTo}
                    onChange={handleBhytInputChange("insuranceTo")}
                    className="h-9 text-sm"
                  />
                </Field>
              </div>
              <div className="md:col-span-3">
                <Field label="Ngày đủ 5 năm" fieldPath="theBaoHiem.ngayDu5Nam">
                  <Input
                    type="date"
                    value={bhytData.ngayDu5Nam}
                    onChange={handleBhytInputChange("ngayDu5Nam")}
                    className="h-9 text-sm"
                  />
                </Field>
              </div>
              <div className="md:col-span-3">
                <Field label="Ngày miễn CCT" fieldPath="theBaoHiem.ngayMienCCT">
                  <Input
                    type="date"
                    value={bhytData.ngayMienCCT}
                    onChange={handleBhytInputChange("ngayMienCCT")}
                    className="h-9 text-sm"
                  />
                </Field>
              </div>
              <div className="md:col-span-6">
                <Field
                  label="Nơi đăng ký KCB ban đầu *"
                  required
                  error={getFieldError(fieldErrors, "theBaoHiem.registrationPlace")}
                  fieldPath="theBaoHiem.registrationPlace"
                >
                  <Input
                    value={bhytData.registrationPlace}
                    onChange={handleBhytInputChange("registrationPlace")}
                    className="h-9 text-sm"
                    placeholder="Tên cơ sở KCB"
                  />
                </Field>
              </div>
              <div className="md:col-span-6">
                <Field label="Nơi chuyển tuyến" fieldPath="theBaoHiem.tenNoiChuyenTuyen">
                  <Input
                    value={bhytData.tenNoiChuyenTuyen}
                    onChange={handleBhytInputChange("tenNoiChuyenTuyen")}
                    className="h-9 text-sm"
                    placeholder="Tên cơ sở tuyến trước"
                  />
                </Field>
              </div>
              <div className="md:col-span-4">
                <Field label="Mã tuyến trước" fieldPath="theBaoHiem.referralPlace">
                  <Input
                    value={bhytData.referralPlace}
                    onChange={handleBhytInputChange("referralPlace")}
                    className="h-9 text-sm"
                    placeholder="Nhập mã"
                  />
                </Field>
              </div>
              <div className="md:col-span-4">
                <Field label="Số giấy chuyển tuyến" fieldPath="theBaoHiem.transferNumber">
                  <Input
                    value={bhytData.transferNumber}
                    onChange={handleBhytInputChange("transferNumber")}
                    className="h-9 text-sm"
                  />
                </Field>
              </div>
              <div className="md:col-span-4">
                <Field label="Mã ICD chẩn đoán" fieldPath="theBaoHiem.icdDiagnosis">
                  <Input
                    value={bhytData.icdDiagnosis}
                    onChange={handleBhytInputChange("icdDiagnosis")}
                    className="h-9 text-sm"
                  />
                </Field>
              </div>
              <div className="md:col-span-12">
                <Field label="Chẩn đoán" fieldPath="theBaoHiem.diagnosisText">
                  <Input
                    value={bhytData.diagnosisText}
                    onChange={handleBhytInputChange("diagnosisText")}
                    className="h-9 text-sm"
                    placeholder="Nhập mô tả chẩn đoán"
                  />
                </Field>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
              <div className="text-xs text-slate-500">
                Nhấn "Kiểm tra thẻ" để xác minh thông tin trước khi lưu.
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" onClick={handleBhytValidate}>
                  Kiểm tra thẻ
                </Button>
                <Button variant="ghost" size="sm" onClick={handleBhytClear}>
                  Xóa dữ liệu BHYT
                </Button>
                <Button size="sm" onClick={handleBhytSave}>
                  Lưu BHYT
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
      <PhongKhamSelectDialog onConfirm={handlePhongKhamConfirm} />
    </>
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
