You are a senior UX engineer and UI architect.

Goal:
Extract a precise UI specification for the **Clinic Register / Examination screen** from the design image:

- `design/feature/clinic/**.jpg`

Very important:
- Use workspace context to open and visually inspect the image.
- This spec is ONLY for the UI layout/style, not for Redux/API logic.
- Think of this as a digital medical examination sheet UI.

Requirements for this UI spec:

1. **High-level layout**
   - Describe overall grid:
     - Top header bar (blue-like, search input, status text)
     - 2-column main area:
       - Left: patient info card + financial summary + visit history
       - Right: large form with sections (I, II, III, IV, V, VI, VII)
   - For each region, describe:
     - approximate width proportions (e.g. left 320px, right fills rest)
     - background colors, borders, shadows
     - scroll behavior (which parts are scrollable)

2. **Section breakdown (right panel)**
   For each section (I. HÀNH CHÍNH, II. SINH HIỆU, III. HỎI BỆNH, IV. KHÁM XÉT,
   V. CHẨN ĐOÁN, VI. THÔNG TIN KHÁM BỆNH, VII. TÓM TẮT KẾT QUẢ CLS):

   - Write its title exactly as in the design.
   - Describe the internal layout:
     - number of columns/rows
     - which fields are inline, which span full width
     - which lines are dotted underlines
   - Mark required fields (with *) if visible.
   - Describe any tag-like components (e.g. diagnosis pills).

3. **Left panel details**
   - Patient info card structure:
     - avatar block
     - name, DOB, sex, age line
     - MRN, visit id, etc.
     - financial summary with 2x2 grid of numbers
   - Buttons or chips (e.g. “Khám Ngoại lồng ngực”, “Khám Nội tim mạch”)
   - Visit history list style.

4. **Tailwind + shared/ui mapping**
   - Propose which shared components to use:
     - `@/shared/ui/button`, `card`, `input`, `label`, `table` (if any)
   - For each major block, suggest Tailwind classes:
     - container div
     - header bar
     - dotted field rows (border-b border-dotted text-[11px], etc.)
     - typography (font sizes, weights, colors)

5. **Component design**
   - Define React component: `ClinicRegisterPage`
   - Define small helper components:
     - `SectionTitle`
     - `FieldRow`
     - `InlineField`
     - `LongLineField`
     - `TwoColumnLines`
     - any other repeated pattern from the design
   - For each component, describe:
     - props
     - layout behavior
     - how to keep them generic for reuse

Output format:
- Markdown sections with clear headings (`### Layout`, `### Right Panel Sections`, …).
- NO React/TSX code yet. Only textual spec + sample Tailwind class names.
- This file will be used as the source-of-truth to implement the UI in the next step.
