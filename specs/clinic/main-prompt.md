# MAIN PIPELINE EXECUTION PROMPT
### For: CLAUDE FOR VS CODE — Multi-step Feature Generation  
### Feature: CLINIC MODULE  
### Tasks:  
1. 01-structure  
2. 02-ui-from-design  
3. 03-validate-ui  
4. 04-validate-structure  

This file defines the entire execution pipeline for generating the **Clinic** feature in a modular React + TypeScript project.  
Claude for VS Code must follow this pipeline **strictly and sequentially without skipping any steps**.

---

# 🚀 PIPELINE OVERVIEW

The pipeline consists of **five major tasks**:

1. Generate feature folder structure  
2. Extract UI specification from design images  
3. Implement UI according to the extracted spec  
4. Validate UI against design  
5. Validate project structure + architecture consistency  

Each task corresponds to a spec file already in the repo:

specs/clinic/01-structure.md
specs/clinic/02-ui-from-design.md
specs/clinic/03-validate-ui.md
specs/clinic/04-validate-structure.md

rust
Sao chép mã

Design images for UI extraction:

design/feature/clinic/register-clinic-1.jpg
design/feature/clinic/register-clinic-2.jpg
design/feature/clinic/register-clinic-3.jpg

# ▶️ **TASK 01 — EXECUTE STRUCTURE SPEC**
### Command:
/spec:execute specs/clinic/01-structure.md

markdown
Sao chép mã

### Purpose:
- Create the full folder and file structure for the **Clinic** feature:
src/features/clinic/
api/
config/
hooks/
model/
ui/
index.ts

markdown
Sao chép mã
- Follow the architectural pattern of `src/features/work-shift/**`
- Add integration stubs:
- Route stub to `src/app/routes/App.tsx`
- Sidebar stub to `src/layouts/sidebar.tsx`
- Create empty placeholder files, correct naming, and minimal exports
- Do NOT create UI, do NOT create API methods yet

### Expected output:
✔ Task 01 Completed — Structure Created

# ▶️ **TASK 02 — CREATE & EXECUTE UI SPEC FROM DESIGN**
### Commands:
/spec:create specs/clinic/02-ui-from-design.md
/spec:execute specs/clinic/02-ui-from-design.md

### Purpose:
- Read all three design screenshots
- Extract exact UI rules:
  - Layout proportions  
  - Left panel (patient summary, financial info, visit history)  
  - Right panel with section headers I–VII  
  - Dotted line styling  
  - Spacing, font sizes, colors, component hierarchy  
- Produce a **golden UI spec** (NO implementation yet)
- This spec will become the authoritative blueprint for UI implementation

### Expected output:
✔ Task 02 Completed — UI Spec Created

# ▶️ **TASK 03 — IMPLEMENT UI FROM SPEC**
### Command:
/spec:execute specs/clinic/02-ui-from-design.md

powershell
Sao chép mã

### Purpose:
Using the UI spec from Task 02:

- Generate full UI implementation at:
src/features/clinic/ui/ClinicRegisterPage.tsx

markdown
Sao chép mã
- Use:
- React + TypeScript  
- Tailwind CSS  
- `@/shared/ui/*` components  
- Build all helper UI components including:
- SectionTitle  
- FieldRow  
- InlineField  
- LongLineField  
- TwoColumnLines  
- IndentedLines  
- DottedLine  
- Match the EMR (electronic medical record) visual style precisely:
- Dotted lines  
- Text size 11px  
- Uppercase section headers with bottom border  
- Dense medical-form UI layout  

### Prohibited:
❌ No API calls  
❌ No Redux integration  
❌ No business logic  

This step focuses **ONLY on UI layout and rendering**.

### Expected output:
✔ Task 03 Completed — UI Implemented

# ▶️ **TASK 04 — VALIDATE UI AGAINST DESIGN**
### Command:
/spec:execute specs/clinic/03-validate-ui.md

### Purpose:
Compare:

- **Implemented UI**  
  → `src/features/clinic/ui/ClinicRegisterPage.tsx`

WITH

- **Design reference images**  
  → `design/feature/clinic/register-clinic-*.jpg`

Check:

### Layout
- 2-column structure  
- Proportions match  
- Left panel content order  
- Right panel section order I–VII  

### Styling
- Font sizes  
- Dotted lines  
- Tag chips  
- Financial summary grid  
- Color usage  

### Deviations
For each mismatch:

- Describe the issue  
- Provide **specific Tailwind/JSX diff fixes (```diff``` blocks)**  

### Expected output:
✔ Task 04 Completed — UI Validation Finished

# ▶️ **TASK 05 — VALIDATE ARCHITECTURE & CODE STRUCTURE**
### Command:
/spec:execute specs/clinic/04-validate-structure.md

### Purpose:
Validate the entire Clinic feature:

### Compare with work-shift:
- Folder structure  
- Naming conventions  
- File patterns  
- Hook architecture  
- API structure  
- Model + DTO structure  

### Validate integration:
- Route added properly  
- Sidebar entry added properly  

### Analyze code quality:
- Type safety  
- Proper imports  
- Reusable components  
- No unnecessary complexity  

### Produce:
- PASS / NEEDS FIX lists  
- Patch suggestions with `diff` blocks  

### Expected output:
✔ Task 05 Completed — Structure Validation Finished

# ⚠ GLOBAL PIPELINE RULES (MANDATORY)

Claude must:

- Execute tasks **in exact order**
- NEVER skip any task  
- ALWAYS use workspace context  
- NEVER hallucinate folder names  
- ALWAYS follow existing project conventions  
- ALWAYS produce valid TypeScript  
- Ask NO questions — proceed automatically  
