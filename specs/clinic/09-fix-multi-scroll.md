# 09-fix-multi-scroll.md

## 🎯 Goal
Clinic UI currently shows **multiple scrollbars** (nested scroll areas), which hurts usability and makes the form feel “broken”.

This task enforces **ONE and only ONE scroll** for the Clinic page.

✅ Target: **single document-level scroll** (preferred) OR **single main-content scroll** (acceptable) — but **never nested**.

---

## 📂 Required Inputs (MUST read from workspace)
Before changing code, scan and reference:

1) **Clinic feature**
- `src/features/clinic/**`
- The main page component (e.g. `ClinicRegisterPage.tsx` or `ClinicListPage.tsx`)
- All section components (Administrative/Vitals/History/Labs/etc.)

2) **Layouts / Shell**
- `src/layouts/header.tsx`
- `src/layouts/sidebar.tsx`
- `src/app/routes/App.tsx`
- Any shared layout wrappers that set height/overflow

3) **Shared UI + global styles**
- `src/shared/ui/**`
- global CSS where `.medical-input` / layout utilities are defined (`src/index.css`, `src/App.css`, etc.)

4) **Context**
- `GLOBAL_CLINIC_UI_CONTEXT.md`

---

## ❌ What to Fix
### A) Remove nested scrolling
Find and eliminate **all** nested occurrences of:
- `overflow-auto`, `overflow-y-auto`, `overflow-scroll`
- `overflow-hidden` used to “trap” scroll in children
- wrappers like `h-full`, `h-screen`, `min-h-screen` combined with inner scroll containers that create extra scrollbars

### B) Standardize the scroll strategy (choose 1)
You MUST implement one of these strategies:

#### Strategy 1 (Preferred): Document-level scroll
- No `overflow-*` on Clinic page containers.
- Page content grows naturally.
- Only browser window scrolls.

#### Strategy 2 (Acceptable): Single main-content scroll
- `body` does NOT scroll.
- Only `main` scrolls (one scrollbar).
- Sidebar/header must not create additional scroll areas.

**Pick Strategy 1 unless the existing app shell requires Strategy 2.**

---

## ✅ Expected Outcome
After patch:

- ✅ Exactly **ONE** scrollbar is visible and usable for the Clinic page.
- ✅ No internal cards/sections have their own scroll.
- ✅ No right-panel scroll + inner-card scroll combination.
- ✅ Sidebar and header do not introduce extra scrollbars.

---

## 🔎 Step 1 — Locate ALL scroll sources
Scan Clinic page and list each scroll source as:

- File path
- Element/component name
- Current classNames causing scroll
- Why it creates a scrollbar

Example output:

- `src/features/clinic/ui/ClinicRegisterPage.tsx`
  - wrapper `<div className="flex-1 overflow-auto">`
  - creates second scrollbar inside main content

---

## 🛠 Step 2 — Apply the Fix (patches required)

### Patch 1 — Clinic page outer wrapper must NOT trap scroll
Remove patterns like:

```tsx
<div className="flex flex-1 overflow-hidden">
  <div className="flex-1 overflow-auto">...</div>
</div>
```

Replace with Strategy 1:

```tsx
<div className="flex flex-1">
  <div className="flex-1">...</div>
</div>
```

### Patch 2 — Remove overflow from sections
Section containers must never include:

- `overflow-auto`
- `max-h-*` (unless it is purely cosmetic and does not scroll)

Change:

```diff
- <div className="... overflow-y-auto ...">
+ <div className="...">
```

### Patch 3 — Fix layout shell if it forces nested scroll
If the app shell uses something like:

- `h-screen` + `overflow-hidden` + `main overflow-auto`

Then ensure **only one place** is scrollable.

You MUST ensure:
- either **body scrolls** (Strategy 1),
- or only **main scrolls** (Strategy 2),
but not both.

---

## 🧪 Step 3 — Validate (must be explicit)
After changes, validate by checking:

1) Open Clinic page
2) Confirm scrollbars count:
   - Browser window scrollbar only (Strategy 1), OR
   - Only one main content scrollbar (Strategy 2)
3) Confirm no section/card shows its own scrollbar
4) Confirm content is not clipped (all sections fully reachable)

Return a short validation report:

- Chosen strategy: 1 or 2
- Scrollbars observed: 1
- Remaining overflow classes: none (or list if any)

---

## 📤 Output Requirements (when executing)
Your response MUST include:

### 1) SCROLL_SOURCE_REPORT
- Severe / Medium / Minor scroll issues (bullets)
- Each item with file path + offending classes

### 2) CODE_PATCHES (3–7 patches)
Provide copy-paste ready diffs for the most important files.

### 3) POST_PATCH_VALIDATION
- Strategy used
- Scrollbars count after patch
- Any remaining risks

---

## 🚫 Constraints
- Do NOT add new scrollbars to cards/sections.
- Do NOT use nested `overflow-*`.
- Keep layout consistent with the design reference and existing project conventions.
- Avoid breaking routing/layout for other pages.

---

## ✅ Start Now
Scan the workspace, identify nested scroll sources, apply the patches, and return the outputs in the required format.
