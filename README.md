# Strategic Weekly Architect

Strategic Weekly Architect is a weekly planning app for organizing reusable activity templates, scheduling them across one or more weekly plans, and attaching notes to specific work blocks.

The repository is currently frontend-only. The planner works locally with persistent browser storage today; backend APIs, database persistence, and authentication are the next planned delivery phase and are not implemented yet.

## Current Status

- Functional React and TypeScript planner with reducer-driven state
- Multiple schedules supported from a shared user workspace
- Responsive desktop, tablet, and mobile planner layouts
- Local persistence is handled through `localStorage`
- Backend, database, and authentication work are still upcoming

## Current Features

- **Shared activity templates** with title, description, color, and subfactors
- **Multiple schedules** with create, switch, rename, and delete flows
- **Weekly grid planner** for rendering placed activities across visible days
- **Grid controls** for visible days, visible hour range, and slot size (`15`, `30`, or `60` minutes)
- **Activity placement flow** from the toolbar, including optional note creation while placing an activity and a 5-minute time picker
- **Placed activity editing** for time, day, template selection, notes, and deletion, with the same hour/minute time picker
- **Direct rescheduling** inside the grid on desktop and touch devices
- **Notes sidebar** linked to placed activities
- **Summary dashboard** with planned hours, busiest day, visible week breakdown, template count, and note count
- **Grid focus mode** to expand the planner to a full-page working view
- **Theme switching** with light, high-contrast, and dark modes
- **Template propagation** so template edits can update already placed activities when requested
- **Persistent user state** centralized in the provider and storage service

## Architecture Snapshot

- **Frontend stack**: React 19, TypeScript 5.9, Vite 7, Tailwind CSS 4, Radix UI, Lucide React, Class Variance Authority
- **State management**: React Context + `useReducer` in `src/context/`
- **Persistence**: centralized in `src/context/scheduleProvider.tsx` through `src/services/storageService.ts`
- **Core domain types**: `src/types.ts`
- **Form system**: config-driven modals built from `src/components/Forms/` and `src/fieldConfigs.ts`
- **Architecture notes**: see `docs/architecture.md`

The persisted root model is a frontend-safe `User` state that owns the active schedule id, shared templates, theme selection, and the collection of schedules.

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
git clone https://github.com/your-username/strategic-weekly-architect.git
cd strategic-weekly-architect
npm install
npm run dev
```

### Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start the Vite development server |
| `npm run build` | Run the TypeScript build and production bundle |
| `npm run lint` | Run ESLint |
| `npm run preview` | Preview the production build |

## Delivery Status

### Done

- [x] Shared template CRUD
- [x] Multi-schedule state with active schedule switching
- [x] Schedule rename and delete flows
- [x] Weekly grid rendering
- [x] Grid settings controls for days, hours, and slot size
- [x] Place, edit, delete, and drag placed activities
- [x] Activity-linked notes
- [x] Summary dashboard
- [x] Responsive planner layout
- [x] Theme persistence
- [x] Local browser persistence

### Next

- [ ] Create the backend foundation for users, schedules, templates, placed activities, and notes
- [ ] Add database persistence for the planning domain
- [ ] Introduce authentication and user-owned data access
- [ ] Replace local-only persistence with authenticated API sync
- [ ] Add server-side validation and ownership rules

### Known Gaps And Later Work

- [ ] Drag templates directly from the templates bar into the grid
- [ ] Rich nested editing for template subfactors
- [ ] Dashboard widget customization

## Planned Backend Track

The next implementation phase is expected to cover:

- A backend application layer for the planner domain
- A relational database for persistent user, schedule, activity, and note data
- Authentication so schedules and templates become user-scoped instead of browser-scoped
- A migration path from frontend-only storage to API-backed persistence

This README will be updated again once the backend structure, database choice, and authentication flow are implemented in the repository.

## License

MIT
