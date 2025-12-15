import { useState, useCallback } from 'react'
import type { Occupation } from '../model/occupationTypes'

/**
 * Hook for managing occupation data
 * TODO: Replace with Redux integration when API is available
 */
export const useOccupations = () => {
  // Mock data - replace with Redux selector when API is ready
  const [items] = useState<Occupation[]>([
    { id: '00000', ma: '00000', ten: 'Không nghề nghiệp' },
    { id: 'NVVP', ma: 'NVVP', ten: 'Nhân viên văn phòng' },
    { id: 'HS', ma: 'HS', ten: 'Học sinh' },
    { id: 'SV', ma: 'SV', ten: 'Sinh viên' },
    { id: 'GVCN', ma: 'GVCN', ten: 'Giáo viên chủ nhiệm' },
    { id: 'BS', ma: 'BS', ten: 'Bác sĩ' },
    { id: 'DD', ma: 'DD', ten: 'Y tá/Điều dưỡng' },
    { id: 'KTV', ma: 'KTV', ten: 'Kỹ thuật viên' },
    { id: 'KS', ma: 'KS', ten: 'Kỹ sư' },
    { id: 'LS', ma: 'LS', ten: 'Luật sư' },
    { id: 'NVBH', ma: 'NVBH', ten: 'Nhân viên bán hàng' },
    { id: 'LD', ma: 'LD', ten: 'Lao động phổ thông' },
    { id: 'NT', ma: 'NT', ten: 'Nông dân' },
    { id: 'CNVC', ma: 'CNVC', ten: 'Công nhân viên chức' },
    { id: 'HD', ma: 'HD', ten: 'Hưu trí' },
  ])
  const [loading] = useState(false)

  const loadOccupations = useCallback(() => {
    // TODO: Dispatch Redux action to load from API
    console.log('Loading occupations...')
  }, [])

  return {
    items,
    loading,
    loadOccupations,
  }
}
