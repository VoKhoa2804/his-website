/**
 * Clinic Feature Exports
 * Central export point for the clinic feature
 */

// UI Components
export { ClinicListPage } from './ui/ClinicListPage'
export { ClinicRegisterPage } from './ui/ClinicRegisterPage'

// Section Components
export { AdministrativeInfoSection } from './ui/sections/AdministrativeInfoSection'
export { VitalSignsSection } from './ui/sections/VitalSignsSection'
export { MedicalHistorySection } from './ui/sections/MedicalHistorySection'
export { PhysicalExamSection } from './ui/sections/PhysicalExamSection'
export { DiagnosisSection } from './ui/sections/DiagnosisSection'
export { ExamDetailsSection } from './ui/sections/ExamDetailsSection'
export { LabSummarySection } from './ui/sections/LabSummarySection'

// Helper Components
export { SectionTitle } from './ui/components/SectionTitle'
export { InlineField } from './ui/components/InlineField'
export { FieldRow } from './ui/components/FieldRow'
export { LongTextField } from './ui/components/LongTextField'
export { VitalSignField } from './ui/components/VitalSignField'
export { DiagnosisPill } from './ui/components/DiagnosisPill'
export { PatientInfoCard } from './ui/components/PatientInfoCard'
export { DepartmentTags } from './ui/components/DepartmentTags'
export { VisitHistoryList } from './ui/components/VisitHistoryList'

// Hooks
export { useClinics } from './hooks/useClinics'

// Types
export type {
  Clinic,
  ClinicFilter,
  ClinicPagingResult,
  CreateClinicPayload,
  UpdateClinicPayload,
  ClinicState,
} from './model/clinicTypes'

// Redux
export {
  fetchClinicsThunk,
  fetchClinicByIdThunk,
  createClinicThunk,
  updateClinicThunk,
  deleteClinicThunk,
  setSearch,
  setPageIndex,
  setPageSize,
  selectClinic,
  clearError,
  resetFilters,
} from './model/clinicSlice'
export { default as clinicReducer } from './model/clinicSlice'

// Shortcuts
export { clinicShortcuts } from './config/shortcuts'
