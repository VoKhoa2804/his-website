# 08-fix-inlinefield-grid-overflow.md

## 🎯 Goal

Fix the layout issue in the **AdministrativeInfoSection** where inputs overflow into the next column because inline fields cannot shrink within the grid.  
Ensure **3 perfect equal-width grid columns**, with **inputs & labels properly shrinking** inside each column.

This task MUST use context from:

- `GLOBAL_CLINIC_UI_CONTEXT.md`
- `AdministrativeInfoSection.tsx`
- `InlineField.tsx`
- global CSS for `.medical-input`

---

## ✅ Problems to fix

### 1. InlineField overflows grid column

**Cause:**

- `label` uses `whitespace-nowrap` → long labels cannot shrink.
- `.medical-input` has fixed intrinsic width → cannot shrink.
- `flex-1` inside `InlineField` expands beyond available grid width.

### 2. Input does not behave like medical dotted-line layout

**Expected:**

- Input should fill leftover space in a column.
- Input should shrink gracefully.

### 3. Grid columns must always align vertically

Even if some fields have long text or short text.

---

## 🎯 Expected output after fix

### A. Perfect 3-column alignment

Each grid row must look like:

`| Label + input | Label + input | Label + input |`

and align vertically across all rows.

### B. No overflow

- No input should push into another column.
- Grid columns must NEVER break due to long labels.

### C. InlineField rewritten following best practice

- Label width is fixed (e.g., `w-28` or auto-configurable).
- Input has `flex-1 min-w-0` so it can shrink.
- `.medical-input` updated to allow shrinking.

---

## 🛠️ Required fixes

### 1. Update InlineField to shrink correctly

Rewrite `InlineField` so that:

- Label uses *fixed width*, NOT intrinsic width.
- Input can shrink inside the flex row.
- No overflow is possible.

**Target structure (conceptually):**

```tsx
<div className="flex items-center gap-2 min-w-0 w-full">
  <label className="w-28 text-xs font-medium text-gray-700 whitespace-nowrap">
    Họ và tên<span className="text-red-500">*</span>:
  </label>

  <input
    className="medical-input flex-1 min-w-0"
  />
</div>
```

### 2. Fix CSS for `.medical-input`

Ensure something equivalent to:

```css
.medical-input {
  @apply border-b border-dotted border-gray-300 text-xs bg-transparent outline-none;
  width: 100%;
  min-width: 0; /* <-- REQUIRED */
}
```

### 3. Keep AdministrativeInfoSection grid

`AdministrativeInfoSection` must remain:

```tsx
<div className="grid grid-cols-3 gap-x-8 gap-y-3">
  ...
</div>
```

But `InlineField` must now fit inside it without overflow.

---

## 📦 Deliverables

Claude must output:

1. **Updated `InlineField.tsx` (full code)**  
   Replacing the current version.

2. **Updated `.medical-input` CSS**  
   As a patch or full snippet.

3. **Updated `AdministrativeInfoSection.tsx` if needed.**

4. **Short explanation WHY overflow is fixed**  
   How `min-w-0`, fixed-width label, and shrinkable input solve the problem.

---

## 🔥 Constraints

- Do **not** remove Tailwind.
- Do **not** remove the grid structure.
- Do **not** switch to table layout.
- Must work with future dynamic fields (long labels, variable lengths).
- Must match Vietnamese EMR layout style.

---

## 🚀 Prompt end — start generation now

Please implement all fixes above and output updated code + explanation.
