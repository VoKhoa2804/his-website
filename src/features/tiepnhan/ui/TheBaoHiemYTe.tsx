import { ShieldCheck, Hospital, Stethoscope, CalendarClock } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { SectionTitle } from "@/shared/ui/sectiontitle";
import { Checkbox } from "@/shared/ui/checkbox";
import { Label } from "@/shared/ui/label";
import { useTiepNhanForm } from "../hooks/useTiepNhanForm";

export function TheBaoHiemYTe() {
  const { formData, updateTheBaoHiem } = useTiepNhanForm()
  const baoHiemData = formData.theBaoHiem

  return (
    <Card className="border border-gray-300 shadow-sm h-full">
      {/* HEADER */}
      <CardHeader className="bg-emerald-700 text-white px-4 py-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xs font-bold tracking-wide flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-white" />
            THÔNG TIN BẢO HIỂM Y TẾ
          </CardTitle>
          <CardDescription className="text-[11px] text-white/80">
            Kiểm tra kỹ thông tin BHYT trước khi lưu
          </CardDescription>
        </div>
      </CardHeader>

      {/* BODY */}
      <CardContent className="p-4 space-y-6">
        {/* 1. Thông tin thẻ BHYT */}
        <SectionTitle label="Thông tin thẻ BHYT" icon={ShieldCheck} />

        <div className="grid grid-cols-4 gap-3">
          {/* Mã thẻ BHYT */}
          <div className="col-span-2">
            <Field label="Mã thẻ BHYT" required>
              <Input
                value={baoHiemData.insuranceNumber}
                onChange={(e) =>
                  updateTheBaoHiem({ insuranceNumber: e.target.value })
                }
                className="h-8 text-xs"
                placeholder="Nhập mã thẻ BHYT"
              />
            </Field>
          </div>
          {/* Mức hưởng */}
          <Field label="Mức hưởng" required>
            <Input
              value={baoHiemData.benefitLevel}
              onChange={(e) =>
                updateTheBaoHiem({ benefitLevel: e.target.value })
              }
              className="h-8 text-xs"
              placeholder="Nhập mức hưởng"
            />
          </Field>
          <Field label="Mã KV" required>
            <Input
              value={baoHiemData.maKV}
              onChange={(e) =>
                updateTheBaoHiem({ maKV: e.target.value })
              }
              className="h-8 text-xs"
              placeholder="Nhập mã KV"
            />
          </Field>
          <div className="col-span-4">
            <Field label="Địa chỉ thẻ" required>
              <Input
                value={baoHiemData.addressOnCard}
                onChange={(e) =>
                  updateTheBaoHiem({ addressOnCard: e.target.value })
                }
                className="h-8 text-xs"
                placeholder="Nhập địa chỉ thẻ"
              />
            </Field>
          </div>
          {/* Bảo hiểm từ ngày */}
          <div className="col-span-2">
            <Field label="Bảo hiểm từ ngày">
              <Input
                type="date"
                value={baoHiemData.insuranceFrom}
                onChange={(e) =>
                  updateTheBaoHiem({ insuranceFrom: e.target.value })
                }
                className="h-8 text-xs"
              />
            </Field>
          </div>
          {/* Bảo hiểm đến ngày */}
          <div className="col-span-2">
            <Field label="Bảo hiểm đến ngày">
              <Input
                type="date"
                value={baoHiemData.insuranceTo}
                onChange={(e) =>
                  updateTheBaoHiem({ insuranceTo: e.target.value })
                }
                className="h-8 text-xs"
              />
            </Field>
          </div>
          {/* Ngày 5 năm liên tục */}
          <div className="col-span-2">
            <Field label="Ngày 5 năm liên tục">
              <Input
                type="date"
                value={baoHiemData.ngayDu5Nam}
                onChange={(e) =>
                  updateTheBaoHiem({ ngayDu5Nam: e.target.value })
                }
                className="h-8 text-xs"
              />
            </Field>
          </div>
          {/* Ngày miễn CCT */}
          <div className="col-span-2">
            <Field label="Ngày miễn CCT  trong năm">
              <Input
                type="date"
                value={baoHiemData.ngayMienCCT}
                onChange={(e) =>
                  updateTheBaoHiem({ ngayMienCCT: e.target.value })
                }
                className="h-8 text-xs"
              />
            </Field>
          </div>
          <div className="col-span-4">
            <Field label="Nơi đăng ký KCB ban đầu" required>
              <Input
                value={baoHiemData.registrationPlace}
                onChange={(e) =>
                  updateTheBaoHiem({ registrationPlace: e.target.value })
                }
                className="h-8 text-xs"
                placeholder="Nhập nơi đăng ký KCB ban đầu"
              />
            </Field>
          </div>
        </div>

        {/* 2. Nơi đăng ký KCB & chuyển tuyến */}
        <SectionTitle
          label="Nơi chuyển tuyến"
          icon={Hospital}
        />
        <div className="col-span-4">
          <Field label="Tên nơi chuyển tuyến (nếu có)">
            <Input
              value={baoHiemData.tenNoiChuyenTuyen}
              onChange={(e) =>
                updateTheBaoHiem({ tenNoiChuyenTuyen: e.target.value })
              }
              className="h-8 text-xs"
              placeholder="Nhập tên nơi chuyển tuyến"
            />
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {/* Mã nơi chuyển tuyến */}
          <Field label="Mã nơi chuyển tuyến">
            <Input
              value={baoHiemData.referralPlace}
              onChange={(e) =>
                updateTheBaoHiem({ referralPlace: e.target.value })
              }
              className="h-8 text-xs"
              placeholder="Nhập mã nơi chuyển tuyến"
            />
          </Field>

          {/* Số giấy chuyển tuyến */}
          <Field label="Số giấy chuyển tuyến">
            <Input
              value={baoHiemData.transferNumber}
              onChange={(e) =>
                updateTheBaoHiem({ transferNumber: e.target.value })
              }
              className="h-8 text-xs"
              placeholder="Nhập số giấy chuyển tuyến"
            />
          </Field>
          <div className="col-span-2">
            <Field label="Mã ICD chẩn đoán">
              <Input
                value={baoHiemData.icdDiagnosis}
                onChange={(e) =>
                  updateTheBaoHiem({ icdDiagnosis: e.target.value })
                }
                className="h-8 text-xs"
                placeholder="VD: J18.9"
              />
            </Field>
          </div>
        </div>

        {/* 3. Chẩn đoán */}
        <SectionTitle label="Chẩn đoán" icon={Stethoscope} />

        <div className="grid grid-cols-2 gap-3">
          <Field label="Mã ICD chẩn đoán">
            <Input
              value={baoHiemData.icdDiagnosis}
              onChange={(e) =>
                updateTheBaoHiem({ icdDiagnosis: e.target.value })
              }
              className="h-8 text-xs"
              placeholder="VD: J18.9"
            />
          </Field>

          <Field label="Chẩn đoán (text)">
            <Input
              value={baoHiemData.diagnosisText}
              onChange={(e) =>
                updateTheBaoHiem({ diagnosisText: e.target.value })
              }
              className="h-8 text-xs"
              placeholder="Nhập chẩn đoán"
            />
          </Field>
        </div>

        {/* 4. Đối tượng & giấy hẹn khám */}
        <SectionTitle
          label="Đối tượng & giấy hẹn khám"
          icon={CalendarClock}
        />

        <div className="space-y-3">
          {/* Hộ nghèo */}
          <div className="flex items-center gap-2">
            <Checkbox
              id="poorHousehold"
              checked={baoHiemData.poorHousehold}
              onCheckedChange={(checked) =>
                updateTheBaoHiem({
                  poorHousehold: Boolean(checked),
                })
              }
            />
            <Label htmlFor="poorHousehold" className="text-xs text-gray-700">
              Hộ nghèo / cận nghèo
            </Label>

            <div className="flex-1 ml-3">
              <Input
                value={baoHiemData.poorHouseholdNumber}
                onChange={(e) =>
                  updateTheBaoHiem({
                    poorHouseholdNumber: e.target.value,
                  })
                }
                className="h-8 text-xs"
                placeholder="Số sổ hộ nghèo / cận nghèo"
              />
            </div>
          </div>

          {/* Có giấy hẹn khám */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Checkbox
                id="hasAppointment"
                checked={baoHiemData.hasAppointment}
                onCheckedChange={(checked) =>
                  updateTheBaoHiem({
                    hasAppointment: Boolean(checked),
                  })
                }
              />
              <Label
                htmlFor="hasAppointment"
                className="text-xs text-gray-700"
              >
                Có giấy hẹn khám
              </Label>
            </div>

            {baoHiemData.hasAppointment && (
              <div className="grid grid-cols-2 gap-3">
                <Field label="Ngày hẹn khám">
                  <Input
                    type="date"
                    value={baoHiemData.appointmentDate}
                    onChange={(e) =>
                      updateTheBaoHiem({
                        appointmentDate: e.target.value,
                      })
                    }
                    className="h-8 text-xs"
                  />
                </Field>

                <Field label="Giờ hẹn khám">
                  <Input
                    type="time"
                    value={baoHiemData.appointmentTime}
                    onChange={(e) =>
                      updateTheBaoHiem({
                        appointmentTime: e.target.value,
                      })
                    }
                    className="h-8 text-xs"
                  />
                </Field>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/* ============================== */
/* COMPONENT FIELD TÁI SỬ DỤNG    */
/* ============================== */

function Field({
  label,
  children,
  required,
}: {
  label: string;
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <div className="space-y-1">
      <Label className="text-xs text-gray-700">
        {label} {required && <span className="text-red-600">*</span>}
      </Label>
      {children}
    </div>
  );
}
