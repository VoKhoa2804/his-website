You are a senior front-end architect and code reviewer.

Goal:
Validate that the new `clinic` feature follows project architecture and best practices.

Use workspace context to inspect:

- `src/features/clinic/**`
- `src/features/work-shift/**`
- `src/app/routes/App.tsx`
- `src/layouts/sidebar.tsx`
- `src/api/**`
- `src/shared/ui/**`
- `src/app/store.ts`

Checks to perform:

1. **Folder & file structure**
   - `src/features/clinic/` has subfolders: `api`, `config`, `hooks`, `model`, `ui`, and `index.ts`.
   - File naming and exports follow the same conventions as `work-shift`.
   - `index.ts` re-exports main components/hooks consistently.

2. **API layer**
   - `clinic.api.ts` (or equivalent) uses the shared `baseApi` / axios instance.
   - Request/Response DTOs are properly typed in `model/clinic.types.ts` or similar.
   - Error handling mirrors patterns from `work-shift` feature.

3. **Hooks & data flow**
   - Hooks like `useClinicList`, `useClinicForm` (or equivalent) exist.
   - Data flow: UI → hooks → API → (store/RTK query) → UI is clean and similar to `work-shift`.
   - Pagination/filter logic, if implemented, lives in hooks or a model layer, not buried in JSX.

4. **Routing & navigation**
   - Clinic route is registered in `src/app/routes/App.tsx` using existing patterns (ProtectedRoute, lazy imports, etc.).
   - Sidebar/menu entry for Clinic exists in `src/layouts/sidebar.tsx` and matches pattern of other entries (icon, label, path, permission).

5. **Code style & reusability**
   - UI components reuse `@/shared/ui/*` where appropriate.
   - Components are not excessively large; reusable subcomponents are extracted.
   - Naming is consistent and meaningful.
   - Types are strict (avoid `any`, correct optional fields for Clinic domain).

6. **Issues list**
   - For each issue, mark severity:
     - HIGH: breaks architecture or causes runtime errors.
     - MEDIUM: makes code harder to maintain.
     - LOW: style/naming/minor consistency.

Output format:

### 1. Structure validation (PASS / NEEDS FIX)
- ...

### 2. API & hooks (PASS / NEEDS FIX)
- ...

### 3. Routing & navigation (PASS / NEEDS FIX)
- ...

### 4. Code quality issues (list with severity + explanation)

### 5. Patch suggestions
Provide 3–5 `diff` snippets showing how to fix the most important problems.
