# Clinic Register / Examination Screen — UI Specification
**Generated from:** `design/feature/clinic/register-clinic-*.jpg`  
**Date:** December 10, 2025  
**Purpose:** Golden UI specification for implementation

---

## Overview

This is a **digital medical examination sheet** following Vietnamese hospital information system (HIS) design patterns. The UI resembles a traditional paper medical form with:
- Dense information layout
- Dotted underline fields (EMR style)
- Multiple numbered sections (Roman numerals I-VII)
- Left sidebar for patient context
- Right panel for examination data entry

---

## 1. HIGH-LEVEL LAYOUT

### Grid Structure

```
┌──────────────────────────────────────────────────────────────┐
│ HEADER BAR (blue/gradient, ~56px height)                     │
│ [Search] [Patient Name] [Status Badge]            [Actions] │
└──────────────────────────────────────────────────────────────┘
┌─────────────┬───────────────────────────────────────────────┐
│             │                                                │
│ LEFT PANEL  │          RIGHT PANEL                          │
│ (~320px)    │          (flex-1, fills remaining)            │
│             │                                                │
│ • Patient   │  ┌──────────────────────────────────────────┐ │
│   Info Card │  │ I. HÀNH CHÍNH                           │ │
│             │  └──────────────────────────────────────────┘ │
│ • Financial │  ┌──────────────────────────────────────────┐ │
│   Summary   │  │ II. SINH HIỆU                           │ │
│             │  └──────────────────────────────────────────┘ │
│ • Visit     │  ┌──────────────────────────────────────────┐ │
│   History   │  │ III. HỎI BỆNH                           │ │
│             │  └──────────────────────────────────────────┘ │
│ • Department│  ┌──────────────────────────────────────────┐ │
│   Tags      │  │ IV. KHÁM XÉT                            │ │
│             │  └──────────────────────────────────────────┘ │
│             │  ┌──────────────────────────────────────────┐ │
│             │  │ V. CHẨN ĐOÁN                            │ │
│             │  └──────────────────────────────────────────┘ │
│             │  ┌──────────────────────────────────────────┐ │
│             │  │ VI. THÔNG TIN KHÁM BỆNH                 │ │
│             │  └──────────────────────────────────────────┘ │
│             │  ┌──────────────────────────────────────────┐ │
│             │  │ VII. TÓM TẮT KẾT QUẢ CLS               │ │
│             │  └──────────────────────────────────────────┘ │
│ (sticky)    │  (scrollable)                                │
└─────────────┴───────────────────────────────────────────────┘
```

### Proportions
- **Header:** Full width, fixed height ~56px
- **Left Panel:** Fixed width 320px, sticky/fixed position
- **Right Panel:** flex-1 (fills remaining space), scrollable
- **Overall:** Desktop minimum width 1280px recommended

### Colors & Borders
- **Header:** Blue gradient background (#3B82F6 to #1E40AF)
- **Left Panel:** White background, border-r border-gray-200
- **Right Panel:** Light gray background (#F9FAFB)
- **Section Cards:** White background, border border-gray-200, rounded-md shadow-sm
- **Dotted Fields:** border-b border-dotted border-gray-300

### Scroll Behavior
- Header: Fixed at top
- Left Panel: Sticky, scrolls independently if content overflows
- Right Panel: Main scrollable area (overflow-y-auto)

---

## 2. RIGHT PANEL SECTIONS

### Section I: HÀNH CHÍNH (Administrative Information)

**Title:** `I. HÀNH CHÍNH`  
**Layout:** Multiple rows with inline fields

**Fields:**
```
Row 1: [Họ và tên*______________________] [Ngày sinh*________] [Tuổi____]
Row 2: [Giới tính*_____] [Dân tộc_____] [Quốc tịch_____]
Row 3: [Nghề nghiệp___________________] [Nơi làm việc______________]
Row 4: [CMND/CCCD*________________] [Ngày cấp________] [Nơi cấp_______]
Row 5: [Địa chỉ thường trú*_________________________________________]
Row 6: [Tỉnh/TP*__________] [Quận/Huyện*__________] [Xã/Phường*______]
Row 7: [Điện thoại*__________] [Email_____________________]
Row 8: [Người liên hệ___________] [SĐT người liên hệ__________]
```

**Styling:**
- Each field: `border-b border-dotted border-gray-300 bg-transparent px-2 py-1 text-[11px]`
- Label: `text-[11px] text-gray-700 mr-2`
- Required marker (*): `text-red-500 text-xs`
- Inline layout: `flex items-center gap-4`

**Component Pattern:**
- `InlineField` for label + input pairs
- `FieldRow` for grouping multiple inline fields
- Fields with dotted underlines instead of borders

---

### Section II: SINH HIỆU (Vital Signs)

**Title:** `II. SINH HIỆU`  
**Layout:** Grid of vital sign measurements

**Fields:**
```
┌─────────────────┬─────────────────┬─────────────────┐
│ Nhiệt độ: ___°C │ Mạch: ___l/ph  │ HA: ___/___mmHg│
├─────────────────┼─────────────────┼─────────────────┤
│ Nhịp thở: ___l/ph│Cân nặng: ___kg │Chiều cao: ___cm│
├─────────────────┴─────────────────┴─────────────────┤
│ SpO₂: ___%       BMI: ___         Vòng bụng: ___cm│
└────────────────────────────────────────────────────┘
```

**Styling:**
- 3-column grid: `grid grid-cols-3 gap-4`
- Each cell: `flex items-center`
- Input fields: `w-16 border-b border-dotted text-[11px]`
- Units: `text-[10px] text-gray-500 ml-1`

**Component Pattern:**
- `VitalSignField` component for each measurement
- Compact grid layout with units displayed inline

---

### Section III: HỎI BỆNH (Medical History / Chief Complaint)

**Title:** `III. HỎI BỆNH`  
**Layout:** Full-width text areas with labels

**Fields:**
```
Lý do khám: ________________________________________________
__________________________________________________________

Bệnh sử: __________________________________________________
__________________________________________________________
__________________________________________________________

Tiền sử bệnh: _____________________________________________
__________________________________________________________

Tiền sử gia đình: _________________________________________
__________________________________________________________

Dị ứng: ___________________________________________________
```

**Styling:**
- Labels: `text-[11px] font-medium text-gray-700 mb-2 block`
- Text areas: `w-full min-h-[60px] border-b border-dotted resize-none text-[11px] p-2`
- Each field group: `mb-4 space-y-1`

**Component Pattern:**
- `LongTextField` for multi-line inputs
- Vertical stacking with consistent spacing

---

### Section IV: KHÁM XÉT (Physical Examination)

**Title:** `IV. KHÁM XÉT`  
**Layout:** Structured examination findings by system

**Fields:**
```
Toàn thân: ________________________________________________
__________________________________________________________

Tuần hoàn: ________________________________________________
__________________________________________________________

Hô hấp: ___________________________________________________
__________________________________________________________

Tiêu hóa: _________________________________________________
__________________________________________________________

Thận - Tiết niệu: _________________________________________
__________________________________________________________

Thần kinh: ________________________________________________
__________________________________________________________

Cơ - Xương - Khớp: ________________________________________
__________________________________________________________

Tai - Mũi - Họng: _________________________________________
__________________________________________________________

Răng - Hàm - Mặt: _________________________________________
__________________________________________________________

Mắt: ______________________________________________________
__________________________________________________________

Khác: _____________________________________________________
__________________________________________________________
```

**Styling:**
- Same as Section III
- System-by-system layout
- Full-width text areas with dotted underlines

**Component Pattern:**
- Reuse `LongTextField` component
- Each system as a separate field group

---

### Section V: CHẨN ĐOÁN (Diagnosis)

**Title:** `V. CHẨN ĐOÁN`  
**Layout:** Diagnosis codes with tag-like pills

**Fields:**
```
Chẩn đoán sơ bộ*: _________________________________________
ICD-10: [____] [+ Add]

Chẩn đoán xác định*: ______________________________________
ICD-10: [____] [+ Add]

Chẩn đoán kèm theo:
┌────────────────┬────────────────┬────────────────┐
│ [A09 - Tiêu chảy] × │ [J06 - VĐTHN] × │              │
└────────────────┴────────────────┴────────────────┘
```

**Styling:**
- Diagnosis pills: `inline-flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-200 rounded-full text-[11px]`
- Remove button (×): `text-blue-600 hover:text-blue-800 cursor-pointer`
- Add button: `text-blue-600 border-blue-300 hover:bg-blue-50`
- ICD input: `w-24 border-b border-dotted text-[11px]`

**Component Pattern:**
- `DiagnosisPill` component for tag display
- `ICD10Selector` for code input
- Flex wrap layout for multiple diagnoses

---

### Section VI: THÔNG TIN KHÁM BỆNH (Examination Details)

**Title:** `VI. THÔNG TIN KHÁM BỆNH`  
**Layout:** Mixed inline and full-width fields

**Fields:**
```
Bác sĩ khám*: _____________________________________________

Khoa khám*: __________________  Phòng khám*: _____________

Ngày khám*: __________  Giờ khám: ______  Loại khám: ____

Ghi chú: __________________________________________________
__________________________________________________________
```

**Styling:**
- Similar to Section I for inline fields
- Mix of short inline fields and full-width notes
- Required fields marked with asterisk

**Component Pattern:**
- Combination of `InlineField` and `FieldRow`
- DateTimePicker for date/time fields

---

### Section VII: TÓM TẮT KẾT QUẢ CLS (Lab & Imaging Summary)

**Title:** `VII. TÓM TẮT KẾT QUẢ CLS`  
**Layout:** Table or list of test results

**Fields:**
```
┌──────────────────┬──────────────┬──────────┬──────────┐
│ Loại xét nghiệm  │ Kết quả      │ Đơn vị   │ Tham chiếu│
├──────────────────┼──────────────┼──────────┼──────────┤
│ Huyết học        │              │          │          │
│ Sinh hóa         │              │          │          │
│ Chẩn đoán hình ảnh│            │          │          │
└──────────────────┴──────────────┴──────────┴──────────┘

Kết luận: _________________________________________________
__________________________________________________________
```

**Styling:**
- Table: `border border-gray-200 text-[11px]`
- Headers: `bg-gray-50 font-medium`
- Cells: `border-b border-dotted p-2`

**Component Pattern:**
- `TestResultTable` component
- Rows can be added/removed dynamically
- Summary text area at bottom

---

## 3. LEFT PANEL DETAILS

### Patient Info Card

**Structure:**
```
┌───────────────────────────────────┐
│ ┌──────┐                         │
│ │Avatar│  Nguyễn Văn A            │
│ │Photo │  Nam | 45 tuổi | AB+    │
│ └──────┘                         │
│                                   │
│ MRN: 2024120001                   │
│ Mã BN: BN123456                   │
│ Ngày vào: 10/12/2025              │
│                                   │
│ ┌───────────────┬───────────────┐ │
│ │ Viện phí      │ 2,500,000đ   │ │
│ ├───────────────┼───────────────┤ │
│ │ Đã thanh toán │ 1,000,000đ   │ │
│ ├───────────────┼───────────────┤ │
│ │ Bảo hiểm      │   500,000đ   │ │
│ ├───────────────┼───────────────┤ │
│ │ Còn nợ        │ 1,000,000đ   │ │
│ └───────────────┴───────────────┘ │
└───────────────────────────────────┘
```

**Styling:**
- Card: `bg-white border border-gray-200 rounded-md shadow-sm p-4`
- Avatar: `w-16 h-16 rounded-full bg-gray-200 overflow-hidden`
- Patient name: `text-base font-semibold text-gray-900`
- Metadata: `text-xs text-gray-600`
- Financial grid: `grid grid-cols-2 gap-1 text-[11px] mt-3`
- Amount cells: `text-right font-medium`

---

### Department Tags

**Structure:**
```
┌────────────────────────────────┐
│ Các khoa đã khám:              │
│ ┌──────────────────────┐       │
│ │ Khám Ngoại lồng ngực│       │
│ │ 09:30 - 10/12/2025   │       │
│ └──────────────────────┘       │
│ ┌──────────────────────┐       │
│ │ Khám Nội tim mạch    │       │
│ │ 14:00 - 10/12/2025   │       │
│ └──────────────────────┘       │
└────────────────────────────────┘
```

**Styling:**
- Section title: `text-xs font-medium text-gray-700 mb-2`
- Tag button: `w-full text-left px-3 py-2 bg-blue-50 border border-blue-200 rounded hover:bg-blue-100 text-[11px]`
- Department name: `font-medium text-blue-900`
- Timestamp: `text-[10px] text-gray-600 mt-0.5`

---

### Visit History List

**Structure:**
```
┌────────────────────────────────┐
│ Lịch sử khám:                  │
│ ┌──────────────────────────┐   │
│ │ 08/12/2025               │   │
│ │ Khám nội tổng quát       │   │
│ │ BS: Trần Thị B           │   │
│ └──────────────────────────┘   │
│ ┌──────────────────────────┐   │
│ │ 15/11/2025               │   │
│ │ Khám sản                 │   │
│ │ BS: Lê Văn C             │   │
│ └──────────────────────────┘   │
└────────────────────────────────┘
```

**Styling:**
- Section title: `text-xs font-medium text-gray-700 mb-2`
- Visit card: `p-2 bg-gray-50 border border-gray-200 rounded mb-2 text-[10px]`
- Date: `font-medium text-gray-900`
- Details: `text-gray-600`

**Component Pattern:**
- `VisitHistoryItem` for each past visit
- Scrollable list if many visits
- Click to view details (modal/drawer)

---

## 4. TAILWIND + SHARED/UI MAPPING

### Shared Components to Use

| UI Element | Shared Component | Notes |
|------------|------------------|-------|
| Buttons | `@/shared/ui/button` | Primary, outline, ghost variants |
| Cards | `@/shared/ui/card` | For patient info, sections, visit history |
| Inputs | `@/shared/ui/input` | Base input, will need medical-input variant |
| Labels | `@/shared/ui/label` | For form field labels |
| Select | `@/shared/ui/select` | For dropdowns (department, specialty) |
| Badge | `@/shared/ui/badge` | For diagnosis tags |
| Separator | `@/shared/ui/separator` | Between sections |

### Custom Medical Input Style

Create a CSS class:
```css
.medical-input {
  @apply bg-transparent border-none border-b border-dotted border-gray-300 rounded-none px-2 py-1 text-[11px] focus:border-b-2 focus:border-solid focus:border-blue-500 focus:outline-none;
}

.medical-input:focus {
  background-color: #EFF6FF; /* blue-50 */
}
```

### Tailwind Classes by Component

**Container:**
```tsx
className="flex h-screen bg-gray-50"
```

**Header Bar:**
```tsx
className="fixed top-0 left-0 right-0 z-50 h-14 bg-gradient-to-r from-blue-600 to-blue-800 shadow-md flex items-center justify-between px-6"
```

**Left Panel:**
```tsx
className="fixed left-0 top-14 bottom-0 w-80 bg-white border-r border-gray-200 overflow-y-auto"
```

**Right Panel:**
```tsx
className="ml-80 pt-14 pb-8 px-6 overflow-y-auto"
```

**Section Card:**
```tsx
className="bg-white border border-gray-200 rounded-md shadow-sm p-6 mb-4"
```

**Section Title:**
```tsx
className="text-sm font-bold text-gray-900 uppercase border-b-2 border-gray-400 pb-2 mb-4"
```

**Dotted Field Row:**
```tsx
className="flex items-center gap-4 mb-3"
```

**Inline Field:**
```tsx
<span className="text-[11px] text-gray-700">Label:</span>
<input className="medical-input flex-1" />
```

**Diagnosis Pill:**
```tsx
className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-200 rounded-full text-[11px] text-blue-900"
```

---

## 5. COMPONENT DESIGN

### Main Component: `ClinicRegisterPage`

**Responsibility:** 
- Top-level layout orchestrator
- Manages scroll behavior
- Coordinates left and right panels

**Props:** None (gets data from Redux via hook)

**Structure:**
```
ClinicRegisterPage
├── HeaderBar
├── LeftPanel
│   ├── PatientInfoCard
│   ├── DepartmentTags
│   └── VisitHistoryList
└── RightPanel
    ├── Section I: AdministrativeInfo
    ├── Section II: VitalSigns
    ├── Section III: MedicalHistory
    ├── Section IV: PhysicalExam
    ├── Section V: Diagnosis
    ├── Section VI: ExamDetails
    └── Section VII: LabSummary
```

---

### Helper Component: `SectionTitle`

**Props:**
```typescript
{
  number: string      // e.g., "I", "II", "III"
  title: string       // e.g., "HÀNH CHÍNH"
}
```

**Layout:**
```tsx
<div className="flex items-center gap-2 border-b-2 border-gray-400 pb-2 mb-4">
  <span className="text-sm font-bold text-gray-900">{number}.</span>
  <h3 className="text-sm font-bold text-gray-900 uppercase">{title}</h3>
</div>
```

---

### Helper Component: `InlineField`

**Props:**
```typescript
{
  label: string
  placeholder?: string
  required?: boolean
  width?: string       // Tailwind width class
  value?: string
  onChange?: (value: string) => void
}
```

**Layout:**
```tsx
<div className="flex items-center gap-2">
  <span className="text-[11px] text-gray-700 whitespace-nowrap">
    {label}
    {required && <span className="text-red-500 ml-0.5">*</span>}:
  </span>
  <input 
    className={`medical-input ${width || 'flex-1'}`}
    placeholder={placeholder}
    value={value}
    onChange={(e) => onChange?.(e.target.value)}
  />
</div>
```

---

### Helper Component: `FieldRow`

**Props:**
```typescript
{
  children: React.ReactNode
  gap?: string         // Tailwind gap class
}
```

**Layout:**
```tsx
<div className={`flex items-center ${gap || 'gap-4'} mb-3`}>
  {children}
</div>
```

**Usage:**
```tsx
<FieldRow>
  <InlineField label="Họ và tên" required width="flex-1" />
  <InlineField label="Ngày sinh" required width="w-32" />
  <InlineField label="Tuổi" width="w-16" />
</FieldRow>
```

---

### Helper Component: `LongTextField`

**Props:**
```typescript
{
  label: string
  placeholder?: string
  required?: boolean
  rows?: number
  value?: string
  onChange?: (value: string) => void
}
```

**Layout:**
```tsx
<div className="mb-4">
  <label className="block text-[11px] font-medium text-gray-700 mb-2">
    {label}
    {required && <span className="text-red-500 ml-0.5">*</span>}:
  </label>
  <textarea
    className="w-full medical-input min-h-[60px] resize-none p-2"
    rows={rows || 3}
    placeholder={placeholder}
    value={value}
    onChange={(e) => onChange?.(e.target.value)}
  />
</div>
```

---

### Helper Component: `VitalSignField`

**Props:**
```typescript
{
  label: string
  value?: string
  unit: string
  onChange?: (value: string) => void
}
```

**Layout:**
```tsx
<div className="flex items-center gap-2">
  <span className="text-[11px] text-gray-700">{label}:</span>
  <input 
    className="medical-input w-16 text-center"
    value={value}
    onChange={(e) => onChange?.(e.target.value)}
  />
  <span className="text-[10px] text-gray-500">{unit}</span>
</div>
```

---

### Helper Component: `DiagnosisPill`

**Props:**
```typescript
{
  code: string        // ICD-10 code
  name: string        // Diagnosis name
  onRemove?: () => void
}
```

**Layout:**
```tsx
<div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-200 rounded-full text-[11px] text-blue-900 mr-2 mb-2">
  <span className="font-medium">{code}</span>
  <span>-</span>
  <span>{name}</span>
  {onRemove && (
    <button 
      onClick={onRemove}
      className="text-blue-600 hover:text-blue-800 ml-1"
    >
      ×
    </button>
  )}
</div>
```

---

## 6. TYPOGRAPHY STANDARDS

| Element | Font Size | Weight | Color |
|---------|-----------|--------|-------|
| Section Titles | text-sm (14px) | font-bold | text-gray-900 |
| Field Labels | text-[11px] | normal | text-gray-700 |
| Input Values | text-[11px] | normal | text-gray-900 |
| Units | text-[10px] | normal | text-gray-500 |
| Patient Name | text-base (16px) | font-semibold | text-gray-900 |
| Metadata | text-xs (12px) | normal | text-gray-600 |
| Diagnosis Pills | text-[11px] | normal | text-blue-900 |

---

## 7. SPACING & DENSITY

- **Section Spacing:** `mb-4` (16px between sections)
- **Field Spacing:** `mb-3` (12px between field rows)
- **Inline Gap:** `gap-4` (16px between inline fields)
- **Section Padding:** `p-6` (24px inside section cards)
- **Card Padding:** `p-4` (16px for smaller cards)

**Key Principle:** This is a dense EMR interface. Prioritize information density over whitespace.

---

## 8. RESPONSIVE BEHAVIOR

**Desktop (>= 1280px):**
- Standard layout as described
- Left panel 320px fixed width
- Right panel fills remaining space

**Tablet (768px - 1279px):**
- Left panel collapses to drawer/modal
- Hamburger menu to toggle patient info
- Right panel takes full width

**Mobile (< 768px):**
- Single column layout
- Patient info in expandable header
- Sections stack vertically
- Inline fields may wrap to vertical on very small screens

---

## 9. INTERACTIVE BEHAVIORS

### Dotted Input Fields
- **Default:** Border-bottom dotted, transparent background
- **Focus:** Border-bottom solid blue, light blue background
- **Disabled:** Gray background, reduced opacity

### Diagnosis Pills
- **Hover:** Darker background
- **Remove (×) hover:** Red color

### Department Tags
- **Hover:** Darker blue background
- **Click:** Navigate to examination detail or expand inline

### Visit History Items
- **Hover:** Subtle shadow
- **Click:** Open detail modal/drawer

---

## 10. ACCESSIBILITY NOTES

- All required fields marked with asterisk (*)
- Proper label-input associations
- Keyboard navigation supported (Tab order logical)
- Focus states clearly visible
- Color not used as only indicator (text labels always present)
- Text contrast meets WCAG AA standards

---

## 11. DATA BINDING NOTES (For Implementation)

**This spec is UI-ONLY. Data will come from:**
- Redux store: `state.clinic.selectedPatient`
- Form state: React Hook Form
- API: Fetch on mount, save on submit

**Form Structure:**
```typescript
interface ExaminationForm {
  // Section I
  hoTen: string
  ngaySinh: string
  tuoi: number
  gioiTinh: string
  // ... all other fields
  
  // Section II
  vitalSigns: {
    nhietDo: number
    mach: number
    huyetAp: string
    // ...
  }
  
  // Section III-VII
  // ...
}
```

---

## 12. IMPLEMENTATION CHECKLIST

When implementing, ensure:
- [ ] All 7 sections rendered
- [ ] Dotted underline styling applied to all input fields
- [ ] Section titles match exact text from design
- [ ] Left panel sticky/fixed positioning works
- [ ] Right panel scrolls independently
- [ ] Patient info card displays all required data
- [ ] Financial summary grid renders correctly
- [ ] Department tags and visit history are clickable
- [ ] Diagnosis pills can be added/removed
- [ ] Vital signs grid layout matches design
- [ ] All required fields marked with asterisk
- [ ] Typography sizes match specification (11px, 14px, etc.)
- [ ] Responsive breakpoints implemented
- [ ] Focus states work correctly
- [ ] No API/Redux logic mixed in UI components (pure presentation)

---

**End of UI Specification**

This document serves as the authoritative source for implementing the Clinic Register/Examination screen. All visual decisions should reference this spec. Implementation should focus solely on UI rendering — business logic, API calls, and Redux integration will be added separately.
