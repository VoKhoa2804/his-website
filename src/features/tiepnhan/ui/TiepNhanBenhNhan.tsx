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
        <div className="grid grid-cols-4 gap-3">
         

          {/* Họ và tên */}
          <div className="col-span-2">
            <Field label="Họ và tên" required>
              <Input
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
                placeholder="Nhập họ và tên"
              />
            </Field>
          </div>


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
          {/* Ngày sinh */}


          {/* Giờ sinh + Tuổi + Giới tính */}
          <Field label="Ngày sinh" required>
            <Input
              type="date"
              value={formData.dateOfBirth}
              onChange={(e) =>
                setFormData({ ...formData, dateOfBirth: e.target.value })
              }
              className="h-8 text-xs"
            />
          </Field>

          
          {/* Địa chỉ thường trú */}
          <div className="col-span-2">
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
          </div>

          <div className="col-span-2">
            <Field label="Phường/Xã, Tỉnh/TP">
              <Input
                value={formData.tempWard}
                onChange={(e) =>
                  setFormData({ ...formData, tempWard: e.target.value })
                }
                className="h-8 text-xs"
              />
            </Field>
          </div>
          

 {/* Số điện thoại */}
          <Field label="Số điện thoại">
            <Input
              value={formData.phoneNumber}
              onChange={(e) =>
                setFormData({ ...formData, phoneNumber: e.target.value })
              }
              placeholder="Nhập số điện thoại"
            />
          </Field>

          {/* Giấy tờ tùy thân */}
          <Field label="CCCD/Hộ chiếu" required>
            <Input
              value={formData.idNumber}
              onChange={(e) =>
                setFormData({ ...formData, idNumber: e.target.value })
              }
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
          <div className="col-span-2">
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
          </div>
{/* Dân tộc */}
          <Field label="Quốc tịch" required>
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

        </div>

        {/* 2. THÔNG TIN LIÊN HỆ & NGƯỜI THÂN */}
        <SectionTitle
          label="Thông tin liên hệ & người thân"
          icon={Phone}
        />

        <div className="grid grid-cols-6 gap-3">
           <Field label="Quan hệ với NB">
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

        </div>
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
  // Tách sao nếu label có *
  const hasStar = label.includes("*");
  const cleanLabel = hasStar ? label.replace("*", "").trim() : label;

  return (
    <div className="space-y-1">
      <Label className="text-[13px] sm:text-sm md:text-base text-gray-700 flex items-center gap-1">
        {cleanLabel}
        {(required || hasStar) && (
          <span className="text-red-600">*</span>
        )}
      </Label>

      {children}
    </div>
  );
}

