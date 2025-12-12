# 07 – FIX GRID ALIGNMENT & TEXTAREA AUTOSIZE (CLINIC)

> 📌 **IMPORTANT:**  
> Before executing this task, you MUST load and respect all rules defined in:  
> `GLOBAL_CLINIC_UI_CONTEXT.md`

That file defines the permanent UX contract for the Clinic feature (3-column grid, single scroll, textarea auto-grow, dotted-line style, etc.).  
All changes in this task MUST be compatible with that context.

---

## 🎯 GOAL

We already ran `06-continue-enhance-ui-ux.md`, but there are still 2 concrete problems:

1. **Section “I. HÀNH CHÍNH”**
   - Current state: fields are arranged logically, but **columns are not aligned** in a strict grid.
   - Desired: a **true 3-column grid** with **equal-width columns** across the whole section.

2. **Textarea behavior**
   - Current state: textarea-like fields show 1-line visually, but **do not auto-expand height** when user types more text.
   - Desired: all long-text fields should **start with 1-line height** and **auto-grow vertically** as the user types (no inner scrollbars).

Additionally, we must ensure:

3. **Scroll behavior**
   - The Clinic page has **only one vertical scroll** (global page scroll), not separate scrollbars for inner containers.

This task focuses ONLY on these three aspects — no new business logic or API changes.

---

## 📂 REQUIRED CONTEXT & FILES

You MUST read and use the following, in this order:

### 1. Global context (MANDATORY)
- `GLOBAL_CLINIC_UI_CONTEXT.md`  
  → This defines:
  - 3-column grid rules for “Hành chính”
  - Textarea auto-grow rules
  - Single-scroll rule
  - General spacing & styling conventions

### 2. Clinic UI implementation
- `src/features/clinic/**`
  - Especially:
    - Main page: `ClinicRegisterPage.tsx`
    - Section I component (Administrative Info)
    - Components wrapping textarea-like fields (Hỏi bệnh, Khám xét, Chẩn đoán, CLS, etc.)

### 3. Shared components & layout
- `src/shared/ui/**`
- Layout containers (`App.tsx`, `header.tsx`, `sidebar.tsx`)

---

## 🔍 STEP 1 – CURRENT STATE ANALYSIS

Produce a short **CURRENT_STATE** section describing:

- Current layout of Section I (grid/flex/width issues)
- Current textarea implementation
- Current scroll containers (identify nested scroll issues)

---

## 🧮 STEP 2 – GRID DESIGN FOR “HÀNH CHÍNH”

Produce a **COLUMN_LAYOUT_PLAN** based on:

| Row | Col 1          | Col 2         | Col 3       |
|-----|----------------|---------------|-------------|
| 1   | Họ và tên      | Ngày sinh     | Tuổi        |
| 2   | Giới tính      | Dân tộc       | Quốc tịch   |
| 3   | Nghề nghiệp    | Nơi làm việc  | (optional)  |
| 4   | CMND/CCCD      | Ngày cấp      | Nơi cấp     |
| 5   | Địa chỉ thường trú | col-span-3 |             |
| 6   | Tỉnh/TP        | Quận/Huyện    | Xã/Phường   |
| 7   | Điện thoại     | Email         | (optional)  |

Rules:
- Use `grid grid-cols-3 gap-x-8 gap-y-3`
- Equal-width columns
- Use `col-span-2` or `col-span-3` for large fields

---

## ✍️ STEP 3 – IMPLEMENTATION CHANGES (CODE PATCHES)

You MUST generate code patches to:

### 3.1 Fix Hành Chính grid

- Convert Section I to strict 3-column grid.
- Remove conflicting flex/basis/width classes.
- Add `className` passthrough to field components if needed.

### 3.2 Implement Auto-Resize Textarea

Create:

```tsx
// src/shared/ui/auto-resize-textarea.tsx
import React from "react";

export const AutoResizeTextarea = React.forwardRef(
  ({ className, onInput, ...props }, ref) => {
    const handleInput = (e) => {
      const el = e.currentTarget;
      el.style.height = "auto";
      el.style.height = el.scrollHeight + "px";
      onInput?.(e);
    };
    return (
      <textarea
        {...props}
        ref={ref}
        rows={1}
        onInput={handleInput}
        className={"resize-none overflow-hidden " + (className ?? "")}
      />
    );
  }
);
```

Then replace existing textarea usage in all Clinic sections.

### 3.3 Enforce Single Scroll Container

- Remove nested `overflow-auto` / `overflow-scroll`
- Ensure only the page-level container scrolls

---

## ✅ STEP 4 – POST-CHANGE VALIDATION

Return this section:

### Grid Alignment
- PASS / NEEDS REVIEW — explanation

### Textarea Autosize
- PASS / NEEDS REVIEW — explanation

### Single Scroll
- PASS / NEEDS REVIEW — explanation

---

## 📤 OUTPUT FORMAT

You MUST output these top-level sections:

```
## CURRENT_STATE
...
## COLUMN_LAYOUT_PLAN
...
## CODE_PATCHES
...
## POST_CHANGE_VALIDATION
...
```

---

End of file.
