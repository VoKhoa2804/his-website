import { z } from "zod"

const isoDateRegex = /^\d{4}-\d{2}-\d{2}$/

const optionalIsoDateField = z
  .string()
  .optional()
  .superRefine((value, ctx) => {
    if (!value) return
    if (!isoDateRegex.test(value)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Định dạng ngày phải là yyyy-MM-dd",
      })
    }
  })

const requiredIsoDateField = z
  .string({
    required_error: "Vui lòng nhập ngày hợp lệ",
  })
  .min(1, "Vui lòng nhập ngày")
  .superRefine((value, ctx) => {
    if (!isoDateRegex.test(value)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Định dạng ngày phải là yyyy-MM-dd",
      })
    }
  })

export const dangKyKhamSchema = z.object({
  receptionCode: z.string().optional(),
  patientCode: z.string().optional(),
  emrCode: z.string().optional(),
  visitReason: z.string().min(1, "Vui lòng nhập lý do đến khám"),
  visitType: z.string().min(1, "Vui lòng chọn loại KCB"),
  patientType: z.string().optional(),
  department: z.string().min(1, "Vui lòng chọn đối tượng KCB"),
  room: z.string().min(1, "Vui lòng chọn phòng khám"),
  uuTien: z.string().optional(),
  priorityLevel: z.string().optional(),
  referrer: z.string().optional(),
  phongKhamIds: z.array(z.string()).optional(),
  phongKhamNames: z.array(z.string()).optional(),
})

export const tiepNhanBenhNhanSchema = z.object({
  phoneNumber: z.string().optional(),
  fullName: z.string().min(1, "Vui lòng nhập họ và tên"),
  dateOfBirth: requiredIsoDateField,
  age: z.string().optional(),
  gender: z.string().min(1, "Vui lòng chọn giới tính"),
  occupation: z.string().min(1, "Vui lòng chọn nghề nghiệp"),
  ethnicity: z.string().min(1, "Vui lòng chọn dân tộc"),
  ethnicityCode: z.string().optional(),
  nationality: z.string().min(1, "Vui lòng chọn quốc tịch"),
  nationalityCode: z.string().optional(),
  houseNumber: z.string().optional(),
  ward: z.string().optional(),
  tinhThanh: z.string().optional(),
  quanHuyen: z.string().optional(),
  phuongXa: z.string().optional(),
  idType: z.string().optional(),
  idNumber: z.string().min(1, "Vui lòng nhập số CCCD/Hộ chiếu"),
  issueDate: optionalIsoDateField,
  issuePlace: z.string().optional(),
  contactPhoneNumber: z.string().optional(),
  contactFullName: z.string().optional(),
  relationship: z.string().optional(),
})

export const theBaoHiemSchema = z.object({
  insuranceNumber: z.string().min(1, "Vui lòng nhập mã thẻ BHYT"),
  benefitLevel: z.string().min(1, "Vui lòng nhập mức hưởng"),
  insuranceFrom: optionalIsoDateField,
  insuranceTo: optionalIsoDateField,
  registrationPlace: z.string().min(1, "Vui lòng nhập nơi đăng ký KCB"),
  referralPlace: z.string().optional(),
  transferNumber: z.string().optional(),
  icdDiagnosis: z.string().optional(),
  diagnosisText: z.string().optional(),
  poorHousehold: z.boolean().optional(),
  poorHouseholdNumber: z.string().optional(),
  hasAppointment: z.boolean().optional(),
  appointmentDate: optionalIsoDateField,
  appointmentTime: z.string().optional(),
  addressOnCard: z.string().min(1, "Vui lòng nhập địa chỉ theo thẻ"),
  maKV: z.string().min(1, "Vui lòng nhập mã KV"),
  ngayDu5Nam: optionalIsoDateField,
  ngayMienCCT: optionalIsoDateField,
  tenNoiChuyenTuyen: z.string().optional(),
})

export const tiepNhanFormSchema = z.object({
  dangKyKham: dangKyKhamSchema,
  tiepNhanBenhNhan: tiepNhanBenhNhanSchema,
  theBaoHiem: theBaoHiemSchema,
})

export type DangKyKhamSchema = z.infer<typeof dangKyKhamSchema>
export type TiepNhanBenhNhanSchema = z.infer<typeof tiepNhanBenhNhanSchema>
export type TheBaoHiemSchema = z.infer<typeof theBaoHiemSchema>
export type TiepNhanFormSchema = z.infer<typeof tiepNhanFormSchema>
