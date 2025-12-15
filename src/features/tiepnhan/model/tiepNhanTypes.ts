// DTO Types for Tiep Nhan (Patient Registration)

export interface BenhNhan {
  id?: string
  ho_lot: string
  ten: string
  ho_ten: string
  phai: number // 1: Nam, 0: Nữ
  nam_sinh?: string
  ngay_sinh?: string
  dien_thoai?: string
  cccd?: string
  ngay_cap_cccd?: string
  dia_chi?: string
  so_nha?: string
  phuong_xa_id?: string
  quan_huyen_id?: string
  tinh_thanh_id?: string
  nghe_nghiep_id?: string
  dan_toc_id?: string
  quoc_tich_id?: string
  add_info?: string
  ghi_chu?: string
  user_id?: string
  thu_ky_id?: string
}

export interface TheBaoHiem {
  id?: string
  tiep_nhan_id?: string | null
  benh_nhan_id?: string
  ngay?: string
  kb_ho_so_id?: string
  ten_tuyen_truoc?: string
  so_phieu_tuyen_truoc?: string
  ten_dkbd?: string
  ma_the?: string
  cccd?: string
  ma_quyen_loi?: string
  muc_huong_bh?: number
  loai_kcb_id?: string
  doi_tuong_kcb_id?: string
  ma_tuyen_truoc?: string
  mien_cct_trong_nam?: number | null
  ma_ket_qua?: string
  ghi_chu?: string
  ho_ten?: string
  ngay_sinh?: string
  gioi_tinh?: string
  dia_chi?: string
  ma_dkbd?: string
  gt_the_tu?: string
  gt_the_den?: string
  ngay_cap?: string
  ten_cha_me?: string
  ma_kv?: string
  ngay_du5_nam?: string
  ma_so_bhxh?: string
  kiem_tra_bhxh?: string
  noi_cap_the?: string
  user_id?: string
  thu_ky_id?: string
}

export interface TiepNhanRequest {
  id?: string | null
  benh_nhan: BenhNhan
  the_bao_hiem: TheBaoHiem
  ngay_kham: string
  tiep_nhan_id?: string | null
  phong_ban_id?: string
  doi_tuong_id?: string
  kb_the_bhyt_id?: string
  kham_suc_khoe?: boolean
  ma_the?: string
  ma_quyen_loi?: string
  mien_cct_trong_nam?: number | null
  doi_tuong_kcb_id?: string
  loai_kcb_id?: string
  muc_huong_bh?: number
  the_tu_ngay?: string | null
  the_den_ngay?: string | null
  bhtt_toi_thieu?: number | null
  ty_le_trai_tuyen_bh?: number | null
  trang_thai_kham?: number
  so_thu_tu?: number
  uu_tien_id?: string
  hen_ket_qua_cls?: boolean
  bs_gioi_thieu_id?: string
  user_id?: string
  thu_ky_id?: string
  ma_dkbd?: string
  ma_tuyen_truoc?: string
  so_phieu_tuyen_truoc?: string
  ma_kv?: string
  ngay_du5_nam?: string | null
}

// Response data structure from API
export interface TiepNhanResponseData {
  id: string // UUID of the record
  tiep_nhan_id: string // Registration ID (e.g., "2512000001")
  the_bao_hiem: {
    id: string
    tiep_nhan_id: string
    benh_nhan_id: string
    ngay: string
    kb_ho_so_id: string
    ten_tuyen_truoc: string
    ten_dkbd: string
    so_phieu_tuyen_truoc: string
    ma_the: string
    cccd: string
    ma_quyen_loi: string
    muc_huong_bh: number
    loai_kcb_id: string
    doi_tuong_kcb_id: string
    ma_tuyen_truoc: string
    mien_cct_trong_nam: number | null
    ma_ket_qua: string
    ghi_chu: string
    ho_ten: string
    ngay_sinh: string
    gioi_tinh: string
    dia_chi: string
    ma_dkbd: string
    gt_the_tu: string
    gt_the_den: string
    ngay_cap: string
    ten_cha_me: string
    ma_kv: string
    ngay_du5_nam: string
    ma_so_bhxh: string
    kiem_tra_bhxh: string
    noi_cap_the: string
    user_id: string
    thu_ky_id: string
  }
  benh_nhan_id: string
  ho_ten: string
  phai: string // "1" for male, "0" for female
  ngay_sinh: string
  dia_chi: string
  ngay_kham: string
  phong_ban_id: string
  doi_tuong_id: string
  kb_the_bhyt_id: string
  ma_the: string
  ma_quyen_loi: string
  mien_cct_trong_nam: number | null
  muc_huong_bh: number
  the_tu_ngay: string
  the_den_ngay: string
  doi_tuong_kcb_id: string
  loai_kcb_id: string | null
  bhtt_toi_thieu: number
  ty_le_trai_tuyen_bh: number
  trang_thai_kham: number
  so_thu_tu: number
  uu_tien_id: string
  hen_ket_qua_cls: boolean
  ma_dkbd: string
  ma_tuyen_truoc: string
  so_phieu_tuyen_truoc: string
  ma_kv: string
  ngay_du5_nam: string
  bs_gioi_thieu_id: string
  user_id: string
  thu_ky_id: string
}

export interface TiepNhanResponse {
  code: number // HTTP status code
  is_succeeded: boolean // Success flag
  message: string // Response message
  data?: TiepNhanResponseData // Response data (present on success)
}
