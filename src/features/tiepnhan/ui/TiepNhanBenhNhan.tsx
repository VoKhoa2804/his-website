import { useCallback, type ReactNode } from "react"
import { Phone } from "lucide-react"
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

const relationshipOptions: LookupOption[] = [
  { value: "cha-me", label: "Cha/Mẹ" },
  { value: "vo-chong", label: "Vợ/Chồng" },
  { value: "con", label: "Con" },
  { value: "khac", label: "Khác" },
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

export function TiepNhanBenhNhan() {
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
        <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
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

          <div className="md:col-span-3">
            <Field
              label="Giới tính"
              required
              error={getFieldError(fieldErrors, "tiepNhanBenhNhan.gender")}
              fieldPath="tiepNhanBenhNhan.gender"
            >
              {genderOptions.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {genderOptions.map((option) => {
                    const value = option.ten || option.ma
                    const checked = benhNhanData.gender === value
                    return (
                      <label
                        key={option.id}
                        className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                          checked
                            ? "border-blue-600 bg-blue-50 text-blue-700"
                            : "border-gray-200 bg-white text-gray-600 hover:border-blue-300"
                        } ${lookupsLoading ? "pointer-events-none opacity-60" : ""}`}
                      >
                        <input
                          type="radio"
                          className="sr-only"
                          name="gender"
                          value={value}
                          checked={checked}
                          disabled={lookupsLoading}
                          onChange={() =>
                            updateTiepNhanBenhNhan({ gender: value })
                          }
                        />
                        {option.ten}
                      </label>
                    )
                  })}
                </div>
              ) : (
                <p className="text-xs text-gray-500">
                  {lookupsLoading ? "Đang tải..." : "Chưa có dữ liệu"}
                </p>
              )}
            </Field>
          </div>

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
            />
          </div>

          <div className="md:col-span-4">
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

          <div className="md:col-span-4">
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

          <div className="md:col-span-2">
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
