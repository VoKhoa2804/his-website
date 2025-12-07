import { useState } from "react";
import { Camera, QrCode, User, Stethoscope } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select";
import { Button } from "@/shared/ui/button";
import { Label } from "@/shared/ui/label";

export function DangKyKham() {
  const [formData, setFormData] = useState({
    receptionCode: "",
    patientCode: "",
    emrCode: "",
    fullName: "",
    dateOfBirth: "",
    age: "",
    gender: "",
    address: "",
    visitReason: "",
    visitType: "",
    department: "",
    doctor: "",
    room: "",
    patientType: "Thu phí",
    clinic: "",
    referrer: "",
  });

  return (
    <Card className="border border-gray-300 shadow-sm h-full">
      {/* HEADER */}
      <CardHeader className="bg-sky-700 text-white px-4 py-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xs font-bold tracking-wide flex items-center gap-2">
            <User className="w-4 h-4 text-white" />
            THÔNG TIN BỆNH NHÂN & TIẾP ĐÓN
          </CardTitle>
          <CardDescription className="text-[11px] text-white/80">
            Kiểm tra kỹ thông tin trước khi lưu
          </CardDescription>
        </div>
      </CardHeader>

      {/* BODY */}
      <CardContent className="p-4 space-y-4">
        {/* Row 1: Avatar + Thông tin cơ bản */}
        <div className="flex gap-4">
          {/* Avatar */}
          <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center relative flex-shrink-0">
            <div className="w-12 h-12 rounded-full bg-gray-300" />
            <Button
              type="button"
              size="icon"
              variant="default"
              className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-blue-600 hover:bg-blue-700"
            >
              <Camera className="w-3 h-3" />
            </Button>
          </div>

          {/* Thông tin cơ bản */}
          <div className="flex-1 grid grid-cols-3 gap-3">
            <Field label="Mã tiếp đón">
              <Input
                value={formData.receptionCode}
                onChange={(e) =>
                  setFormData({ ...formData, receptionCode: e.target.value })
                }
                //className="h-8 text-xs"
                placeholder="Tự sinh hoặc nhập"
              />
            </Field>

            <Field label="Mã bệnh nhân">
              <div className="flex gap-2">
                <Input
                  value={formData.patientCode}
                  onChange={(e) =>
                    setFormData({ ...formData, patientCode: e.target.value })
                  }
                  className="h-8 text-xs"
                  placeholder="Nhập mã BN"
                />
                <Button
                  type="button"
                  size="icon"
                  variant="outline"
                  className="h-8 w-8 flex-shrink-0"
                >
                  <QrCode className="w-3.5 h-3.5" />
                </Button>
              </div>
            </Field>

            <Field label="Mã HSBA/EMR">
              <Input
                value={formData.emrCode}
                onChange={(e) =>
                  setFormData({ ...formData, emrCode: e.target.value })
                }
                className="h-8 text-xs"
                placeholder="Mã HSBA điện tử"
              />
            </Field>

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

            <Field label="Ngày sinh">
              <Input
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) =>
                  setFormData({ ...formData, dateOfBirth: e.target.value })
                }
                className="h-8 text-xs"
              />
            </Field>

            <div className="grid grid-cols-2 gap-2">
              <Field label="Tuổi">
                <Input
                  value={formData.age}
                  onChange={(e) =>
                    setFormData({ ...formData, age: e.target.value })
                  }
                  className="h-8 text-xs text-center"
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

            <Field label="Địa chỉ">
              <Input
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                className="h-8 text-xs col-span-3"
                placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành"
              />
            </Field>
          </div>
        </div>

        {/* Row 2: Thông tin tiếp đón / khám */}
        <div className="pt-2 space-y-3">
          <div className="flex items-center gap-2">
            <Stethoscope className="w-4 h-4 text-sky-700" />
            <span className="text-xs font-semibold text-gray-700">
              Thông tin tiếp đón / khám
            </span>
            <div className="flex-1 border-t border-gray-200 ml-1" />
          </div>

          <div className="grid grid-cols-4 gap-3">
            <Field label="Lý do đến khám">
              <Input
                value={formData.visitReason}
                onChange={(e) =>
                  setFormData({ ...formData, visitReason: e.target.value })
                }
                className="h-8 text-xs"
                placeholder="VD: Đau bụng, tái khám..."
              />
            </Field>

            <Field label="Hình thức đến khám">
              <Select
                value={formData.visitType}
                onValueChange={(value) =>
                  setFormData({ ...formData, visitType: value })
                }
              >
                <SelectTrigger className="h-8 text-xs bg-white">
                  <SelectValue placeholder="Chọn" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="kham-moi">Khám mới</SelectItem>
                  <SelectItem value="tai-kham">Tái khám</SelectItem>
                  <SelectItem value="cap-cuu">Cấp cứu</SelectItem>
                </SelectContent>
              </Select>
            </Field>

            <Field label="Khoa khám">
              <Select
                value={formData.department}
                onValueChange={(value) =>
                  setFormData({ ...formData, department: value })
                }
              >
                <SelectTrigger className="h-8 text-xs bg-white">
                  <SelectValue placeholder="Chọn khoa" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ngoai-tong-quat">
                    Ngoại tổng quát
                  </SelectItem>
                  <SelectItem value="noi-tong-quat">
                    Nội tổng quát
                  </SelectItem>
                  <SelectItem value="kham-yc">Khám yêu cầu</SelectItem>
                </SelectContent>
              </Select>
            </Field>

            <Field label="Bác sĩ chỉ định">
              <Select
                value={formData.doctor}
                onValueChange={(value) =>
                  setFormData({ ...formData, doctor: value })
                }
              >
                <SelectTrigger className="h-8 text-xs bg-white">
                  <SelectValue placeholder="Chọn bác sĩ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bs-a">BS. A</SelectItem>
                  <SelectItem value="bs-b">BS. B</SelectItem>
                  <SelectItem value="bs-c">BS. C</SelectItem>
                </SelectContent>
              </Select>
            </Field>

            <Field label="Buồng khám">
              <Select
                value={formData.room}
                onValueChange={(value) =>
                  setFormData({ ...formData, room: value })
                }
              >
                <SelectTrigger className="h-8 text-xs bg-white">
                  <SelectValue placeholder="Chọn buồng khám" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pk-01">PK 01</SelectItem>
                  <SelectItem value="pk-02">PK 02</SelectItem>
                  <SelectItem value="pk-03">PK 03</SelectItem>
                </SelectContent>
              </Select>
            </Field>

            <Field label="Đối tượng">
              <Select
                value={formData.patientType}
                onValueChange={(value) =>
                  setFormData({ ...formData, patientType: value })
                }
              >
                <SelectTrigger className="h-8 text-xs bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Thu phí">Thu phí</SelectItem>
                  <SelectItem value="BHYT">BHYT</SelectItem>
                  <SelectItem value="Miễn phí">Miễn phí</SelectItem>
                </SelectContent>
              </Select>
            </Field>

            <Field label="Phòng khám">
              <Input
                value={formData.clinic}
                onChange={(e) =>
                  setFormData({ ...formData, clinic: e.target.value })
                }
                className="h-8 text-xs"
                placeholder="Tên phòng khám"
              />
            </Field>

            <Field label="Người giới thiệu">
              <Select
                value={formData.referrer}
                onValueChange={(value) =>
                  setFormData({ ...formData, referrer: value })
                }
              >
                <SelectTrigger className="h-8 text-xs bg-white">
                  <SelectValue placeholder="Chọn" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tu-den">1. Tự đến</SelectItem>
                  <SelectItem value="chuyen-vien">2. Giới thiệu / chuyển viện</SelectItem>
                  <SelectItem value="dv">9. KCB Dịch vụ</SelectItem>
                </SelectContent>
              </Select>
            </Field>
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
