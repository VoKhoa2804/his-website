# GLOBAL_CLINIC_UI_CONTEXT.md

This file stores persistent UI/UX context for the Clinic feature.  
It must be loaded and referenced in every future enhancement prompt.

---

## 🔵 1. Layout Requirements

### 1.1 Full‑width Sections
All Clinic sections (I–VII) must expand to the full width of the parent content container.

### 1.2 3‑Column Administrative Layout (Hành Chính)
Section **I. Hành Chính** follows strict grid rules:

- Grid: `grid-cols-3` layout
- Each column has **equal width**
- Field width rules:
  - **Small inputs** → fixed small width inside their grid cell  
  - **Medium inputs** → larger width but still inside the same column  
  - **Large inputs** → span multiple columns using `col-span-2` or `col-span-3`
- Example:
  ```
  | Họ và tên | Ngày sinh | Tuổi |
  ```

### 1.3 Single Scroll
The entire Clinic page uses **one global scroll**.  
No nested scrollable containers are allowed inside sections.

---

## 🔵 2. Field & Input Styling Rules

### 2.1 Textarea Auto‑Grow
- All textareas:
  - Default = **1 visible line**
  - As user types → **auto-increase height** (no scrollbars)
  - Use:
    - `react-textarea-autosize` OR
    - custom JS autosize handler

### 2.2 Dotted‑line Style
Text-style inputs must follow medical form style:

- Labels left aligned
- Dotted line “_______________” adjacent to label
- When typing → input text overlays dotted line

---

## 🔵 3. Component Rules

### 3.1 ClinicSectionCard
All sections must be wrapped using a consistent component:

- Padding: `px-6 py-4`
- Rounded: `rounded-xl`
- Border: subtle `border-slate-200`
- Background: `white`
- Spacing between sections: `mt-6`

### 3.2 Section Header
Format:
```
I. HÀNH CHÍNH
-------------------------------
```
Rules:

- Title uses `font-semibold tracking-wide`
- Divider must align fully from left to right
- Vertical spacing above/below matches EMR layout (12–16px)

---

## 🔵 4. UX Consistency

### 4.1 Input Size Rules
- Small input = 120–160px
- Medium input = 200–260px
- Full-width input spans column width
- Never allow random tailwind classes to break layout

### 4.2 Vertical Rhythm
Section spacing + row spacing must follow:

- Between rows: `mb-3` or `gap-y-3`
- Between sections: 24–32px

---

## 🔵 5. Expected Goals for Next Prompts

Future enhancements must ensure:

1. Grid alignment in **Hành Chính** is pixel‑consistent
2. All textareas auto‑expand
3. Only a single scroll exists in page
4. Consistent use of SectionCard + SectionHeader component
5. Layout follows `design/feature/clinic` reference screenshots EXACTLY
6. Any new fields follow the same dotted‐line medical form style
7. No UI drift or spacing inconsistencies between sections

---

## 🔵 6. Usage Instructions for LLM (Claude / ChatGPT)

Every enhancement prompt **must begin by loading this file into context**:

Example:

```
You must read GLOBAL_CLINIC_UI_CONTEXT.md before generating code.
Apply all layout, spacing, grid, and text‑area auto‑grow rules.
```

Any output violating rules in this file must be corrected automatically.

---

End of file.
