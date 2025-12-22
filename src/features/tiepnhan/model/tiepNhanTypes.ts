export type IsoDateString = `${number}${string}`
export type IsoDateTimeString = `${number}${string}`

export interface BenhNhan {
  id?: number
  ho_lot: string
  ten: string
  ho_ten: string
  ten_tat?: string
  phai: 0 | 1
  ngay_sinh?: IsoDateString
  nam_sinh?: string
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
  dia_chi_nguoi_lien_he?: string
  ghi_chu?: string
  user_id?: string
  thu_ky_id?: string
}

export interface PhongKhamInfo {
  id: string
  ma: string
  ten: string
  vp_loai_thu_id?: string
  ten_loai_thu?: string
  don_vi?: string
  vp_nhom_id?: string
  don_gia?: number
  don_gia_bhyt?: number
  don_gia_dv?: number
  tyle_bhtt?: number
  chenh_lech?: boolean
  hien_thi?: boolean
}

export interface DangKyKham {
  ho_so_kham_id?: number
  khoa_dieu_tri_id?: number
  tiep_nhan_id?: number
  benh_an_id?: number
  benh_nhan_id?: number
  ma_ho_so?: string
  ma_benh_nhan?: string
  ma_emr?: string
  ly_do_kham: string
  ngay_kham: IsoDateTimeString
  loai_kcb_id: string
  doi_tuong_kcb_id: string
  uu_tien_id?: string
  doi_tuong_id?: string
  bs_gioi_thieu_id?: string
  nguoi_gioi_thieu_id?: string
  phong_kham?: PhongKhamInfo
  chan_doan_so_bo?: string
  ghi_chu?: string
  tuyen_truoc_id?: string
  so_phieu_tuyen_truoc?: string
  icd_tuyen_truoc?: string
  chan_doan_tuyen_truoc?: string
  ho_ngheo?: boolean
  so_giay_ho_ngheo?: string
  user_id?: string
  thu_ky_id?: string
  kham_suc_khoe?: boolean
}

export interface TheBhyt {
  id?: string
  tiep_nhan_id?: string
  benh_nhan_id?: string
  ngay?: IsoDateTimeString
  ten_dkbd?: string
  ma_the: string
  cccd?: string
  ma_quyen_loi?: string
  muc_huong_bh?: number
  ma_tuyen_truoc?: string
  mien_cct_trong_nam?: IsoDateTimeString
  ma_ket_qua?: string
  ghi_chu?: string
  ho_ten?: string
  ngay_sinh?: IsoDateString
  gioi_tinh?: string
  dia_chi?: string
  ma_kv?: string
  ma_dkbd?: string
  dia_chi_the?: string
  gt_the_tu?: IsoDateString
  gt_the_den?: IsoDateString
  ngay_du5_nam?: IsoDateString
  ngay_mien_cct?: IsoDateString
  ngay_cap?: IsoDateString
  ten_cha_me?: string
  noi_dang_ky?: string
  tuyen_truoc_id?: string
  ten_tuyen_truoc?: string
  so_phieu_tuyen_truoc?: string
  chan_doan_tuyen_truoc?: string
  icd_tuyen_truoc?: string
  chan_doan?: string
  ma_icd_chan_doan?: string
  ma_so_bhxh?: string
  kiem_tra_bhxh?: string
  noi_cap_the?: string
  user_id?: string
  thu_ky_id?: string
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
