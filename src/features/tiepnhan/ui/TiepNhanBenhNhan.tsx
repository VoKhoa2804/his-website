import { useState } from "react";
import { User, Phone, Building2, IdCard } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select";
import { SectionTitle } from "@/shared/ui/sectiontitle";
import { Label } from "@/shared/ui/label";

export function TiepNhanBenhNhan() {
  const [formData, setFormData] = useState({
    phoneNumber: "",
    fullName: "",
    dateOfBirth: "",
    birthTime: "00:00",
    age: "",
    gender: "",
    occupation: "",
    ethnicity: "Kinh",
    nationality: "Việt Nam",
    houseNumber: "",
    ward: "",
    tempHouseNumber: "",
    tempWard: "",
    idType: "CCCD",
    idNumber: "",
    issueDate: "",
    issuePlace: "",
    contactPhoneNumber: "",
    contactFullName: "",
    relationship: "",
    guardian: "",
    workplace: "",
    schoolName: "",
    className: "",
    studentCode: "",
  });

  return (
    <Card className="border border-gray-300 shadow-sm">
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
        {/* 1. THÔNG TIN ĐỊNH DANH */}
        <SectionTitle label="Thông tin định danh" icon={User} />

        <div className="grid grid-cols-2 gap-3">
          {/* Số điện thoại */}
          <Field label="Số điện thoại">
            <Input
              value={formData.phoneNumber}
              onChange={(e) =>
                setFormData({ ...formData, phoneNumber: e.target.value })
              }
              className="h-8 text-xs"
              placeholder="Nhập số điện thoại"
            />
          </Field>

          {/* Họ và tên */}
          <Field label="Họ và tên" required>
            <Input
              value={formData.fullName}
              onChange={(e) =>
                setFormData({ ...formData, fullName: e.target.value })
              }
              className="h-8 text-xs"
              placeholder="Nhập họ và tên"
            />
          </Field>

          {/* Ngày sinh */}
          <Field label="Ngày tháng năm sinh" required>
            <Input
              type="date"
              value={formData.dateOfBirth}
              onChange={(e) =>
                setFormData({ ...formData, dateOfBirth: e.target.value })
              }
              className="h-8 text-xs"
            />
          </Field>

          {/* Giờ sinh + Tuổi + Giới tính */}
          <div className="grid grid-cols-3 gap-2">
            <Field label="Giờ sinh">
              <Input
                value={formData.birthTime}
                onChange={(e) =>
                  setFormData({ ...formData, birthTime: e.target.value })
                }
                className="h-8 text-xs text-center"
              />
            </Field>

            <Field label="Tuổi">
              <Input
                value={formData.age}
                readOnly
                className="h-8 text-xs text-center bg-gray-50 text-gray-600"
              />
            </Field>

            <Field label="Giới tính" required>
              <Select
                value={formData.gender}
                onValueChange={(value) =>
                  setFormData({ ...formData, gender: value })
                }
              >
                <SelectTrigger className="h-8 text-xs bg-white">
                  <SelectValue placeholder="Chọn" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Nam">Nam</SelectItem>
                  <SelectItem value="Nữ">Nữ</SelectItem>
                  <SelectItem value="Khác">Khác</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          </div>

          {/* Địa chỉ thường trú */}
          <Field label="Số nhà / Thôn / Xóm">
            <Input
              value={formData.houseNumber}
              onChange={(e) =>
                setFormData({ ...formData, houseNumber: e.target.value })
              }
              className="h-8 text-xs"
              placeholder="VD: 12/3 KP3"
            />
          </Field>

          <Field label="Phường/Xã, Quận/Huyện, Tỉnh/TP" required>
            <Input
              value={formData.ward}
              onChange={(e) =>
                setFormData({ ...formData, ward: e.target.value })
              }
              placeholder="VD: P.5, Q.11, TP.HCM"
              className="h-8 text-xs"
            />
          </Field>

          {/* Địa chỉ tạm trú */}
          <Field label="Tạm trú - Số nhà / Thôn / Xóm">
            <Input
              value={formData.tempHouseNumber}
              onChange={(e) =>
                setFormData({ ...formData, tempHouseNumber: e.target.value })
              }
              className="h-8 text-xs"
            />
          </Field>

          <Field label="Tạm trú - Phường/Xã, Quận/Huyện, Tỉnh/TP">
            <Input
              value={formData.tempWard}
              onChange={(e) =>
                setFormData({ ...formData, tempWard: e.target.value })
              }
              className="h-8 text-xs"
            />
          </Field>

          {/* Giấy tờ tùy thân */}
          <Field label="Loại giấy tờ tùy thân">
            <Select
              value={formData.idType}
              onValueChange={(value) =>
                setFormData({ ...formData, idType: value })
              }
            >
              <SelectTrigger className="h-8 text-xs bg-white">
                <SelectValue placeholder="Chọn loại" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CCCD">Căn cước công dân</SelectItem>
                <SelectItem value="CMND">CMND</SelectItem>
                <SelectItem value="Passport">Passport</SelectItem>
                <SelectItem value="Khác">Khác</SelectItem>
              </SelectContent>
            </Select>
          </Field>

          <Field label="Số giấy tờ">
            <Input
              value={formData.idNumber}
              onChange={(e) =>
                setFormData({ ...formData, idNumber: e.target.value })
              }
              className="h-8 text-xs"
            />
          </Field>

          <Field label="Ngày cấp">
            <Input
              type="date"
              value={formData.issueDate}
              onChange={(e) =>
                setFormData({ ...formData, issueDate: e.target.value })
              }
              className="h-8 text-xs"
            />
          </Field>

          <Field label="Nơi cấp">
            <Input
              value={formData.issuePlace}
              onChange={(e) =>
                setFormData({ ...formData, issuePlace: e.target.value })
              }
              className="h-8 text-xs"
              placeholder="VD: TP.HCM"
            />
          </Field>

          {/* Nghề nghiệp */}
          <Field label="Nghề nghiệp" required>
            <Select
              value={formData.occupation}
              onValueChange={(value) =>
                setFormData({ ...formData, occupation: value })
              }
            >
              <SelectTrigger className="h-8 text-xs bg-white">
                <SelectValue placeholder="Chọn nghề nghiệp" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="00000">Không nghề nghiệp</SelectItem>
                <SelectItem value="NVVP">Nhân viên văn phòng</SelectItem>
                <SelectItem value="HS">Học sinh</SelectItem>
                <SelectItem value="SV">Sinh viên</SelectItem>
              </SelectContent>
            </Select>
          </Field>

          {/* Dân tộc */}
          <Field label="Dân tộc" required>
            <Select
              value={formData.ethnicity}
              onValueChange={(value) =>
                setFormData({ ...formData, ethnicity: value })
              }
            >
              <SelectTrigger className="h-8 text-xs bg-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Kinh">Kinh</SelectItem>
                <SelectItem value="Tày">Tày</SelectItem>
                <SelectItem value="Hoa">Hoa</SelectItem>
              </SelectContent>
            </Select>
          </Field>

          {/* Quốc tịch */}
          <Field label="Quốc tịch" required>
            <Input
              value={formData.nationality}
              readOnly
              className="h-8 text-xs bg-gray-50"
            />
          </Field>
        </div>

        {/* 2. THÔNG TIN LIÊN HỆ & NGƯỜI THÂN */}
        <SectionTitle
          label="Thông tin liên hệ & người thân"
          icon={Phone}
        />

        <div className="grid grid-cols-2 gap-3">
          <Field label="SĐT người liên hệ">
            <Input
              value={formData.contactPhoneNumber}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  contactPhoneNumber: e.target.value,
                })
              }
              className="h-8 text-xs"
            />
          </Field>

          <Field label="Tên người liên hệ">
            <Input
              value={formData.contactFullName}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  contactFullName: e.target.value,
                })
              }
              className="h-8 text-xs"
            />
          </Field>

          <Field label="Mối quan hệ với NB">
            <Select
              value={formData.relationship}
              onValueChange={(value) =>
                setFormData({ ...formData, relationship: value })
              }
            >
              <SelectTrigger className="h-8 text-xs bg-white">
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

          <Field label="Người giám hộ (nếu có)">
            <Input
              value={formData.guardian}
              onChange={(e) =>
                setFormData({ ...formData, guardian: e.target.value })
              }
              className="h-8 text-xs"
            />
          </Field>
        </div>

        {/* 3. THÔNG TIN HỌC SINH / NƠI LÀM VIỆC */}
        <SectionTitle
          label="Thông tin học sinh / nơi làm việc"
          icon={Building2}
        />

        <div className="grid grid-cols-2 gap-3">
          <Field label="Nơi làm việc">
            <Input
              value={formData.workplace}
              onChange={(e) =>
                setFormData({ ...formData, workplace: e.target.value })
              }
              className="h-8 text-xs"
            />
          </Field>

          <Field label="Tên trường học">
            <Input
              value={formData.schoolName}
              onChange={(e) =>
                setFormData({ ...formData, schoolName: e.target.value })
              }
              className="h-8 text-xs"
            />
          </Field>

          <Field label="Lớp">
            <Input
              value={formData.className}
              onChange={(e) =>
                setFormData({ ...formData, className: e.target.value })
              }
              className="h-8 text-xs"
            />
          </Field>

          <Field label="Mã HS/SV">
            <Input
              value={formData.studentCode}
              onChange={(e) =>
                setFormData({ ...formData, studentCode: e.target.value })
              }
              className="h-8 text-xs"
            />
          </Field>
        </div>

        {/* 4. GIẤY TỜ TÙY THÂN (OPTION) */}
        <SectionTitle label="Giấy tờ tùy thân bổ sung" icon={IdCard} />
        {/* Nếu sau này anh cần thêm trường, có thể thêm vào đây */}
      </CardContent>
    </Card>
  );
}

/* ============================== */
/* COMPONENT TÁI SỬ DỤNG          */
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
