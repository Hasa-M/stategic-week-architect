# Strategic Weekly Architect Guidelines

- This repository is a weekly scheduling and time-planning app. Keep the domain centered on schedules, templates, placed activities, notes, days, and time slots.
- The app is currently frontend-only. Do not introduce Node.js, NestJS, database, authentication, or API code unless explicitly requested.
- Do not treat placeholder UI as finished product behavior. Incomplete features should be hidden, replaced, or clearly marked in code and docs.
- Preserve the React Context plus `useReducer` state flow in `src/context/`. State changes should go through typed reducer actions.
- Keep persistence centralized in `src/context/scheduleProvider.tsx`. Presentational components must not write to `localStorage` directly.
- Favor explicit domain types in `src/types.ts`. Keep template data, placed activity data, and note data conceptually separate even when fields overlap.
- When changing forms, keep field configs, submit payloads, and reducer payload types aligned.
- Keep primitive UI wrappers under `src/components/ui/` thin and reusable. Do not add app-specific domain logic, hidden serialization hacks, or one-off business behavior to primitive files.
- Prefer shared tokens and variants from `src/index.css` and `src/components/ui/button.tsx` over hardcoded one-off colors or duplicated interaction styles.
- Only create app-level wrappers when they add real value. Avoid pass-through wrappers that only rename a primitive.
- Prefer `@/` imports for cross-folder imports. Use relative imports only when they stay inside the same local feature area and are clearly shorter.
- Keep `README.md`, `components.json`, and other project metadata aligned with the actual implementation and folder structure.
- Before larger refactors or feature work, read [docs/architecture.md](../docs/architecture.md).