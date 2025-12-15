import type { ReactNode } from "react"
import { Phone } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card"
import { Input } from "@/shared/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select"
import { SectionTitle } from "@/shared/ui/sectiontitle"
import { Label } from "@/shared/ui/label"
import { OccupationLookup } from "./OccupationLookup"
import { useTiepNhanForm } from "../hooks/useTiepNhanForm"
import { NationalityLookup } from "./NationalityLookup"
import { EthnicityLookup } from "./EthnicityLookup"

export function TiepNhanBenhNhan() {
  const { formData, updateTiepNhanBenhNhan } = useTiepNhanForm()
  const benhNhanData = formData.tiepNhanBenhNhan
  const genderOptions = [
    { value: "Nam", label: "Nam" },
    { value: "Nữ", label: "Nữ" },
    { value: "Khác", label: "Khác" },
  ]

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
            <Field label="Họ và tên" required>
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
            <Field label="Giới tính" required>
              <div className="flex flex-wrap gap-2">
                {genderOptions.map((option) => {
                  const checked = benhNhanData.gender === option.value
                  return (
                    <label
                      key={option.value}
                      className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                        checked
                          ? "border-blue-600 bg-blue-50 text-blue-700"
                          : "border-gray-200 bg-white text-gray-600 hover:border-blue-300"
                      }`}
                    >
                      <input
                        type="radio"
                        className="sr-only"
                        name="gender"
                        value={option.value}
                        checked={checked}
                        onChange={() =>
                          updateTiepNhanBenhNhan({ gender: option.value })
                        }
                      />
                      {option.label}
                    </label>
                  )
                })}
              </div>
            </Field>
          </div>

          <div className="md:col-span-3">
            <Field label="Ngày sinh" required>
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
            <Field label="Phường/Xã, Tỉnh/TP">
              <Input
                value={benhNhanData.ward}
                onChange={(e) =>
                  updateTiepNhanBenhNhan({ ward: e.target.value })
                }
                className="h-9 text-sm"
              />
            </Field>
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
            <Field label="CCCD/Hộ chiếu" required>
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
            <Field label="Nghề nghiệp" required>
              <OccupationLookup
                className="w-full"
                inputClassName="h-9 text-sm"
                initialId={benhNhanData.occupation}
                onSelect={(occupation) => {
                  updateTiepNhanBenhNhan({ occupation: occupation?.ma || "" })
                }}
                showHeader={true}
                showBorders={true}
              />
            </Field>
          </div>

          <div className="md:col-span-3">
            <Field label="Quốc tịch" required>
              <NationalityLookup
                code={benhNhanData.nationalityCode}
                name={benhNhanData.nationality}
                onSelect={(value) =>
                  updateTiepNhanBenhNhan({
                    nationality: value.name,
                    nationalityCode: value.code,
                  })
                }
              />
            </Field>
          </div>

          <div className="md:col-span-3">
            <Field label="Dân tộc" required>
              <EthnicityLookup
                code={benhNhanData.ethnicityCode}
                name={benhNhanData.ethnicity}
                onSelect={(value) =>
                  updateTiepNhanBenhNhan({
                    ethnicity: value.name,
                    ethnicityCode: value.code,
                  })
                }
              />
            </Field>
          </div>
        </div>

        {/* 2. THÔNG TIN LIÊN HỆ & NGƯỜI THÂN */}
        <SectionTitle label="Thông tin liên hệ & người thân" icon={Phone} />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
          <div className="md:col-span-4">
            <Field label="Quan hệ với NB">
              <Select
                value={benhNhanData.relationship}
                onValueChange={(value: string) =>
                  updateTiepNhanBenhNhan({ relationship: value })
                }
              >
                <SelectTrigger className="h-9 text-sm bg-white">
                  <SelectValue placeholder="Chọn" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cha-me">Cha/Mẹ</SelectItem>
                  <SelectItem value="vo-chong">Vợ/Chồng</SelectItem>
                  <SelectItem value="con">Con</SelectItem>
                  <SelectItem value="khac">Khác</SelectItem>
                </SelectContent>
              </Select>
            </Field>
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
}: {
  label: string
  children: ReactNode
  required?: boolean
}) {
  // Tách sao nếu label có *
  const hasStar = label.includes("*")
  const cleanLabel = hasStar ? label.replace("*", "").trim() : label

  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-medium text-gray-700 flex items-center gap-1">
        {cleanLabel}
        {(required || hasStar) && <span className="text-red-600">*</span>}
      </Label>

      {children}
    </div>
  )
}
