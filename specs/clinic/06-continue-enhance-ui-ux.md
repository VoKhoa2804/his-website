# 06 – CONTINUOUS UI/UX ENHANCEMENT (CLINIC REGISTER PAGE)

## 🎯 GOAL

Iteratively **improve the Clinic Register UI/UX** so that:

1. All sections use **full available width** in the main content area.
2. **Section I – HÀNH CHÍNH** uses a **responsive field layout**:
   - 3 small-width columns (e.g. Sex / Age / Country…),
   - 2 medium-width columns,
   - 1 large-width column (e.g. full-name / full address).
   - Example layout row:  
     `Họ và tên | Ngày sinh | Tuổi`
3. All “long text” fields behave like **single-line by default**, but **auto-grow vertically** when there is more content.
4. The page has **only ONE scroll area**.
5. Changes are **compatible with the existing architecture** from Tasks 01–05.

## 📂 REQUIRED INPUTS

Claude must read from workspace:

### 1. Clinic UI
- `src/features/clinic/ui/ClinicRegisterPage.tsx`
- `src/features/clinic/ui/**`
- Shared layout:
  - `src/app/routes/App.tsx`
  - `src/layouts/MainLayout.tsx`
  - `src/layouts/header.tsx`
  - `src/layouts/sidebar.tsx`

### 2. Shared UI
- `src/shared/ui/**`
- Global CSS

### 3. Design & Specs
- `design/feature/clinic/*.jpg`
- Spec files:
  - `CLINIC_UI_SPECIFICATION.md`
  - `CLINIC_UI_VALIDATION_REPORT.md`
  - `CLINIC_ARCHITECTURE_VALIDATION_REPORT.md`
  - `05-ui-diff-and-enhance.md`

---

## 🔍 STEP 1 – CURRENT STATE ANALYSIS

Claude should analyze:
- Layout / width / card wrappers
- Column structure of Section I
- Textarea implementation
- Scroll container hierarchy

Output required: **CURRENT_STATE** summary.

---

## 🧮 STEP 2 – COLUMN LAYOUT DESIGN

Define S/M/L width classes and row composition.  
Example mapping:

| Row | Fields                          | Layout |
|-----|---------------------------------|--------|
| 1   | Họ và tên / Ngày sinh / Tuổi   | L / M / S |
| 2   | Giới tính / Dân tộc / Quốc tịch | S / S / M |
| 3   | Nghề nghiệp / Nơi làm việc     | M / L |
| 4   | CMND / Ngày cấp / Nơi cấp      | M / M / M |
| 5   | Địa chỉ thường trú             | Full L |
| 6   | Tỉnh / Quận / Xã               | S / S / S |
| 7   | Điện thoại / Email             | M / L |
| 8   | Người liên hệ / SĐT liên hệ    | M / M |

Output required: **COLUMN_LAYOUT_PLAN** table.

---

## ✍️ STEP 3 – IMPLEMENTATION PATCHES

Claude generates diffs for:

### 3.1 Full-width sections
- Ensure all cards stretch w-full, remove max-w unnecessarily.

### 3.2 Section I layout
- Convert to responsive grid/flex row with width classes for S/M/L.

### 3.3 Auto-growing textarea
- rows={1}, JS auto height  
or  
- CSS min-height responsive

### 3.4 Single scroll area
- Remove nested overflow-auto  
- Keep only main content scroll

Output required: **CODE_PATCHES** (3–8 patches).

---

## ✅ STEP 4 – POST-CHANGE VALIDATION

Check:

- Section width ✔
- Section I structure ✔
- Auto-grow text ✔
- Only one scroll ✔

Output required: **POST_CHANGE_VALIDATION** with PASS/FAIL per item.

---

## 📤 OUTPUT FORMAT (STRICT)

Claude must always return:

1. CURRENT_STATE  
2. COLUMN_LAYOUT_PLAN  
3. CODE_PATCHES  
4. POST_CHANGE_VALIDATION

---

## ▶️ HOW TO RUN

```txt
/spec:execute specs/clinic/06-continue-enhance-ui-ux.md
```
