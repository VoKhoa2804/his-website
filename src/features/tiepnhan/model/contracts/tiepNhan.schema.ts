import { z } from "zod"
import type { TiepNhanRequest } from "../tiepNhanTypes"

const ISO_DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/
const ISO_DATETIME_REGEX = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/

const isoDateString = z
  .string()
  .regex(ISO_DATE_REGEX, { message: "Định dạng ngày phải là yyyy-MM-dd" })

const isoDateStringOptional = isoDateString.optional()

const isoDateTimeString = z
  .string()
  .regex(ISO_DATETIME_REGEX, { message: "Định dạng ngày giờ phải là yyyy-MM-ddTHH:mm:ssZ" })

const isoDateTimeStringOptional = isoDateTimeString.optional()

export const benhNhanSchema = z.object({
  ho_lot: z.string().min(1, "Vui lòng nhập họ lót"),
  ten: z.string().min(1, "Vui lòng nhập tên"),
  ho_ten: z.string().min(1, "Vui lòng nhập họ tên"),
  phai: z.union([z.literal(0), z.literal(1)]),
  ngay_sinh: isoDateStringOptional,
  dien_thoai: z.string().optional(),
  so_nha: z.string().optional(),
  dia_chi: z.string().optional(),
  phuong_xa_id: z.string().optional(),
  quan_huyen_id: z.string().optional(),
  tinh_thanh_id: z.string().optional(),
  nghe_nghiep_id: z.string().optional(),
  dan_toc_id: z.string().optional(),
  quoc_tich_id: z.string().optional(),
  cccd: z.string().optional(),
  ngay_cap_cccd: isoDateStringOptional,
  noi_cap_cccd: z.string().optional(),
  moi_quan_he_id: z.string().optional(),
  ho_ten_nguoi_than: z.string().optional(),
  dien_thoai_nguoi_than: z.string().optional(),
  ghi_chu: z.string().optional(),
})

export const phongKhamSchema = z.object({
  id: z.string().min(1, "Vui lòng chọn phòng khám"),
  ma: z.string().min(1),
  ten: z.string().min(1),
  ten_loai_thu: z.string().optional(),
  don_gia: z.number().optional(),
  don_gia_bhyt: z.number().optional(),
  don_gia_dv: z.number().optional(),
  ty_le_bhtt: z.number().optional(),
})

export const dangKyKhamSchema = z.object({
  ma_ho_so: z.string().optional(),
  ma_benh_nhan: z.string().optional(),
  ma_emr: z.string().optional(),
  ly_do_kham: z.string().min(1, "Vui lòng nhập lý do đến khám"),
  ngay_kham: isoDateTimeString,
  loai_kcb_id: z.string().min(1, "Vui lòng chọn loại KCB"),
  doi_tuong_kcb_id: z.string().min(1, "Vui lòng chọn đối tượng KCB"),
  uu_tien_id: z.string().optional(),
  bs_gioi_thieu_id: z.string().optional(),
  phong_kham_id: z.string().min(1, "Vui lòng chọn phòng khám"),
  phong_kham: phongKhamSchema.optional(),
  chan_doan_so_bo: z.string().optional(),
  ghi_chu: z.string().optional(),
})

export const theBhytSchema = z.object({
  ma_the: z.string().min(1, "Vui lòng nhập mã thẻ BHYT"),
  ma_quyen_loi: z.string().optional(),
  muc_huong_bh: z.number().int().nonnegative().optional(),
  ma_kv: z.string().optional(),
  ma_dkbd: z.string().optional(),
  dia_chi_the: z.string().optional(),
  gt_the_tu: isoDateStringOptional,
  gt_the_den: isoDateStringOptional,
  ngay_du5_nam: isoDateStringOptional,
  ngay_mien_cct: isoDateStringOptional,
  noi_dang_ky: z.string().optional(),
  tuyen_truoc_id: z.string().optional(),
  ten_tuyen_truoc: z.string().optional(),
  so_phieu_tuyen_truoc: z.string().optional(),
  chan_doan_tuyen_truoc: z.string().optional(),
  icd_tuyen_truoc: z.string().optional(),
  chan_doan: z.string().optional(),
  ma_icd_chan_doan: z.string().optional(),
})

export const tiepNhanSchema = z.object({
  benh_nhan: benhNhanSchema,
  dang_ky_kham: dangKyKhamSchema,
  the_bhyt: theBhytSchema,
})

export type BenhNhanSchema = z.infer<typeof benhNhanSchema>
export type DangKyKhamSchema = z.infer<typeof dangKyKhamSchema>
export type TheBhytSchema = z.infer<typeof theBhytSchema>
export type TiepNhanSchema = z.infer<typeof tiepNhanSchema>

export const validateTiepNhan = (payload: TiepNhanRequest) => tiepNhanSchema.safeParse(payload)
