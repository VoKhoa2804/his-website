export type IsoDateString = `${number}${string}`
export type IsoDateTimeString = `${number}${string}`

export interface BenhNhan {
  ho_lot: string
  ten: string
  ho_ten: string
  phai: 0 | 1
  ngay_sinh?: IsoDateString
  dien_thoai?: string
  so_nha?: string
  dia_chi?: string
  phuong_xa_id?: string
  quan_huyen_id?: string
  tinh_thanh_id?: string
  nghe_nghiep_id?: string
  dan_toc_id?: string
  quoc_tich_id?: string
  cccd?: string
  ngay_cap_cccd?: IsoDateString
  noi_cap_cccd?: string
  moi_quan_he_id?: string
  ho_ten_nguoi_than?: string
  dien_thoai_nguoi_than?: string
  ghi_chu?: string
}

export interface PhongKhamInfo {
  id: string
  ma: string
  ten: string
  ten_loai_thu?: string
  don_gia?: number
  don_gia_bhyt?: number
  don_gia_dv?: number
  ty_le_bhtt?: number
}

export interface DangKyKham {
  ma_ho_so?: string
  ma_benh_nhan?: string
  ma_emr?: string
  ly_do_kham: string
  ngay_kham: IsoDateTimeString
  loai_kcb_id: string
  doi_tuong_kcb_id: string
  uu_tien_id?: string
  bs_gioi_thieu_id?: string
  phong_kham_id: string
  phong_kham?: PhongKhamInfo
  chan_doan_so_bo?: string
  ghi_chu?: string
}

export interface TheBhyt {
  ma_the: string
  ma_quyen_loi?: string
  muc_huong_bh?: number
  ma_kv?: string
  ma_dkbd?: string
  dia_chi_the?: string
  gt_the_tu?: IsoDateString
  gt_the_den?: IsoDateString
  ngay_du5_nam?: IsoDateString
  ngay_mien_cct?: IsoDateString
  noi_dang_ky?: string
  tuyen_truoc_id?: string
  ten_tuyen_truoc?: string
  so_phieu_tuyen_truoc?: string
  chan_doan_tuyen_truoc?: string
  icd_tuyen_truoc?: string
  chan_doan?: string
  ma_icd_chan_doan?: string
}

export interface TiepNhanRequest {
  benh_nhan: BenhNhan
  dang_ky_kham: DangKyKham
  the_bhyt: TheBhyt
}

export interface TiepNhanResponse {
  code: number
  is_succeeded: boolean
  message: string
  data?: Record<string, unknown>
}
