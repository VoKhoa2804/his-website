import { createContext, useState, ReactNode } from "react"
import type { TiepNhanRequest } from "../model/tiepNhanTypes"

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
  }
}

interface TiepNhanFormContextType {
  formData: TiepNhanFormData
  updateDangKyKham: (data: Partial<TiepNhanFormData['dangKyKham']>) => void
  updateTiepNhanBenhNhan: (data: Partial<TiepNhanFormData['tiepNhanBenhNhan']>) => void
  updateTheBaoHiem: (data: Partial<TiepNhanFormData['theBaoHiem']>) => void
  resetForm: () => void
  getApiRequest: () => TiepNhanRequest
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
  }
}

const TiepNhanFormContext = createContext<TiepNhanFormContextType | undefined>(undefined)

export { TiepNhanFormContext }

export function TiepNhanFormProvider({ children }: { children: ReactNode }) {
  const [formData, setFormData] = useState<TiepNhanFormData>(defaultFormData)

  const updateDangKyKham = (data: Partial<TiepNhanFormData['dangKyKham']>) => {
    setFormData(prev => ({
      ...prev,
      dangKyKham: { ...prev.dangKyKham, ...data }
    }))
  }

  const updateTiepNhanBenhNhan = (data: Partial<TiepNhanFormData['tiepNhanBenhNhan']>) => {
    setFormData(prev => ({
      ...prev,
      tiepNhanBenhNhan: { ...prev.tiepNhanBenhNhan, ...data }
    }))
  }

  const updateTheBaoHiem = (data: Partial<TiepNhanFormData['theBaoHiem']>) => {
    setFormData(prev => ({
      ...prev,
      theBaoHiem: { ...prev.theBaoHiem, ...data }
    }))
  }

  const resetForm = () => {
    setFormData(defaultFormData)
  }

  const getApiRequest = (): TiepNhanRequest => {
    const { dangKyKham, tiepNhanBenhNhan, theBaoHiem } = formData
    
    // Split full name into ho_lot and ten
    const nameParts = tiepNhanBenhNhan.fullName.trim().split(' ')
    const ten = nameParts.length > 0 ? nameParts[nameParts.length - 1] : ''
    const ho_lot = nameParts.length > 1 ? nameParts.slice(0, -1).join(' ') : ''

    return {
      id: dangKyKham.emrCode || null,
      benh_nhan: {
        id: dangKyKham.patientCode,
        ho_lot: ho_lot,
        ten: ten,
        ho_ten: tiepNhanBenhNhan.fullName,
        phai: tiepNhanBenhNhan.gender === "Nam" ? 1 : 0,
        ngay_sinh: tiepNhanBenhNhan.dateOfBirth || undefined,
        dien_thoai: tiepNhanBenhNhan.phoneNumber,
        cccd: tiepNhanBenhNhan.idNumber,
        ngay_cap_cccd: tiepNhanBenhNhan.issueDate || undefined,
        dia_chi: `${tiepNhanBenhNhan.houseNumber} ${tiepNhanBenhNhan.ward}`.trim(),
        so_nha: tiepNhanBenhNhan.houseNumber,
        phuong_xa_id: tiepNhanBenhNhan.ward,
        nghe_nghiep_id: tiepNhanBenhNhan.occupation,
        dan_toc_id: tiepNhanBenhNhan.ethnicityCode || undefined,
        quoc_tich_id: tiepNhanBenhNhan.nationalityCode || undefined,
      },
      the_bao_hiem: {
        benh_nhan_id: dangKyKham.patientCode,
        ngay: new Date().toISOString(),
        ma_the: theBaoHiem.insuranceNumber,
        ma_quyen_loi: theBaoHiem.benefitLevel || "0",
        muc_huong_bh: parseInt(theBaoHiem.benefitLevel) || 0,
        gt_the_tu: theBaoHiem.insuranceFrom || undefined,
        gt_the_den: theBaoHiem.insuranceTo || undefined,
        ma_dkbd: theBaoHiem.registrationPlace,
        ten_dkbd: theBaoHiem.registrationPlace,
        ma_tuyen_truoc: theBaoHiem.referralPlace,
        ten_tuyen_truoc: theBaoHiem.tenNoiChuyenTuyen,
        so_phieu_tuyen_truoc: theBaoHiem.transferNumber,
        dia_chi: theBaoHiem.addressOnCard,
        ma_kv: theBaoHiem.maKV,
        ngay_du5_nam: theBaoHiem.ngayDu5Nam || undefined,
        ghi_chu: theBaoHiem.diagnosisText,
      },
      ngay_kham: new Date().toISOString(),
      phong_ban_id: dangKyKham.department || "NTQ",
      doi_tuong_id: theBaoHiem.insuranceNumber ? "BH" : "VP",
      loai_kcb_id: dangKyKham.visitType || "01",
      trang_thai_kham: 1,
      so_thu_tu: 0,
      uu_tien_id: "1",
      bs_gioi_thieu_id: dangKyKham.referrer || "TD",
      ma_the: theBaoHiem.insuranceNumber,
      ma_quyen_loi: theBaoHiem.benefitLevel,
      muc_huong_bh: parseInt(theBaoHiem.benefitLevel) || undefined,
      the_tu_ngay: theBaoHiem.insuranceFrom || undefined,
      the_den_ngay: theBaoHiem.insuranceTo || undefined,
      ma_dkbd: theBaoHiem.registrationPlace,
      ma_tuyen_truoc: theBaoHiem.referralPlace,
      so_phieu_tuyen_truoc: theBaoHiem.transferNumber,
      ma_kv: theBaoHiem.maKV,
      ngay_du5_nam: theBaoHiem.ngayDu5Nam || undefined,
    }
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
      }}
    >
      {children}
    </TiepNhanFormContext.Provider>
  )
}
