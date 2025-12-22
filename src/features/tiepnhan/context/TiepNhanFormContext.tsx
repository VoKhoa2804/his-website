import { createContext, useState, ReactNode } from "react"
import { store } from "@/app/store"
import type { HanhChinhOption } from "@/features/hanhchinh/model/hanhchinhSlice"
import type { PhongKhamInfo, TiepNhanRequest } from "../model/tiepNhanTypes"
import type { ValidateContext, ValidationResult, FieldErrorMap } from "../model/tiepnhan.validation"
import { validateTiepNhanForm } from "../model/tiepnhan.validation"

// Form data interface matching the structure of child components
export interface TiepNhanFormData {
  // From DangKyKham
  dangKyKham: {
    receptionCode: string
    patientCode: string
    emrCode: string
    visitReason: string
    visitType: string
    patientType: string
    department: string
    room: string
    uuTien: string
    priorityLevel: string
    referrer: string
  }
  
  // From TiepNhanBenhNhan
  tiepNhanBenhNhan: {
    phoneNumber: string
    fullName: string
    dateOfBirth: string
    age: string
    gender: string
    occupation: string
    ethnicity: string
    ethnicityCode: string
    nationality: string
    nationalityCode: string
    houseNumber: string
    ward: string
    tinhThanh: string
    quanHuyen: string
    phuongXa: string
    idType: string
    idNumber: string
    issueDate: string
    issuePlace: string
    contactPhoneNumber: string
    contactFullName: string
    relationship: string
  }
  
  // From TheBaoHiemYTe
  theBaoHiem: {
    insuranceNumber: string
    benefitLevel: string
    insuranceFrom: string
    insuranceTo: string
    registrationPlace: string
    referralPlace: string
    transferNumber: string
    icdDiagnosis: string
    diagnosisText: string
    poorHousehold: boolean
    poorHouseholdNumber: string
    hasAppointment: boolean
    appointmentDate: string
    appointmentTime: string
    addressOnCard: string
    maKV: string
    ngayDu5Nam: string
    ngayMienCCT: string
    tenNoiChuyenTuyen: string
    soGiayChuyenTuyen: string
    chanDoan: string
    maIcdChanDoan: string
  }
}

const normalizeGenderToCode = (value: string | number | null | undefined): 0 | 1 => {
  if (typeof value === "number") {
    if (value === 1) return 1
    return 0
  }

  const normalized = (value ?? "").trim().toLowerCase()
  if (!normalized) return 0

  if (["nam", "male", "m", "1"].includes(normalized)) return 1
  if (["nữ", "nu", "female", "f", "0", "2"].includes(normalized)) return 0

  const parsed = Number(normalized)
  if (!Number.isNaN(parsed)) {
    if (parsed === 1) return 1
    if (parsed === 0) return 0
    if (parsed === 2) return 0
  }

  return 0
}

const PHONG_BAN_KEY = "PhongBan"

const toOptionalString = (value: unknown): string | undefined => {
  if (value === undefined || value === null) return undefined
  const str = String(value).trim()
  return str ? str : undefined
}

const toOptionalNumber = (value: unknown): number | undefined => {
  if (value === undefined || value === null || value === "") return undefined
  const num = typeof value === "number" ? value : Number(value)
  return Number.isFinite(num) ? num : undefined
}

const toOptionalBoolean = (value: unknown): boolean | undefined => {
  if (value === undefined || value === null) return undefined
  if (typeof value === "boolean") return value
  const normalized = String(value).trim().toLowerCase()
  if (["1", "true", "yes"].includes(normalized)) return true
  if (["0", "false", "no"].includes(normalized)) return false
  return undefined
}

const pickMetaValue = (meta: Record<string, any> | undefined, keys: string[]): unknown => {
  if (!meta) return undefined
  for (const key of keys) {
    if (meta[key] !== undefined && meta[key] !== null && meta[key] !== "") {
      return meta[key]
    }
  }
  return undefined
}

const findPhongBanOption = (code: string): HanhChinhOption | undefined => {
  if (!code) return undefined
  const state = store.getState()
  const options = state.hanhchinh?.optionsByKey?.[PHONG_BAN_KEY] ?? []
  return options.find((option) => option.ma === code || option.id === code)
}

const buildPhongKhamInfo = (roomValue: string): PhongKhamInfo | undefined => {
  if (!roomValue) return undefined
  const option = findPhongBanOption(roomValue)

  if (!option) {
    return {
      id: roomValue,
      ma: roomValue,
      ten: roomValue,
    }
  }

  const meta = option.meta ?? {}

  const info: PhongKhamInfo = {
    id: toOptionalString(pickMetaValue(meta, ["Id", "ID", "PhongBanId", "PhongKhamId"])) ?? option.id ?? roomValue,
    ma: toOptionalString(pickMetaValue(meta, ["Ma", "MA", "PhongBanMa", "PhongKhamMa"])) ?? option.ma ?? option.id ?? roomValue,
    ten:
      toOptionalString(pickMetaValue(meta, ["Ten", "TEN", "PhongBanTen", "PhongKhamTen"])) ??
      option.ten ??
      option.ma ??
      roomValue,
    vp_loai_thu_id: toOptionalString(pickMetaValue(meta, ["VpLoaiThuId", "VP_LoaiThuId", "vp_loai_thu_id"])),
    ten_loai_thu: toOptionalString(pickMetaValue(meta, ["TenLoaiThu", "ten_loai_thu", "Ten_Loai_Thu"])),
    don_vi: toOptionalString(pickMetaValue(meta, ["DonVi", "don_vi"])),
    vp_nhom_id: toOptionalString(pickMetaValue(meta, ["VpNhomId", "vp_nhom_id", "VP_NhomId"])),
    don_gia: toOptionalNumber(pickMetaValue(meta, ["DonGia", "don_gia", "Gia", "GiaDichVu"])),
    don_gia_bhyt: toOptionalNumber(pickMetaValue(meta, ["DonGiaBHYT", "don_gia_bhyt", "GiaBHYT"])),
    don_gia_dv: toOptionalNumber(pickMetaValue(meta, ["DonGiaDV", "don_gia_dv", "GiaDV"])),
    tyle_bhtt: toOptionalNumber(pickMetaValue(meta, ["TyleBhtt", "TyLeBhtt", "tyle_bhtt"])),
    chenh_lech: toOptionalBoolean(pickMetaValue(meta, ["ChenhLech", "chenh_lech"])),
    hien_thi: toOptionalBoolean(pickMetaValue(meta, ["HienThi", "hien_thi"])),
  }

  return info
}

interface TiepNhanFormContextType {
  formData: TiepNhanFormData
  updateDangKyKham: (data: Partial<TiepNhanFormData['dangKyKham']>) => void
  updateTiepNhanBenhNhan: (data: Partial<TiepNhanFormData['tiepNhanBenhNhan']>) => void
  updateTheBaoHiem: (data: Partial<TiepNhanFormData['theBaoHiem']>) => void
  resetForm: () => void
  getApiRequest: () => TiepNhanRequest
  fieldErrors: FieldErrorMap
  setFieldErrors: (errors: FieldErrorMap) => void
  clearFieldErrors: (paths: string[]) => void
  validateAll: (context?: ValidateContext) => ValidationResult
}

const defaultFormData: TiepNhanFormData = {
  dangKyKham: {
    receptionCode: "",
    patientCode: "",
    emrCode: "",
    visitReason: "",
    visitType: "",
    patientType: "thu-phi",
    department: "",
    room: "",
    uuTien: "",
    priorityLevel: "",
    referrer: "",
  },
  tiepNhanBenhNhan: {
    phoneNumber: "",
    fullName: "",
    dateOfBirth: "",
    age: "",
    gender: "",
    occupation: "",
    ethnicity: "Kinh",
    ethnicityCode: "01",
    nationality: "Việt Nam",
    nationalityCode: "000",
    houseNumber: "",
    ward: "",
    tinhThanh: "",
    quanHuyen: "",
    phuongXa: "",
    idType: "CCCD",
    idNumber: "",
    issueDate: "",
    issuePlace: "",
    contactPhoneNumber: "",
    contactFullName: "",
    relationship: "",
  },
  theBaoHiem: {
    insuranceNumber: "",
    benefitLevel: "",
    insuranceFrom: "",
    insuranceTo: "",
    registrationPlace: "",
    referralPlace: "",
    transferNumber: "",
    icdDiagnosis: "",
    diagnosisText: "",
    poorHousehold: false,
    poorHouseholdNumber: "",
    hasAppointment: false,
    appointmentDate: "",
    appointmentTime: "",
    addressOnCard: "",
    maKV: "",
    ngayDu5Nam: "",
    ngayMienCCT: "",
    tenNoiChuyenTuyen: "",
    soGiayChuyenTuyen: "",
    chanDoan: "",
    maIcdChanDoan: "",
  }
}

const TiepNhanFormContext = createContext<TiepNhanFormContextType | undefined>(undefined)

export { TiepNhanFormContext }

export function TiepNhanFormProvider({ children }: { children: ReactNode }) {
  const [formData, setFormData] = useState<TiepNhanFormData>(defaultFormData)
  const [fieldErrors, setFieldErrors] = useState<FieldErrorMap>({})

  const clearFieldErrors = (paths: string[]) => {
    if (!paths.length) return
    setFieldErrors((prev) => {
      const next = { ...prev }
      for (const path of paths) {
        delete next[path]
      }
      return next
    })
  }

  const buildPaths = <T extends keyof TiepNhanFormData>(scope: T, data: Partial<TiepNhanFormData[T]>) =>
    Object.keys(data).map((key) => `${scope}.${key}`)

  const updateDangKyKham = (data: Partial<TiepNhanFormData['dangKyKham']>) => {
    setFormData(prev => ({
      ...prev,
      dangKyKham: { ...prev.dangKyKham, ...data }
    }))
    clearFieldErrors(buildPaths("dangKyKham", data))
  }

  const updateTiepNhanBenhNhan = (data: Partial<TiepNhanFormData['tiepNhanBenhNhan']>) => {
    setFormData(prev => ({
      ...prev,
      tiepNhanBenhNhan: { ...prev.tiepNhanBenhNhan, ...data }
    }))
    clearFieldErrors(buildPaths("tiepNhanBenhNhan", data))
  }

  const updateTheBaoHiem = (data: Partial<TiepNhanFormData['theBaoHiem']>) => {
    setFormData(prev => ({
      ...prev,
      theBaoHiem: { ...prev.theBaoHiem, ...data }
    }))
    clearFieldErrors(buildPaths("theBaoHiem", data))
  }

  const resetForm = () => {
    setFormData(defaultFormData)
    setFieldErrors({})
  }

  const getApiRequest = (): TiepNhanRequest => {
    const { dangKyKham, tiepNhanBenhNhan, theBaoHiem } = formData
    const nameParts = tiepNhanBenhNhan.fullName.trim().split(" ")
    const ten = nameParts.length > 0 ? nameParts[nameParts.length - 1] : ""
    const ho_lot = nameParts.length > 1 ? nameParts.slice(0, -1).join(" ") : ""
    const wardId = tiepNhanBenhNhan.phuongXa || tiepNhanBenhNhan.ward || undefined
    const quanHuyenId = tiepNhanBenhNhan.quanHuyen || undefined
    const tinhThanhId = tiepNhanBenhNhan.tinhThanh || undefined
    const nowIso = new Date().toISOString()

    const benhNhan: TiepNhanRequest["benh_nhan"] = {
      ho_lot,
      ten,
      ho_ten: tiepNhanBenhNhan.fullName,
      phai: normalizeGenderToCode(tiepNhanBenhNhan.gender),
      ngay_sinh: tiepNhanBenhNhan.dateOfBirth || undefined,
      dien_thoai: tiepNhanBenhNhan.phoneNumber || undefined,
      so_nha: tiepNhanBenhNhan.houseNumber || undefined,
      dia_chi: `${tiepNhanBenhNhan.houseNumber} ${tiepNhanBenhNhan.phuongXa || tiepNhanBenhNhan.ward}`.trim() || undefined,
      phuong_xa_id: wardId,
      quan_huyen_id: quanHuyenId,
      tinh_thanh_id: tinhThanhId,
      nghe_nghiep_id: tiepNhanBenhNhan.occupation || undefined,
      dan_toc_id: tiepNhanBenhNhan.ethnicityCode || undefined,
      quoc_tich_id: tiepNhanBenhNhan.nationalityCode || undefined,
      cccd: tiepNhanBenhNhan.idNumber || undefined,
      ngay_cap_cccd: tiepNhanBenhNhan.issueDate || undefined,
      noi_cap_cccd: tiepNhanBenhNhan.issuePlace || undefined,
      moi_quan_he_id: tiepNhanBenhNhan.relationship || undefined,
      ho_ten_nguoi_than: tiepNhanBenhNhan.contactFullName || undefined,
      dien_thoai_nguoi_than: tiepNhanBenhNhan.contactPhoneNumber || undefined,
    }

    const phongKhamInfo = buildPhongKhamInfo(dangKyKham.room)

    const dangKy: TiepNhanRequest["dang_ky_kham"] = {
      ma_ho_so: dangKyKham.receptionCode || undefined,
      ma_benh_nhan: dangKyKham.patientCode || undefined,
      ma_emr: dangKyKham.emrCode || undefined,
      ly_do_kham: dangKyKham.visitReason,
      ngay_kham: nowIso,
      loai_kcb_id: dangKyKham.visitType,
      doi_tuong_kcb_id: dangKyKham.department,
      uu_tien_id: dangKyKham.uuTien || dangKyKham.priorityLevel || undefined,
      bs_gioi_thieu_id: dangKyKham.referrer || undefined,
      phong_kham: phongKhamInfo,
      chan_doan_so_bo: theBaoHiem.chanDoan || theBaoHiem.diagnosisText || undefined,
      ghi_chu: theBaoHiem.icdDiagnosis || undefined,
    }

    const benefitPercentage = Number.parseInt(theBaoHiem.benefitLevel, 10)
    const theBhyt: TiepNhanRequest["the_bhyt"] = {
      ma_the: theBaoHiem.insuranceNumber,
      ma_quyen_loi: theBaoHiem.benefitLevel || undefined,
      muc_huong_bh: Number.isNaN(benefitPercentage) ? undefined : benefitPercentage,
      ma_kv: theBaoHiem.maKV || undefined,
      ma_dkbd: theBaoHiem.registrationPlace || undefined,
      dia_chi_the: theBaoHiem.addressOnCard || undefined,
      gt_the_tu: theBaoHiem.insuranceFrom || undefined,
      gt_the_den: theBaoHiem.insuranceTo || undefined,
      ngay_du5_nam: theBaoHiem.ngayDu5Nam || undefined,
      ngay_mien_cct: theBaoHiem.ngayMienCCT || undefined,
      noi_dang_ky: theBaoHiem.registrationPlace || undefined,
      tuyen_truoc_id: theBaoHiem.referralPlace || undefined,
      ten_tuyen_truoc: theBaoHiem.tenNoiChuyenTuyen || undefined,
      so_phieu_tuyen_truoc: theBaoHiem.soGiayChuyenTuyen || theBaoHiem.transferNumber || undefined,
      chan_doan_tuyen_truoc: theBaoHiem.chanDoan || undefined,
      icd_tuyen_truoc: theBaoHiem.maIcdChanDoan || undefined,
      chan_doan: theBaoHiem.diagnosisText || undefined,
      ma_icd_chan_doan: theBaoHiem.maIcdChanDoan || undefined,
    }

    return {
      benh_nhan: benhNhan,
      dang_ky_kham: dangKy,
      the_bhyt: theBhyt,
    }
  }

  const validateAll = (context?: ValidateContext): ValidationResult => {
    const result = validateTiepNhanForm(formData, context)
    setFieldErrors(result.errors)
    return result
  }

  return (
    <TiepNhanFormContext.Provider
      value={{
        formData,
        updateDangKyKham,
        updateTiepNhanBenhNhan,
        updateTheBaoHiem,
        resetForm,
        getApiRequest,
        fieldErrors,
        setFieldErrors,
        clearFieldErrors,
        validateAll,
      }}
    >
      {children}
    </TiepNhanFormContext.Provider>
  )
}
