# 05 – UI DIFF & ENHANCEMENT (CLINIC FEATURE)

## 🎯 GOAL

Analyze the **differences** between:

1. The **current UI** of the Clinic feature (output running in code)
2. The **official design UI** stored in `design/feature/clinic`

→ Then propose & apply **specific UI/UX improvements** so the current UI matches the design as closely as possible.

This runs iteratively: **ANALYZE → PROPOSE → PATCH → RE‑VALIDATE** until differences are minimal.

---

## 📂 REQUIRED INPUT

You must use workspace context and inspect:

### 1. Original Design (OLD UI / DESIGN)
- `design/feature/clinic/*.png`
- `design/feature/clinic/*.jpg`
- Any design notes if available

### 2. Current UI (OUTPUT)
- `src/features/clinic/**`
- Form, layout, UI components, subcomponents

### 3. Shared Layout / Shell
- `src/layouts/header.tsx`
- `src/layouts/sidebar.tsx`
- `src/app/routes/App.tsx`
- `src/shared/ui/**`

❗ **NO hallucination**.  
❗ **MUST analyze actual code + images.**

---

## 🔍 STEP 1 — UI DIFF ANALYSIS

### 1. Identify the main UI layout from design
- 2‑column layout?
- Left patient panel?
- Section cards (I → VII)?
- Padding, spacing, typography, line separators?

### 2. Extract current layout structure
- Page layout tree
- Components used (Card, Table, SectionHeader, etc.)
- Tailwind classes or styling logic

### 3. Perform a detailed comparison

#### **Layout**
- Grid/column mismatches
- Sidebar width incorrect?
- Content container padding wrong?

#### **Typography**
- Heading sizes?
- Label style?
- Text weight & color?

#### **Spacing**
- Section spacing?
- Row line-height?
- Card inner padding?

#### **Components**
- Card borders?
- Section header lines?
- Dotted‑line fields vs Inputs?

#### **Interaction**
- Button order & placement?
- Hover/focus states?
- Sticky sidebar/header?

### 4. Output a **UI DIFF REPORT** with categories:

- **SEVERE** — Major layout or workflow issues  
- **MEDIUM** — Noticeable design mismatch  
- **MINOR** — Cosmetic inconsistencies  

---

## 🛠 STEP 2 — ENHANCEMENT PLAN

Build a clear plan based on the diff:

### **Layout changes**
- Update main container sizing (`max-w-5xl`, center)
- Use grid: `[280px, 1fr]`
- Normalize spacing scale (16–24px baseline)

### **Component-level changes**
Introduce or update:
- `ClinicSectionCard`
- `ClinicSectionHeader`
- `ClinicFieldRow`
- `ClinicFieldGrid`

### **Tailwind Design Tokens**
- Spacing: 8 / 12 / 16 / 24 / 32  
- Font sizes: 12 / 14 / 16 / 18 / 20  
- Border radius: md / lg  
- Soft shadow, subtle border colors  

### **Priority levels**
- **P1:** Layout + Section Headers  
- **P2:** Fields + dotted-line format  
- **P3:** Tables / Diagnosis blocks  
- **P4:** Micro-interactions  

### **File Map**
Specify:
- Files to modify  
- New components to create  
- Deprecated code to refactor  

---

## ✂️ STEP 3 — CODE PATCHES

Provide practical patches developers can copy.

### Example Patch (Layout)

```diff
--- src/features/clinic/ClinicRegisterPage.tsx (old)
+++ src/features/clinic/ClinicRegisterPage.tsx (new)
@@
- <main className="flex-1 p-4">
-   {/* content */}
- </main>
+ <main className="flex flex-1 overflow-hidden bg-slate-50">
+   <div className="mx-auto flex w-full max-w-6xl gap-4 px-4 py-6">
+     <ClinicSidebar />
+     <ClinicFormLayout />
+   </div>
+ </main>
```

### Patch areas:
1. Page Layout Structure  
2. Section Component Wrapper  
3. Field Components (labels, dotted lines, grids)  
4. Toolbar buttons alignment & spacing  

**Rules:**
- React + TypeScript + Tailwind  
- Must use shared/ui components  
- Avoid large, monolithic files  
- Do not break existing data logic  

---

## ✅ STEP 4 — RE-VALIDATE AGAINST DESIGN

After applying patches:

### Compare again:
- Section I–VII hierarchy  
- Sidebar structure  
- Typography accuracy  
- Spacing / rhythm  

### Evaluate remaining differences:
- Are any **SEVERE** issues left?  
- Are **MEDIUM** issues reduced?  

If still mismatched → create an **Iteration 2 Plan**.

### Developer Instruction
After applying Patch Round 1:

➡️ Capture a new screenshot  
➡️ Save to `design/feature/clinic/output-v2/`  
➡️ Run this task again for refinement  

---

## 📤 REQUIRED OUTPUT FORMAT

When running `spec:execute`, always return:

---

### **1. UI_DIFF_REPORT**
- Severe issues  
- Medium issues  
- Minor issues  

---

### **2. ENHANCEMENT_PLAN**
- Layout adjustments  
- Component‑level changes  
- Typography corrections  
- Interaction improvements  

---

### **3. CODE_PATCHES**
3–7 important patches in diff or full code blocks.

---

### **4. POST_PATCH_VALIDATION**
- Approx % similarity to design  
- Remaining gaps  
- Next iteration steps  

---

## ℹ️ MODEL GUIDELINES

- Favor clean, medical‑grade UI  
- Avoid heavy borders  
- Use spacing hierarchy  
- Keep clinical labels intact  
- Optimize for fast doctor workflow
