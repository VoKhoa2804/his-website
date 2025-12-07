import { useState } from "react";
import { ShieldCheck, Hospital, Stethoscope, CalendarClock } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select";
import { SectionTitle } from "@/shared/ui/sectiontitle";
import { Checkbox } from "@/shared/ui/checkbox";
import { Label } from "@/shared/ui/label";

export function TheBaoHiemYTe() {
  const [formData, setFormData] = useState({
    insuranceNumber: "",
    benefitLevel: "",
    insuranceFrom: "",
    insuranceTo: "",
    registrationPlace: "",
    referralPlace: "",
    transferNumber: "",
    icdDiagnosis: "",
    diagnosisText: "",
    poorHousehold: false,
    poorHouseholdNumber: "",
    hasAppointment: false,
    appointmentDate: "",
    appointmentTime: "",
  });

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

        <div className="grid grid-cols-2 gap-3">
          {/* Mã thẻ BHYT */}
          <Field label="Mã thẻ BHYT" required>
            <Input
              value={formData.insuranceNumber}
              onChange={(e) =>
                setFormData({ ...formData, insuranceNumber: e.target.value })
              }
              className="h-8 text-xs"
              placeholder="Nhập mã thẻ BHYT"
            />
          </Field>

          {/* Mức hưởng */}
          <Field label="Mức hưởng" required>
            <Select
              value={formData.benefitLevel}
              onValueChange={(value) =>
                setFormData({ ...formData, benefitLevel: value })
              }
            >
              <SelectTrigger className="h-8 text-xs bg-white">
                <SelectValue placeholder="Chọn mức hưởng" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="100">100%</SelectItem>
                <SelectItem value="95">95%</SelectItem>
                <SelectItem value="80">80%</SelectItem>
              </SelectContent>
            </Select>
          </Field>

          {/* Bảo hiểm từ ngày */}
          <Field label="Bảo hiểm từ ngày">
            <Input
              type="date"
              value={formData.insuranceFrom}
              onChange={(e) =>
                setFormData({ ...formData, insuranceFrom: e.target.value })
              }
              className="h-8 text-xs"
            />
          </Field>

          {/* Bảo hiểm đến ngày */}
          <Field label="Bảo hiểm đến ngày">
            <Input
              type="date"
              value={formData.insuranceTo}
              onChange={(e) =>
                setFormData({ ...formData, insuranceTo: e.target.value })
              }
              className="h-8 text-xs"
            />
          </Field>
        </div>

        {/* 2. Nơi đăng ký KCB & chuyển tuyến */}
        <SectionTitle
          label="Nơi đăng ký KCB ban đầu & chuyển tuyến"
          icon={Hospital}
        />

        <div className="grid grid-cols-2 gap-3">
          {/* Nơi ĐK KCB ban đầu */}
          <Field label="Nơi đăng ký KCB ban đầu" required>
            <Input
              value={formData.registrationPlace}
              onChange={(e) =>
                setFormData({ ...formData, registrationPlace: e.target.value })
              }
              className="h-8 text-xs"
              placeholder="VD: BV Bình Dân"
            />
          </Field>

          {/* Nơi chuyển tuyến */}
          <Field label="Nơi chuyển tuyến (nếu có)">
            <Input
              value={formData.referralPlace}
              onChange={(e) =>
                setFormData({ ...formData, referralPlace: e.target.value })
              }
              className="h-8 text-xs"
              placeholder="VD: BV tuyến dưới"
            />
          </Field>

          {/* Số giấy chuyển tuyến */}
          <Field label="Số giấy chuyển tuyến">
            <Input
              value={formData.transferNumber}
              onChange={(e) =>
                setFormData({ ...formData, transferNumber: e.target.value })
              }
              className="h-8 text-xs"
              placeholder="Nhập số giấy chuyển tuyến"
            />
          </Field>
        </div>

        {/* 3. Chẩn đoán */}
        <SectionTitle label="Chẩn đoán" icon={Stethoscope} />

        <div className="grid grid-cols-2 gap-3">
          <Field label="Mã ICD chẩn đoán">
            <Input
              value={formData.icdDiagnosis}
              onChange={(e) =>
                setFormData({ ...formData, icdDiagnosis: e.target.value })
              }
              className="h-8 text-xs"
              placeholder="VD: J18.9"
            />
          </Field>

          <Field label="Chẩn đoán (text)">
            <Input
              value={formData.diagnosisText}
              onChange={(e) =>
                setFormData({ ...formData, diagnosisText: e.target.value })
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
              checked={formData.poorHousehold}
              onCheckedChange={(checked) =>
                setFormData({
                  ...formData,
                  poorHousehold: Boolean(checked),
                })
              }
            />
            <Label htmlFor="poorHousehold" className="text-xs text-gray-700">
              Hộ nghèo / cận nghèo
            </Label>

            <div className="flex-1 ml-3">
              <Input
                value={formData.poorHouseholdNumber}
                onChange={(e) =>
                  setFormData({
                    ...formData,
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
                checked={formData.hasAppointment}
                onCheckedChange={(checked) =>
                  setFormData({
                    ...formData,
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

            {formData.hasAppointment && (
              <div className="grid grid-cols-2 gap-3">
                <Field label="Ngày hẹn khám">
                  <Input
                    type="date"
                    value={formData.appointmentDate}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        appointmentDate: e.target.value,
                      })
                    }
                    className="h-8 text-xs"
                  />
                </Field>

                <Field label="Giờ hẹn khám">
                  <Input
                    type="time"
                    value={formData.appointmentTime}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
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
