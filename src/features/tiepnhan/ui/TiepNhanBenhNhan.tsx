import { useCallback, type ReactNode } from "react"
import { Camera, Phone, CreditCard } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card"
import { Input } from "@/shared/ui/input"
import { SectionTitle } from "@/shared/ui/sectiontitle"
import { Label } from "@/shared/ui/label"
import { useTiepNhanForm } from "../hooks/useTiepNhanForm"
import { getFieldError } from "../model/tiepnhan.validation"
import { useSelector } from "react-redux"
import { selectHanhChinhStatus, selectOptionsByKey } from "@/features/hanhchinh/model/hanhchinhSlice"
import {
  selectAddressSearchIndex,
  searchAddressOptions,
  type AddressOption,
} from "@/features/hanhchinh/model/selectors"
import { LookupField, type LookupOption } from "@/shared/ui/lookups"
import { Button } from "@/shared/ui/button"
import type { PaymentType } from "../model/bhytTypes"

const relationshipOptions: LookupOption[] = [
  { value: "cha-me", label: "Cha/Mẹ" },
  { value: "vo-chong", label: "Vợ/Chồng" },
  { value: "con", label: "Con" },
  { value: "khac", label: "Khác" },
]

const PAYMENT_OPTIONS: Array<{ value: PaymentType; label: string; description: string }> = [
  { value: "BHYT", label: "BHYT", description: "Thanh toán qua BHYT" },
  { value: "THU_PHI", label: "Thu phí", description: "Khách tự chi trả" },
  { value: "MIEN_PHI_KHAC", label: "Miễn phí/Khác", description: "Quỹ khác" },
]

function toLookupOptions(items: Array<{ id: string; ma?: string; ten?: string }> = []) {
  return items
    .filter(Boolean)
    .map((item) => ({
      value: item.ma || item.id,
      label: item.ten || item.ma || item.id,
      ma: item.ma,
    }))
}

interface TiepNhanBenhNhanProps {
  paymentType: PaymentType
  onPaymentChange: (value: PaymentType) => void
  hasBhytData: boolean
}

export function TiepNhanBenhNhan({ paymentType, onPaymentChange, hasBhytData }: TiepNhanBenhNhanProps) {
  const { formData, updateTiepNhanBenhNhan, fieldErrors } = useTiepNhanForm()
  const benhNhanData = formData.tiepNhanBenhNhan
  const genderOptions = useSelector(selectOptionsByKey("GioiTinh"))
  const occupationOptions = useSelector(selectOptionsByKey("NgheNghiep"))
  const nationalityOptions = useSelector(selectOptionsByKey("QuocTich"))
  const ethnicityOptions = useSelector(selectOptionsByKey("DanToc"))
  const addressIndex = useSelector(selectAddressSearchIndex)
  const handleAddressSearch = useCallback(
    async (query: string) => {
      const matches = searchAddressOptions(addressIndex, query)
      return matches.map((match) => ({
        value: match.value,
        label: match.label,
        meta: match,
      }))
    },
    [addressIndex],
  )
  const handleAddressSelect = useCallback(
    (option: LookupOption) => {
      const meta = option.meta as AddressOption | undefined
      updateTiepNhanBenhNhan({
        tinhThanh: meta?.tinhId || meta?.tinhName || "",
        quanHuyen: meta?.huyenId || meta?.huyenName || "",
        phuongXa: meta?.xaId || option.value,
        ward: option.label,
      })
    },
    [updateTiepNhanBenhNhan],
  )
  const hanhchinhStatus = useSelector(selectHanhChinhStatus)
  const lookupsLoading = hanhchinhStatus === "loading"
  const genderItems = genderOptions
    .map((option) => {
      const rawValue = option.ma ?? option.Ma ?? option.id ?? option.Id
      const rawLabel = option.ten ?? option.Ten
      if (rawValue == null || rawLabel == null) return null
      return {
        value: String(rawValue),
        label: String(rawLabel),
      }
    })
    .filter((item): item is { value: string; label: string } => Boolean(item && item.value && item.label))
  const occupationLookupOptions = toLookupOptions(occupationOptions)
  const nationalityLookupOptions = toLookupOptions(nationalityOptions)
  const ethnicityLookupOptions = toLookupOptions(ethnicityOptions)

  return (
    <Card className="border border-gray-200 shadow-sm">
      {/* HEADER */}
      <CardHeader className="bg-blue-700 text-white px-4 py-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xs font-bold tracking-wide flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-white" />
            THÔNG TIN CÁ NHÂN
          </CardTitle>
          <CardDescription className="text-[11px] text-white/80">
            Nhấn [F6] để thêm mới thông tin
          </CardDescription>
        </div>
      </CardHeader>

      {/* BODY */}
      <CardContent className="p-4 space-y-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-12 md:grid-rows-2 items-stretch">
          {/* ICON / AVATAR BÊN TRÁI (cao bằng bên phải) */}
          <div className="hidden md:flex md:col-span-2 md:row-span-2 h-full items-stretch">
            <div className="mx-auto flex h-full w-full flex-col items-center justify-center gap-3 rounded-2xl bg-white p-4 shadow-sm shadow-sky-100">
              <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gray-200 sm:h-28 sm:w-28">
                <div className="h-10 w-10 rounded-full bg-gray-300 sm:h-12 sm:w-12" />

                <Button
                  type="button"
                  size="icon"
                  variant="default"
                  className="absolute bottom-0 right-0 h-7 w-7 rounded-full bg-blue-600 hover:bg-blue-700"
                  onClick={() => {
                    console.log("Upload avatar")
                  }}
                >
                  <Camera className="h-3 w-3 text-white" />
                </Button>
              </div>

              {/* <p className="max-w-[140px] text-center text-xs text-gray-500">
        Nhấn để cập nhật ảnh bệnh nhân
      </p> */}
            </div>
          </div>

          {/* CONTENT BÊN PHẢI (span 2 dòng) */}
          <div className="md:col-span-10 md:row-span-2 h-full">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-12">

              {/* Họ và tên */}
              <div className="md:col-span-6">
                <Field
                  label="Họ và tên"
                  required
                  error={getFieldError(fieldErrors, "tiepNhanBenhNhan.fullName")}
                  fieldPath="tiepNhanBenhNhan.fullName"
                >
                  <Input
                    value={benhNhanData.fullName}
                    onChange={(e) =>
                      updateTiepNhanBenhNhan({ fullName: e.target.value })
                    }
                    placeholder="Nhập họ và tên"
                    className="h-9 text-sm"
                  />
                </Field>
              </div>

              {/* Giới tính */}
              <div className="md:col-span-3">
                <Field
                  label="Giới tính"
                  required
                  error={getFieldError(fieldErrors, "tiepNhanBenhNhan.gender")}
                  fieldPath="tiepNhanBenhNhan.gender"
                >
                  <div className="flex flex-wrap gap-2">
                    {genderItems.map((item) => {
                      const checked = benhNhanData.gender === item.value
                      return (
                        <label
                          key={item.value}
                          className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${checked
                              ? "border-blue-600 bg-blue-50 text-blue-700"
                              : "border-gray-200 bg-white text-gray-600 hover:border-blue-300"
                            }`}
                        >
                          <input
                            type="radio"
                            className="sr-only"
                            name="gender"
                            value={item.value}
                            checked={checked}
                            onChange={() =>
                              updateTiepNhanBenhNhan({ gender: item.value })
                            }
                          />
                          {item.label}
                        </label>
                      )
                    })}
                  </div>
                </Field>
              </div>

              {/* Ngày sinh */}
              <div className="md:col-span-3">
                <Field
                  label="Ngày sinh"
                  required
                  error={getFieldError(fieldErrors, "tiepNhanBenhNhan.dateOfBirth")}
                  fieldPath="tiepNhanBenhNhan.dateOfBirth"
                >
                  <Input
                    type="date"
                    value={benhNhanData.dateOfBirth}
                    onChange={(e) =>
                      updateTiepNhanBenhNhan({ dateOfBirth: e.target.value })
                    }
                    className="h-9 text-sm"
                  />
                </Field>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
                    <div className="md:col-span-6">
            <Field label="Số nhà / Thôn / Xóm">
              <Input
                value={benhNhanData.houseNumber}
                onChange={(e) =>
                  updateTiepNhanBenhNhan({ houseNumber: e.target.value })
                }
                className="h-9 text-sm"
                placeholder="VD: 12/3 KP3"
              />
            </Field>
          </div>

          <div className="md:col-span-6">
            <LookupField
              label="Địa chỉ hành chính"
              value={benhNhanData.phuongXa}
              valueLabel={benhNhanData.ward}
              onChange={(value) => updateTiepNhanBenhNhan({ phuongXa: value })}
              onSelectOption={handleAddressSelect}
              options={[]}
              onSearch={handleAddressSearch}
              loading={lookupsLoading}
              placeholder="Nhập Phường/Xã, Quận/Huyện, Tỉnh/TP"
              emptyText="Nhập để tìm địa chỉ"
              error={getFieldError(fieldErrors, "tiepNhanBenhNhan.phuongXa")}
              showAllOnEmpty
              emptyResultLimit={50}
            />
          </div>

          <div className="md:col-span-3">
            <Field label="Số điện thoại">
              <Input
                value={benhNhanData.phoneNumber}
                onChange={(e) =>
                  updateTiepNhanBenhNhan({ phoneNumber: e.target.value })
                }
                placeholder="Nhập số điện thoại"
                className="h-9 text-sm"
              />
            </Field>
          </div>

          <div className="md:col-span-3">
            <Field
              label="CCCD/Hộ chiếu"
              required
              error={getFieldError(fieldErrors, "tiepNhanBenhNhan.idNumber")}
              fieldPath="tiepNhanBenhNhan.idNumber"
            >
              <Input
                value={benhNhanData.idNumber}
                onChange={(e) =>
                  updateTiepNhanBenhNhan({ idNumber: e.target.value })
                }
                className="h-9 text-sm"
              />
            </Field>
          </div>

          <div className="md:col-span-2">
            <Field label="Ngày cấp">
              <Input
                type="date"
                value={benhNhanData.issueDate}
                onChange={(e) =>
                  updateTiepNhanBenhNhan({ issueDate: e.target.value })
                }
                className="h-9 text-sm"
              />
            </Field>
          </div>

          <div className="md:col-span-4">
            <Field label="Nơi cấp">
              <Input
                value={benhNhanData.issuePlace}
                onChange={(e) =>
                  updateTiepNhanBenhNhan({ issuePlace: e.target.value })
                }
                className="h-9 text-sm"
                placeholder="VD: TP.HCM"
              />
            </Field>
          </div>

          <div className="md:col-span-6">
            <LookupField
              label="Nghề nghiệp"
              required
              value={benhNhanData.occupation}
              onChange={(value) => updateTiepNhanBenhNhan({ occupation: value })}
              options={occupationLookupOptions}
              loading={lookupsLoading}
              error={getFieldError(fieldErrors, "tiepNhanBenhNhan.occupation")}
              placeholder="Nhập mã hoặc tên nghề nghiệp..."
            />
          </div>

          <div className="md:col-span-3">
            <LookupField
              label="Quốc tịch"
              required
              value={benhNhanData.nationalityCode}
              onChange={(value) => {
                const option = nationalityLookupOptions.find((item) => item.value === value)
                updateTiepNhanBenhNhan({
                  nationalityCode: value,
                  nationality: option?.label || "",
                })
              }}
              options={nationalityLookupOptions}
              loading={lookupsLoading}
              error={getFieldError(fieldErrors, "tiepNhanBenhNhan.nationality")}
              placeholder="Nhập mã hoặc tên quốc tịch"
            />
          </div>

          <div className="md:col-span-3">
            <LookupField
              label="Dân tộc"
              required
              value={benhNhanData.ethnicityCode}
              onChange={(value) => {
                const option = ethnicityLookupOptions.find((item) => item.value === value)
                updateTiepNhanBenhNhan({
                  ethnicityCode: value,
                  ethnicity: option?.label || "",
                })
              }}
              options={ethnicityLookupOptions}
              loading={lookupsLoading}
              error={getFieldError(fieldErrors, "tiepNhanBenhNhan.ethnicity")}
              placeholder="Nhập mã hoặc tên dân tộc"
            />
          </div>
        </div>

        {/* 2. THÔNG TIN LIÊN HỆ & NGƯỜI THÂN */}
        <SectionTitle label="Thông tin liên hệ & người thân" icon={Phone} />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
          <div className="md:col-span-4">
            <LookupField
              label="Quan hệ với NB"
              value={benhNhanData.relationship}
              onChange={(value) => updateTiepNhanBenhNhan({ relationship: value })}
              options={relationshipOptions}
              placeholder="Chọn"
            />
          </div>

          <div className="md:col-span-4">
            <Field label="Tên người liên hệ">
              <Input
                value={benhNhanData.contactFullName}
                onChange={(e) =>
                  updateTiepNhanBenhNhan({
                    contactFullName: e.target.value,
                  })
                }
                className="h-9 text-sm"
              />
            </Field>
          </div>

          <div className="md:col-span-4">
            <Field label="SĐT người liên hệ">
              <Input
                value={benhNhanData.contactPhoneNumber}
                onChange={(e) =>
                  updateTiepNhanBenhNhan({
                    contactPhoneNumber: e.target.value,
                  })
                }
                className="h-9 text-sm"
              />
            </Field>
          </div>
        </div>

        <SectionTitle label="Đối tượng thanh toán" icon={CreditCard} />

        <div className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
          <div className="flex items-center justify-between gap-2">
            <div>
              <p className="text-sm font-semibold text-slate-700">Chọn hình thức thanh toán</p>
              <p className="text-xs text-slate-500">
                Chọn BHYT để nhập thông tin thẻ tại khu vực tiếp đón.
              </p>
            </div>
            {paymentType === "BHYT" && (
              <span className={`text-xs font-semibold ${hasBhytData ? "text-emerald-600" : "text-amber-600"}`}>
                {hasBhytData ? "Đang sử dụng BHYT" : "Chưa có dữ liệu BHYT"}
              </span>
            )}
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {PAYMENT_OPTIONS.map((option) => {
              const isActive = paymentType === option.value
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => onPaymentChange(option.value)}
                  className={`flex h-full w-full flex-col items-start gap-1 rounded-2xl border px-4 py-4 text-left text-sm font-semibold transition-all ${
                    isActive ? "border-sky-600 bg-sky-600 text-white shadow-lg" : "border-gray-200 bg-white text-gray-700 hover:border-sky-200"
                  }`}
                  aria-pressed={isActive}
                >
                  <span>{option.label}</span>
                  <span className={`text-xs font-normal ${isActive ? "text-white/80" : "text-gray-500"}`}>
                    {option.description}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

/* ============================== */
/* COMPONENT TÁI SỬ DỤNG          */
/* ============================== */
function Field({
  label,
  children,
  required,
  error,
  fieldPath,
}: {
  label: string
  children: ReactNode
  required?: boolean
  error?: string
  fieldPath?: string
}) {
  // Tách sao nếu label có *
  const hasStar = label.includes("*")
  const cleanLabel = hasStar ? label.replace("*", "").trim() : label

  return (
    <div className="space-y-1.5" data-field-path={fieldPath}>
      <Label className="text-sm font-medium text-gray-700 flex items-center gap-1">
        {cleanLabel}
        {(required || hasStar) && <span className="text-red-600">*</span>}
      </Label>

      {children}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  )
}
