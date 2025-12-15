import type { ReactNode } from "react"
import { ShieldCheck, Hospital } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card"
import { Input } from "@/shared/ui/input"
import { SectionTitle } from "@/shared/ui/sectiontitle"
import { Checkbox } from "@/shared/ui/checkbox"
import { Label } from "@/shared/ui/label"
import { useTiepNhanForm } from "../hooks/useTiepNhanForm"

interface TheBaoHiemYTeProps {
  collapsed?: boolean
}

export function TheBaoHiemYTe({ collapsed = false }: TheBaoHiemYTeProps) {
  const { formData, updateTheBaoHiem } = useTiepNhanForm()
  const baoHiemData = formData.theBaoHiem

  return (
    <Card
      className={`w-full min-w-0 border ${
        collapsed
          ? "border-dashed border-gray-300 bg-gray-50"
          : "border-emerald-100 bg-gradient-to-b from-emerald-50/30 to-white"
      } shadow-sm`}
      aria-disabled={collapsed}
    >
      <CardHeader className="bg-emerald-700 text-white px-4 py-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold tracking-wide flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" />
            THÔNG TIN BẢO HIỂM Y TẾ
          </CardTitle>
          <CardDescription className="text-[11px] text-white/80">
            Kiểm tra kỹ thông tin BHYT trước khi lưu
          </CardDescription>
        </div>
      </CardHeader>

      {collapsed ? (
        <CardContent className="space-y-3 p-6 text-sm text-gray-600">
          <p>Đối tượng đang là <strong>Thu phí</strong>. Form BHYT sẽ hiện khi chọn "BHYT" ở phần Tiếp đón.</p>
          <p className="text-xs text-gray-500">Điều này giúp giảm nhiễu thông tin khi nhập nhanh cho bệnh nhân dịch vụ.</p>
        </CardContent>
      ) : (
        <CardContent className="space-y-6 p-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-12">
            <div className="sm:col-span-2 xl:col-span-6">
              <Field label="Mã thẻ BHYT" required>
                <Input
                  value={baoHiemData.insuranceNumber}
                  onChange={(e) =>
                    updateTheBaoHiem({ insuranceNumber: e.target.value })
                  }
                  className="h-9 min-w-0 text-sm"
                  placeholder="Nhập mã thẻ BHYT"
                />
              </Field>
            </div>
            <div className="sm:col-span-1 xl:col-span-3">
              <Field label="Mức hưởng" required>
                <Input
                  value={baoHiemData.benefitLevel}
                  onChange={(e) =>
                    updateTheBaoHiem({ benefitLevel: e.target.value })
                  }
                  className="h-9 min-w-0 text-sm"
                  placeholder="VD: 80%"
                />
              </Field>
            </div>
            <div className="sm:col-span-1 xl:col-span-3">
              <Field label="Mã KV" required>
                <Input
                  value={baoHiemData.maKV}
                  onChange={(e) =>
                    updateTheBaoHiem({ maKV: e.target.value })
                  }
                  className="h-9 min-w-0 text-sm"
                  placeholder="Nhập mã KV"
                />
              </Field>
            </div>

            <div className="sm:col-span-2 xl:col-span-12">
              <Field label="Địa chỉ theo thẻ" required>
                <Input
                  value={baoHiemData.addressOnCard}
                  onChange={(e) =>
                    updateTheBaoHiem({ addressOnCard: e.target.value })
                  }
                  className="h-9 min-w-0 text-sm"
                  placeholder="Nhập địa chỉ thẻ"
                />
              </Field>
            </div>

            <div className="sm:col-span-1 xl:col-span-3">
              <Field label="BH từ ngày">
                <Input
                  type="date"
                  value={baoHiemData.insuranceFrom}
                  onChange={(e) =>
                    updateTheBaoHiem({ insuranceFrom: e.target.value })
                  }
                  className="h-9 min-w-0 text-sm"
                />
              </Field>
            </div>
            <div className="sm:col-span-1 xl:col-span-3">
              <Field label="BH đến ngày">
                <Input
                  type="date"
                  value={baoHiemData.insuranceTo}
                  onChange={(e) =>
                    updateTheBaoHiem({ insuranceTo: e.target.value })
                  }
                  className="h-9 min-w-0 text-sm"
                />
              </Field>
            </div>
            <div className="sm:col-span-1 xl:col-span-3">
              <Field label="Ngày đủ 5 năm">
                <Input
                  type="date"
                  value={baoHiemData.ngayDu5Nam}
                  onChange={(e) =>
                    updateTheBaoHiem({ ngayDu5Nam: e.target.value })
                  }
                  className="h-9 min-w-0 text-sm"
                />
              </Field>
            </div>
            <div className="sm:col-span-1 xl:col-span-3">
              <Field label="Ngày miễn CCT">
                <Input
                  type="date"
                  value={baoHiemData.ngayMienCCT}
                  onChange={(e) =>
                    updateTheBaoHiem({ ngayMienCCT: e.target.value })
                  }
                  className="h-9 min-w-0 text-sm"
                />
              </Field>
            </div>

            <div className="sm:col-span-2 xl:col-span-12">
              <Field label="Nơi đăng ký KCB ban đầu" required>
                <Input
                  value={baoHiemData.registrationPlace}
                  onChange={(e) =>
                    updateTheBaoHiem({ registrationPlace: e.target.value })
                  }
                  className="h-9 min-w-0 text-sm"
                  placeholder="Nhập nơi đăng ký"
                />
              </Field>
            </div>

            <div className="sm:col-span-2 xl:col-span-12">
              <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-emerald-100 bg-white/70 px-3 py-3 shadow-sm">
                <Checkbox
                  id="poorHousehold"
                  checked={baoHiemData.poorHousehold}
                  onCheckedChange={(checked) =>
                    updateTheBaoHiem({
                      poorHousehold: Boolean(checked),
                    })
                  }
                />
                <Label htmlFor="poorHousehold" className="text-sm text-gray-700">
                  Hộ nghèo / cận nghèo
                </Label>

                <Input
                  value={baoHiemData.poorHouseholdNumber}
                  onChange={(e) =>
                    updateTheBaoHiem({
                      poorHouseholdNumber: e.target.value,
                    })
                  }
                  className="h-9 min-w-0 flex-1 text-sm"
                  placeholder="Số sổ hộ nghèo / cận nghèo"
                />
              </div>
            </div>
          </div>

          <SectionTitle label="Nơi chuyển tuyến" icon={Hospital} />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-12">
            <div className="sm:col-span-2 xl:col-span-12">
              <Field label="Tên nơi chuyển tuyến (nếu có)">
                <Input
                  value={baoHiemData.tenNoiChuyenTuyen}
                  onChange={(e) =>
                    updateTheBaoHiem({ tenNoiChuyenTuyen: e.target.value })
                  }
                  className="h-9 min-w-0 text-sm"
                  placeholder="Nhập tên nơi chuyển tuyến"
                />
              </Field>
            </div>

            <div className="sm:col-span-1 xl:col-span-6">
              <Field label="Số giấy chuyển tuyến">
                <Input
                  value={baoHiemData.referralPlace}
                  onChange={(e) =>
                    updateTheBaoHiem({ referralPlace: e.target.value })
                  }
                  className="h-9 min-w-0 text-sm"
                  placeholder="Nhập số giấy"
                />
              </Field>
            </div>

            <div className="sm:col-span-1 xl:col-span-6">
              <Field label="Mã ICD chẩn đoán">
                <Input
                  value={baoHiemData.transferNumber}
                  onChange={(e) =>
                    updateTheBaoHiem({ transferNumber: e.target.value })
                  }
                  className="h-9 min-w-0 text-sm"
                  placeholder="VD: J18.9"
                />
              </Field>
            </div>

            <div className="sm:col-span-2 xl:col-span-12">
              <Field label="Chẩn đoán">
                <Input
                  value={baoHiemData.icdDiagnosis}
                  onChange={(e) =>
                    updateTheBaoHiem({ icdDiagnosis: e.target.value })
                  }
                  className="h-9 min-w-0 text-sm"
                  placeholder="Nhập mô tả chẩn đoán"
                />
              </Field>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  )
}

/* ============================== */
/* COMPONENT FIELD TÁI SỬ DỤNG    */
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
  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-600">*</span>}
      </Label>
      {children}
    </div>
  )
}
