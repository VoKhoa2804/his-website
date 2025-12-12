# Visual Validation Checklist
**Before Testing:** Open http://localhost:5173/phong-kham in browser  
**Purpose:** Verify all UI mismatch fixes are visually correct

---

## 1. Page Header Validation

### What to Check:
- [ ] Header is wrapped in a white Card with border at bottom
- [ ] Title reads "DANH SÁCH PHÒNG KHÁM" (all uppercase)
- [ ] Title font size is smaller (text-lg, not text-2xl)
- [ ] NO description text appears below title
- [ ] Two buttons on right: "Xuất Excel" (outline) + "Thêm phòng khám" (filled)
- [ ] Header height is compact (~72px)

### Expected Appearance:
```
┌─────────────────────────────────────────────────────────────┐
│  DANH SÁCH PHÒNG KHÁM              [Xuất Excel] [Thêm PK]  │
└─────────────────────────────────────────────────────────────┘
```

**PASS:** ☐ Yes | ☐ No (issue: ______________)

---

## 2. Two-Panel Layout Validation

### What to Check:
- [ ] Left panel is ~25% width, right panel ~75%
- [ ] Gap between panels is small (8px, not 16px)
- [ ] Components in left panel have small gaps (8px between each)
- [ ] Layout is responsive (collapses to single column on mobile)

### Expected Proportions:
```
┌──────┬────────────────────┐
│ 25%  │      75%          │
│      │                    │
│ Left │   Right Panel     │
│Panel │   (Table)         │
│      │                    │
└──────┴────────────────────┘
```

**PASS:** ☐ Yes | ☐ No (issue: ______________)

---

## 3. Filter Card Validation

### What to Check:
- [ ] Filter area has light gray background (bg-gray-50)
- [ ] NO heavy Card border/shadow around filters
- [ ] Search input has NO label above it (only icon inside)
- [ ] Spacing between filter fields is tight (4-8px)
- [ ] "Đặt lại bộ lọc" button is at BOTTOM, full-width
- [ ] Filter area is compact (~168px tall)

### Expected Structure:
```
┌────────────────────────┐
│ 🔍 [Search input...]  │
│                        │
│ Khoa/Phòng ban         │
│ [Dropdown ▼]          │
│                        │
│ Trạng thái             │
│ [Dropdown ▼]          │
│                        │
│ [Đặt lại bộ lọc]      │
└────────────────────────┘
```

**PASS:** ☐ Yes | ☐ No (issue: ______________)

---

## 4. Table Validation

### What to Check:
- [ ] Table has NO rounded corners (sharp edges)
- [ ] Header row has gray background (bg-gray-100)
- [ ] Column headers are UPPERCASE and bold
- [ ] Data rows are SHORT (32px height, not tall)
- [ ] Rows alternate: white → light gray → white → light gray
- [ ] Hover effect is subtle (not strong highlight)
- [ ] Cell padding is compact (8px, not 16px)
- [ ] Can see ~18 rows on standard screen (vs ~12 before)

### Expected Appearance:
```
┌──────────────────────────────────────────────┐
│ MÃ PK    │ TÊN PHÒNG KHÁM      │ TRẠNG THÁI │ (gray header)
├──────────┼─────────────────────┼────────────┤
│ PK001    │ Phòng khám Nội      │ ✓ Active   │ (white row)
│ PK002    │ Phòng khám Ngoại    │ ✓ Active   │ (gray row)
│ PK003    │ Phòng khám Sản      │ ✗ Inactive │ (white row)
│ PK004    │ Phòng khám Nhi      │ ✓ Active   │ (gray row)
└──────────┴─────────────────────┴────────────┘
```

**PASS:** ☐ Yes | ☐ No (issue: ______________)

---

## 5. Form Dialog Validation (Click "Thêm phòng khám")

### What to Check:
- [ ] Dialog width is narrower (672px, not 768px)
- [ ] Dialog title: "Thêm phòng khám mới"
- [ ] Form has 5 sections labeled I, II, III, IV, V
- [ ] Section numbers appear as BLUE CIRCULAR BADGES (not plain text)
- [ ] Section borders are THICK (2px, darker gray)
- [ ] Section titles are uppercase

### Expected Section Headers:
```
┌─────────────────────────────────┐
│ ┌───┐                           │
│ │ I │ THÔNG TIN CHUNG           │
│ └───┘                           │
│ ═══════════════════════════════ │ (thick border)
```

**PASS:** ☐ Yes | ☐ No (issue: ______________)

---

## 6. Form Field Layout Validation (Section I)

### What to Check:
- [ ] Fields are STACKED (one per row), not side-by-side
- [ ] Each field has label on LEFT (30%), input on RIGHT (70%)
- [ ] Labels are fixed width (aligned vertically)
- [ ] Labels read "Mã PK" and "Tên PK" (shortened)
- [ ] Error messages are indented below input (aligned with input)
- [ ] Inputs have dotted underline style (.medical-input)

### Expected Layout:
```
┌────────────────────────────────────────────┐
│ Mã PK *      [________________]            │
│                                            │
│ Tên PK *     [_______________________]     │
│                                            │
└────────────────────────────────────────────┘
```

**NOT:**
```
┌─────────────────────────────────────┐
│ Mã PK *           │ Tên PK *       │ (side-by-side)
│ [________]        │ [_________]    │
└─────────────────────────────────────┘
```

**PASS:** ☐ Yes | ☐ No (issue: ______________)

---

## 7. Medical Input Styling Validation

### What to Check:
- [ ] Input background is TRANSPARENT (not white)
- [ ] Input has DOTTED bottom border (not solid)
- [ ] When focused: border becomes SOLID and BLUE
- [ ] When focused: background becomes LIGHT BLUE (very subtle)
- [ ] When disabled: input is grayed out
- [ ] NO rounded corners on inputs

### States to Test:
1. **Normal:** Transparent bg, dotted border
2. **Focused:** Light blue bg, solid blue border
3. **Disabled:** Gray bg, reduced opacity (test by editing existing clinic - code field)

**PASS:** ☐ Yes | ☐ No (issue: ______________)

---

## 8. Summary Card Validation

### What to Check:
- [ ] Card shows 3 stats: Tổng số, Hoạt động, Ngừng hoạt động
- [ ] Each stat has icon on left, count on right
- [ ] Icons are colored: Blue (hospital), Green (check), Gray (x)
- [ ] Numbers are larger than labels
- [ ] Spacing between stats is tight (8-12px)

### Expected Stats Display:
```
┌──────────────────────┐
│ Tổng quan           │
├──────────────────────┤
│ 🏥 Tổng số      24  │
│ ✓  Hoạt động    20  │
│ ✗  Ngừng HĐ      4  │
└──────────────────────┘
```

**PASS:** ☐ Yes | ☐ No (issue: ______________)

---

## 9. Responsive Design Validation

### What to Check:
**Desktop (>1024px):**
- [ ] Two-panel layout visible
- [ ] Left panel 25%, right panel 75%
- [ ] All content readable

**Tablet (768-1024px):**
- [ ] Layout should adapt gracefully
- [ ] Panels may stack or adjust width

**Mobile (<768px):**
- [ ] Single column layout
- [ ] Filter card stacks above table
- [ ] Form dialog fills most of screen
- [ ] Table is scrollable horizontally

**PASS:** ☐ Desktop | ☐ Tablet | ☐ Mobile

---

## 10. Functional Testing

### Create New Clinic:
- [ ] Click "Thêm phòng khám" button
- [ ] Dialog opens with form
- [ ] Fill in Mã PK: "TEST01"
- [ ] Fill in Tên PK: "Phòng khám Test"
- [ ] Select Khoa: "Khoa Nội"
- [ ] Click "Tạo mới"
- [ ] Success toast appears
- [ ] New clinic appears in table
- [ ] Dialog closes

**PASS:** ☐ Yes | ☐ No (issue: ______________)

### Edit Existing Clinic:
- [ ] Click edit icon (pencil) on any row
- [ ] Dialog opens with pre-filled data
- [ ] Mã PK field is DISABLED
- [ ] Change Tên PK
- [ ] Click "Cập nhật"
- [ ] Success toast appears
- [ ] Table updates
- [ ] Dialog closes

**PASS:** ☐ Yes | ☐ No (issue: ______________)

### Filter Clinics:
- [ ] Type in search box
- [ ] Table filters immediately
- [ ] Select department dropdown
- [ ] Table filters by department
- [ ] Select status dropdown
- [ ] Table filters by status
- [ ] Click "Đặt lại bộ lọc"
- [ ] All filters clear
- [ ] Full list returns

**PASS:** ☐ Yes | ☐ No (issue: ______________)

### Delete Clinic:
- [ ] Click delete icon (trash) on any row
- [ ] Confirmation dialog appears
- [ ] Click "Xóa"
- [ ] Success toast appears
- [ ] Clinic removed from table

**PASS:** ☐ Yes | ☐ No (issue: ______________)

---

## 11. Keyboard Shortcuts Testing

### Shortcuts to Test:
- [ ] **Ctrl+K** → Opens "Thêm phòng khám" dialog
- [ ] **Ctrl+/** → Focuses search input
- [ ] **F5** → Refreshes clinic list (shows toast)
- [ ] **Escape** → Closes open dialog

**PASS:** ☐ Yes | ☐ No (issue: ______________)

---

## 12. Visual Comparison with Reference

### Compare Against Screenshots:
Open `design/reference/register-clinic-1.jpg` side-by-side with browser

#### Check Alignment:
- [ ] Page header matches screenshot style
- [ ] Two-panel proportions match (25:75)
- [ ] Filter area density matches
- [ ] Table row height matches
- [ ] Form section headers match

#### Overall Similarity Score:
Rate 1-10 how closely implementation matches screenshots:

**Score:** _____ / 10

**Notes:** ________________________________

---

## Summary Checklist

### Critical Items (Must Pass):
- [ ] Page header is uppercase, no description
- [ ] Table rows are 32px tall with alternating backgrounds
- [ ] Filter card has no Card wrapper, light gray background
- [ ] Form dialog is 672px wide (narrower)
- [ ] Section numbers are blue circular badges
- [ ] Section I fields are stacked, not grid
- [ ] Medical inputs have dotted underlines

### Important Items (Should Pass):
- [ ] All spacing is reduced (8px gaps)
- [ ] Headers have thicker borders (2px)
- [ ] Labels are inline with inputs in form
- [ ] Table headers are uppercase and bold
- [ ] Create/Edit/Delete functions work correctly

### Nice-to-Have Items (May Pass):
- [ ] Print layout works well
- [ ] Responsive design is perfect
- [ ] All keyboard shortcuts work
- [ ] Visual match is 85%+ with screenshots

---

## Overall Assessment

**Total Items Checked:** _____ / 60

**Pass Rate:** _____ %

**Status:**
- [ ] ✅ PASS - Ready for production
- [ ] ⚠️ PARTIAL - Minor tweaks needed
- [ ] ❌ FAIL - Major issues found

**Issues Found:**
1. _________________________________
2. _________________________________
3. _________________________________

**Recommended Actions:**
1. _________________________________
2. _________________________________
3. _________________________________

---

**Tested By:** _______________  
**Date:** _______________  
**Browser:** _______________  
**Screen Size:** _______________  
**Build Version:** 672.57 kB
