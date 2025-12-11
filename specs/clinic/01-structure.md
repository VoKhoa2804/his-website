You are a senior front-end architect working on a modular React + TypeScript project.

Project context (very important):
- Feature-based architecture
- Redux Toolkit
- Axios base API with interceptors (`src/api/baseApi.ts`, `src/api/setupInterceptors.ts`)
- shadcn/ui + custom UI components in `src/shared/ui`
- Shared types/domain models in `src/entities` and `src/shared/types`

Existing structure:

src/
  api/
  app/
    routes/
    store.ts
  entities/
  features/
    auth/
    shortcuts/
    work-shift/
  layouts/
  shared/
    ui/
    utils/

Goal of this spec:
Design a new feature **clinic** whose structure is **consistent with `work-shift` feature** and reusable in the project.

Use workspace context to scan:

- `src/features/work-shift/**`
- `src/api/**`
- `src/app/store.ts`
- `src/shared/types/**`

Deliverables of this spec (no code yet, only plan):

1. **Architecture summary for `work-shift`**
   - Folder structure (api, config, hooks, model, ui, index.ts)
   - Responsibility of each folder
   - Data flow: UI → hooks → API → store → UI
   - How API layer is built (baseApi, types, error handling)
   - How models/DTOs are defined and reused
   - How UI components are layered (page, subcomponents, shared/ui usage)
   - How config is organized (routes, menu/permission, constants)
   - Where validation/pagination/filtering logic lives

2. **Clinic feature structure proposal**
   Target structure:

   src/features/clinic/
     api/
     config/
     hooks/
     model/
     ui/
     index.ts

   For each folder, define:
   - File names
   - Responsibility of each file
   - Which parts follow the `work-shift` pattern exactly
   - Where Redux slice / RTK query / hooks will live (if used)

3. **File list with short description**
   A concrete list like:

   - `src/features/clinic/api/clinic.api.ts` – axios calls for clinic endpoints
   - `src/features/clinic/model/clinic.types.ts` – domain types and DTOs
   - `src/features/clinic/ui/ClinicListPage.tsx` – main page component
   - `src/features/clinic/ui/ClinicFormDialog.tsx` – dialog for create/update
   - `src/features/clinic/config/clinic.routes.ts` – route config for this feature
   - `src/features/clinic/config/clinic.menu.ts` – sidebar/menu config
   - `src/features/clinic/hooks/useClinicList.ts` – list + filters + pagination hook
   - `src/features/clinic/hooks/useClinicForm.ts` – form logic hook
   - `src/features/clinic/index.ts` – re-exports for this feature

4. **Integration points**
   - Where to inject routes in `src/app/routes/App.tsx`
   - Where to inject menu item in `src/layouts/sidebar.tsx`
   - Any required changes to store or shared types

Output format:
- Use headings and bullet lists.
- Mark clearly which patterns are “MUST follow work-shift” vs “clinic specific”.
- Do **NOT** write any implementation code in this spec, only architecture + file list.
