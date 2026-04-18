# Strategic Weekly Architect

A weekly schedule planning application designed to help users organize activities with a focus on strategic time management. Create reusable activity templates, place them on a visual weekly grid, and manage activity-linked notes — all with a modern, type-safe React architecture.

## Features

- **Activity Templates** — Create reusable templates with title, description, color coding, and subfactors
- **Weekly Schedule Grid** — Visual calendar interface that renders placed activities across visible days
- **Grid Controls** — Filter visible days, change slot duration, and place activities directly from the toolbar
- **Color-Coded Activities** — 11 color options for visual organization
- **Notes System** — Sidebar for notes linked to placed activities
- **Schedule Summary** — Sidebar metrics for planned hours, busiest day, templates, and notes
- **Persistent State** — LocalStorage integration for automatic save/restore
- **Template Propagation** — Smart update logic when editing templates

## Application Layout

```
┌─────────────────────────────────────────────────┬──────────┐
│  Header (Title + toggle view)                    │          │
├─────────────────────────────────────────────────┤ Sidebar  │
│  Templates Bar (horizontal scroll)              │ (Notes / │
├─────────────────────────────────────────────────┤Summary)  │
│  Grid Toolbar                                   │          │
│    [Days Filter] [Time Slots] [+ Add Activity]  │          │
├─────────────────────────────────────────────────┤          │
│  Schedule Grid                                  │          │
└─────────────────────────────────────────────────┴──────────┘
```

## Tech Stack

### Frontend (In Progress)

| Technology | Purpose |
|------------|---------|
| React 19 | UI framework |
| TypeScript 5.9 | Type safety |
| Vite 7 | Build tool & dev server |
| Tailwind CSS 4 | Utility-first styling |
| Radix UI | Accessible primitives (Dialog, Select, Checkbox, etc.) |
| Lucide React | Icons |
| Class Variance Authority | Component variants |

### Backend (Not Actually Developed)

| Technology | Purpose |
|------------|---------|
| NestJS | Backend framework with TypeScript |
| WebAssembly (C) | Performance-critical computations |

The backend will use NestJS for the API layer. WASM modules written in C will handle data-heavy operations (schedule optimization, conflict detection, analytics calculations) as a proof of concept for hybrid JS/WASM architecture.


## State Management

The app uses React Context + useReducer for centralized state management (type-first development approach):

```typescript
// Reducer actions
type ScheduleAction =
    | { type: "ADD_TEMPLATE"; payload: ActivityDraft }
    | { type: "EDIT_TEMPLATE"; payload: { activity: Activity; toPropagate: boolean } }
    | { type: "DELETE_TEMPLATE"; payload: string }
    | { type: "PLACE_ACTIVITY"; payload: PlacedActivityDraft }
    | { type: "ADD_NOTE"; payload: NoteDraft }
    // ... more actions
```

## Form System

The `FormModal` component uses a polymorphic pattern to dynamically render forms from field configurations:

```typescript
const activityFields: FormFieldConfig<ActivityDraft>[] = [
    { name: "title", type: "text", label: "Title", required: true },
    { name: "description", type: "textarea", label: "Description" },
    { name: "color", type: "select", options: COLOR_OPTIONS, showColorIndicator: true },
];

<FormModal<ActivityDraft>
    title="Add Template"
    fields={activityFields}
    onSubmit={handleSubmit}
>
    <Button>Add Template</Button>
</FormModal>
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/strategic-weekly-architect.git
cd strategic-weekly-architect

# Install dependencies
npm install

# Start development server
npm run dev
```

### Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | TypeScript check + production build |
| `npm run lint` | Run ESLint |
| `npm run preview` | Preview production build |

## Roadmap

### Frontend
- [x] Schedule grid visualization (main calendar view)
- [ ] Drag-and-drop activity placement
- [x] Grid toolbar (days filter, time slots, add activity)
- [x] Notes sidebar implementation
- [x] Template card edit/delete dialogs
- [x] Schedule summary sidebar
- [ ] Subfactors nested form field

### Backend
- [ ] NestJS project setup
- [ ] REST API for schedules, templates, notes
- [ ] User authentication (JWT)
- [ ] Database integration (PostgreSQL)
- [ ] WASM module: schedule conflict detection
- [ ] WASM module: time analytics calculations
- [ ] Cloud sync

## License

MIT
