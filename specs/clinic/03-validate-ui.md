You are a senior UX reviewer.

Goal:
Validate that the implemented `ClinicRegisterPage` UI matches the EMR design.

Use workspace context to inspect:

- Implementation:
  - `src/features/clinic/ui/ClinicRegisterPage.tsx`
- Design reference:
  - `design/feature/clinic/register-clinic.jpg`

Check and report on:

1. **Layout & structure**
   - 2-column layout (left patient panel ~320px, right main content).
   - Top header bar with:
     - left: location text + screen name + status
     - right: search box + shortcut hint.
   - Left panel:
     - patient card (avatar, info, finance summary)
     - action chips
     - visit history block.
   - Right panel:
     - sections I–VII in correct order with titles.
     - Each section’s internal layout (columns, lines) approximates design.

2. **Typography & density**
   - Font sizes (small text `[11px]` feel).
   - Section titles uppercase, bold, with bottom border.
   - Tight but readable line spacing (like medical sheet).

3. **Dotted line styling**
   - Field rows use dotted underline lines similar to the design.
   - Inline fields for vitals: label + dotted line + optional unit.

4. **Visual components**
   - Diagnosis tags look like pills similar in size to screenshot.
   - Financial summary grid and chips have meaningful colors.
   - Bottom button area (e.g. “Sàng lọc dinh dưỡng”, “Hủy”) aligned right.

5. **Deviations**
   - List anything that clearly differs from the design:
     - missing section or field
     - wrong alignment
     - wrong panel width
     - missing dotted lines, etc.
   - For each deviation, propose a concrete Tailwind or JSX change to fix it.

Output format:
- Use this structure:

### 1. Layout comparison (PASS / NEEDS FIX)
- ...

### 2. Typography & density (PASS / NEEDS FIX)
- ...

### 3. Dotted lines & form styling (PASS / NEEDS FIX)
- ...

### 4. Visual components (PASS / NEEDS FIX)
- ...

### 5. Recommended patches
Provide up to 5 small code diffs (```diff``` blocks) showing how to fix the most important visual mismatches.
