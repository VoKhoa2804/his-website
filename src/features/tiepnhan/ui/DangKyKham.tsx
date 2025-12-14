// import { useState } from "react";
// import { Camera, QrCode, User, Stethoscope } from "lucide-react";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
// import { Input } from "@/shared/ui/input";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select";
// import { Button } from "@/shared/ui/button";
// import { Label } from "@/shared/ui/label";


// export function DangKyKham() {
//   const [formData, setFormData] = useState({
//     receptionCode: "",
//     patientCode: "",
//     emrCode: "",
//     fullName: "",
//     dateOfBirth: "",
//     age: "",
//     gender: "",
//     address: "",
//     visitReason: "",
//     visitType: "",
//     department: "",
//     doctor: "",
//     room: "",
//     patientType: "Thu phí",
//     clinic: "",
//     referrer: "",
//   });

//   return (
//     <Card className="border border-gray-300 shadow-sm h-full">
//       {/* HEADER */}
//       <CardHeader className="bg-sky-700 text-white px-4 py-3">
//         <div className="flex items-center justify-between">
//           <CardTitle className="text-xs font-bold tracking-wide flex items-center gap-2">
//             <User className="w-4 h-4 text-white" />
//             THÔNG TIN BỆNH NHÂN & TIẾP ĐÓN
//           </CardTitle>
//           <CardDescription className="text-[11px] text-white/80">
//             Kiểm tra kỹ thông tin trước khi lưu
//           </CardDescription>
//         </div>
//       </CardHeader>

//       {/* BODY */}
//       <CardContent className="p-4 space-y-4">
//         {/* Row 1: Avatar + Thông tin cơ bản */}
//         <div className="flex gap-4">
//           {/* Avatar */}
//           <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center relative flex-shrink-0">
//             <div className="w-12 h-12 rounded-full bg-gray-300" />
//             <Button
//               type="button"
//               size="icon"
//               variant="default"
//               className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-blue-600 hover:bg-blue-700"
//             >
//               <Camera className="w-3 h-3" />
//             </Button>
//           </div>

//           {/* Thông tin cơ bản */}

//           <div className="flex-1 grid grid-cols-3 gap-3">
//             <Field label="Mã tiếp đón">
//               <div className="relative">
//                 <Input
//                   value={formData.receptionCode}
//                   onChange={(e) =>
//                     setFormData({ ...formData, receptionCode: e.target.value })
//                   }
//                   placeholder="Quét QR code hoặc tự nhập"
//                   className="pr-10"  // chừa chỗ icon
//                 />
//                 <QrCode className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground cursor-pointer" />
//               </div>
//             </Field>

//             <Field label="Mã bệnh nhân *">
//               <div className="flex gap-2">
//                 <Input
//                   value={formData.patientCode}
//                   onChange={(e) =>
//                     setFormData({ ...formData, patientCode: e.target.value })
//                   }
//                   placeholder="Nhập mã BN"
//                 />
//               </div>
//             </Field>

//             <Field label="Mã khám bệnh">
//               <Input
//                 value={formData.emrCode}
//                 onChange={(e) =>
//                   setFormData({ ...formData, emrCode: e.target.value })
//                 }
//                 placeholder="Mã đợt khám bệnh"
//               />
//             </Field>
//             <div className="col-span-2">
//               <Field label="Lý do đến khám">
//                 <Input
//                   value={formData.visitReason}
//                   onChange={(e) =>
//                     setFormData({ ...formData, visitReason: e.target.value })
//                   }
//                   placeholder="VD: Đau bụng, tái khám..."
//                 />
//               </Field>
//             </div>
//             <Field label="Người giới thiệu">
//               <Select
//                 value={formData.referrer}
//                 onValueChange={(value) =>
//                   setFormData({ ...formData, referrer: value })
//                 }
//               >
//                 <SelectTrigger className="h-8 text-xs bg-white">
//                   <SelectValue placeholder="Chọn" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="tu-den">1. Tự đến</SelectItem>
//                   <SelectItem value="chuyen-vien">2. Giới thiệu / chuyển viện</SelectItem>
//                   <SelectItem value="dv">9. KCB Dịch vụ</SelectItem>
//                 </SelectContent>
//               </Select>
//             </Field>

//             <Field label="Phòng khám">
//               <Select
//                 value={formData.visitType}
//                 onValueChange={(value) =>
//                   setFormData({ ...formData, visitType: value })
//                 }
//               >
//                 <SelectTrigger className="h-8 text-xs bg-white">
//                   <SelectValue placeholder="Chọn" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="kham-moi">Khám mới</SelectItem>
//                   <SelectItem value="tai-kham">Tái khám</SelectItem>
//                   <SelectItem value="cap-cuu">Cấp cứu</SelectItem>
//                 </SelectContent>
//               </Select>
//             </Field>
//             <Field label="Đối tương">
//               <Select
//                 value={formData.department}
//                 onValueChange={(value) =>
//                   setFormData({ ...formData, department: value })
//                 }
//               >
//                 <SelectTrigger className="h-8 text-xs bg-white">
//                   <SelectValue placeholder="Chọn khoa" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="ngoai-tong-quat">
//                     Ngoại tổng quát
//                   </SelectItem>
//                   <SelectItem value="noi-tong-quat">
//                     Nội tổng quát
//                   </SelectItem>
//                   <SelectItem value="kham-yc">Khám yêu cầu</SelectItem>
//                 </SelectContent>
//               </Select>
//             </Field>
//             <Field label="Loại ưu tiên">
//               <Select
//                 value={formData.room}
//                 onValueChange={(value) =>
//                   setFormData({ ...formData, room: value })
//                 }
//               >
//                 <SelectTrigger className="h-8 text-xs bg-white">
//                   <SelectValue placeholder="Chọn buồng khám" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="pk-01">PK 01</SelectItem>
//                   <SelectItem value="pk-02">PK 02</SelectItem>
//                   <SelectItem value="pk-03">PK 03</SelectItem>
//                 </SelectContent>
//               </Select>
//             </Field>
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   );
// }

// /* ============================== */
// /* FIELD COMPONENT TÁI SỬ DỤNG    */
// /* ============================== */
// function Field({
//   label,
//   children,
//   required,
// }: {
//   label: string;
//   children: React.ReactNode;
//   required?: boolean;
// }) {
//   // Tách sao nếu label có *
//   const hasStar = label.includes("*");
//   const cleanLabel = hasStar ? label.replace("*", "").trim() : label;

//   return (
//     <div className="space-y-1">
//       <Label className="text-base text-gray-700 flex items-center gap-1">
//         {cleanLabel}
//         {(required || hasStar) && (
//           <span className="text-red-600">*</span>
//         )}
//       </Label>

//       {children}
//     </div>
//   );
// }



import { Camera, QrCode, User } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { Button } from "@/shared/ui/button";
import { Label } from "@/shared/ui/label";
import { useTiepNhanForm } from "../hooks/useTiepNhanForm";

export function DangKyKham() {
  const { formData, updateDangKyKham } = useTiepNhanForm()
  const dangKyData = formData.dangKyKham

  return (
    <Card className="border border-gray-300 shadow-sm h-full">
      {/* HEADER */}
      <CardHeader className="bg-sky-700 text-white px-4 py-3">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-sm sm:text-xs font-bold tracking-wide flex items-center gap-2">
            <User className="w-4 h-4 text-white" />
            THÔNG TIN BỆNH NHÂN &amp; TIẾP ĐÓN
          </CardTitle>
          <CardDescription className="text-[11px] text-white/80">
            Kiểm tra kỹ thông tin trước khi lưu
          </CardDescription>
        </div>
      </CardHeader>

      {/* BODY */}
      <CardContent className="p-3 sm:p-4 space-y-4">
        {/* Row 1: Avatar + Thông tin cơ bản */}
        <div className="flex flex-col md:flex-row gap-4">
          {/* Avatar */}
          <div className="mx-auto md:mx-0 w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full bg-gray-200 flex items-center justify-center relative flex-shrink-0">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-300" />
            <Button
              type="button"
              size="icon"
              variant="default"
              className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-blue-600 hover:bg-blue-700"
            >
              <Camera className="w-3 h-3" />
            </Button>
          </div>

          {/* Thông tin cơ bản + tiếp đón */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
            <Field label="Mã tiếp đón">
              <div className="relative">
                <Input
                  value={dangKyData.receptionCode}
                  onChange={(e) =>
                    updateDangKyKham({ receptionCode: e.target.value })
                  }
                  placeholder="Quét QR code hoặc tự nhập"
                  className="pr-10" // chừa chỗ icon
                />
                <QrCode className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground cursor-pointer" />
              </div>
            </Field>

            <Field label="Loại KCB">
              <Select
                value={dangKyData.visitType}
                onValueChange={(value) =>
                  updateDangKyKham({ visitType: value })
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

            <Field label="Đối tương KCB">
              <Select
                value={dangKyData.visitType}
                onValueChange={(value) =>
                  updateDangKyKham({ visitType: value })
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

            {/* Lý do đến khám – full width mobile, 2/3 trên md */}
            <div className="col-span-1 md:col-span-2">
              <Field label="Lý do đến khám">
                <Input
                  value={dangKyData.visitReason}
                  onChange={(e) =>
                    updateDangKyKham({ visitReason: e.target.value })
                  }
                  placeholder="VD: Đau bụng, tái khám..."
                />
              </Field>
            </div>

            <Field label="Người giới thiệu">
              <Select
                value={dangKyData.referrer}
                onValueChange={(value) =>
                  updateDangKyKham({ referrer: value })
                }
              >
                <SelectTrigger className="h-8 text-xs bg-white">
                  <SelectValue placeholder="Chọn" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tu-den">1. Tự đến</SelectItem>
                  <SelectItem value="chuyen-vien">
                    2. Giới thiệu / chuyển viện
                  </SelectItem>
                  <SelectItem value="dv">9. KCB Dịch vụ</SelectItem>
                </SelectContent>
              </Select>
            </Field>

            <Field label="Phòng khám">
              <Select
                value={dangKyData.visitType}
                onValueChange={(value) =>
                  updateDangKyKham({ visitType: value })
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

            <Field label="Đối tương">
              <Select
                value={dangKyData.department}
                onValueChange={(value) =>
                  updateDangKyKham({ department: value })
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

            <Field label="Loại ưu tiên">
              <Select
                value={dangKyData.room}
                onValueChange={(value) =>
                  updateDangKyKham({ room: value })
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
          </div>
        </div>
        {/* <div className="grid grid-cols-4 gap-3">
          <Field label="Loại ưu tiên">
              <Select
                value={dangKyData.room}
                onValueChange={(value) =>
                  updateDangKyKham({ room: value })
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
        </div> */}
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

