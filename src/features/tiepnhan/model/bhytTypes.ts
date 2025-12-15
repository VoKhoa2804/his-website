export type PaymentType = "BHYT" | "THU_PHI" | "MIEN_PHI_KHAC"

export type BhytStatus = "VALID" | "INVALID" | "EXPIRED" | "UNKNOWN"

export interface BhytInfo {
  maThe: string
  mucHuong?: string
  maKV?: string
  diaChiThe?: string
  tuNgay?: string
  denNgay?: string
  ngayDu5Nam?: string
  ngayMienCct?: string
  noiDangKyKcb?: string
  soGiayChuyenTuyen?: string
  maIcdChanDoan?: string
  chanDoan?: string
  status: BhytStatus
  statusMessage?: string
}
