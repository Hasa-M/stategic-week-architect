# Strategic Weekly Architect

A weekly schedule planning application designed to help users organize activities with a focus on strategic time management. Create reusable activity templates, place them on a visual weekly grid, and manage notes — all with a modern, type-safe React architecture.

## Features

- **Activity Templates** — Create reusable templates with title, description, color coding, and subfactors
- **Weekly Schedule Grid** — Visual calendar interface for scheduling activities across Monday-Sunday
- **Time Slot Management** — Configurable time slots (15, 30, 60, 90, 120, 150, 180, 240 minutes)
- **Color-Coded Activities** — 11 color options for visual organization
- **Notes System** — Sidebar for reminders and tasks
- **Persistent State** — LocalStorage integration for automatic save/restore
- **Template Propagation** — Smart update logic when editing templates

## Application Layout

```
┌─────────────────────────────────────────────────┬──────────┐
│  Header (Title + "View Notes" toggle)           │          │
├─────────────────────────────────────────────────┤ Sidebar  │
│  Templates Bar (horizontal scroll)              │ (Notes / │
├─────────────────────────────────────────────────┤Dashboard)│
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
    | { type: "ADD_TEMPLATE"; payload: Activity }
    | { type: "EDIT_TEMPLATE"; payload: { template: Activity; propagate: boolean } }
    | { type: "DELETE_TEMPLATE"; payload: string }
    | { type: "PLACE_ACTIVITY"; payload: PlacedActivity }
    | { type: "ADD_NOTE"; payload: Note }
    // ... more actions
```

## Form System

The `FormModal` component uses a polymorphic pattern to dynamically render forms from field configurations:

```typescript
const activityFields: FormFieldConfig<Activity>[] = [
    { name: "title", type: "text", label: "Title", required: true },
    { name: "description", type: "textarea", label: "Description" },
    { name: "color", type: "select", options: COLOR_OPTIONS, showColorIndicator: true },
];

<FormModal<Activity>
    title="Add Activity"
    fields={activityFields}
    onSubmit={handleSubmit}
>
    <Button>Add Activity</Button>
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

