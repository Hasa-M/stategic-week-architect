# Strategic Weekly Architect Architecture

This document describes the current intended architecture of the app, the parts that are already working, and the structural problems that should not be repeated.

## Product Scope

Strategic Weekly Architect is a weekly planning application.

The core domain is:

- Schedule metadata
- Activity templates
- Placed activities on a weekly grid
- Notes
- Day and time-slot configuration

This repository is currently a frontend-only React and TypeScript app. Backend, database, authentication, and NestJS work are future concerns and should not shape the current frontend architecture unless a task explicitly asks for that planning.

## Current Status

The codebase is part working product and part scaffold.

Working or mostly working areas:

- Template CRUD through the reducer and forms
- Note CRUD through the reducer and forms, with notes linked to placed activities
- Local persistence through `localStorage`
- Generic modal-based forms driven by field configuration
- A real schedule grid that renders placed activities
- A real grid toolbar with day filtering, visible time-range controls, slot-size changes, and activity placement
- A real summary sidebar with schedule metrics instead of placeholder finance content

Incomplete or placeholder areas:

- Drag and drop placement is still not implemented.
- Nested form support for complex `subfactors` editing is still not implemented.
- The placed-activity editing surface is still minimal compared with template and note editing.

When making changes, prefer making the app honest over making the scaffolding look polished.

## Core State Architecture

The main application state lives in the context and reducer layer:

- [src/context/scheduleContext.ts](../src/context/scheduleContext.ts)
- [src/context/scheduleProvider.tsx](../src/context/scheduleProvider.tsx)
- [src/context/scheduleReducer.ts](../src/context/scheduleReducer.ts)
- [src/context/hooks.ts](../src/context/hooks.ts)

This is the current intended ownership model:

- The reducer owns state transitions.
- The provider owns persistence lifecycle.
- UI components dispatch actions and render state.
- UI components should not duplicate persistence or global lifecycle logic.

### Important Rule

[src/context/scheduleProvider.tsx](../src/context/scheduleProvider.tsx) should remain the single owner of `localStorage` synchronization. If a component needs saved state behavior, the correct fix is usually in the provider or storage service, not in the component.

## Domain Model

The main types are defined in [src/types.ts](../src/types.ts).

Important concepts:

- `Activity` is the template-level concept.
- `PlacedActivity` is a scheduled instance on a day and time range.
- `Note` is sidebar content associated with a placed activity through `activityId`.
- `DaysGrid` defines the visible time grid.

Some fields overlap between template and placed activity data, but they should still be treated as different concepts. If future refactors make those types more explicit, that is a positive direction.

## Form System

The current form pattern is:

- [src/components/Forms/FormModal.tsx](../src/components/Forms/FormModal.tsx)
- [src/components/Forms/FormField.tsx](../src/components/Forms/FormField.tsx)
- [src/fieldConfigs.ts](../src/fieldConfigs.ts)

This pattern is worth preserving because it keeps simple forms fast to build. However, there are limits:

- It currently serializes through `FormData` based on field definitions, which is acceptable for simple fields but still brittle for more complex data.
- Nested structures such as `subfactors` are not properly supported yet.
- Field config, form output, and reducer payload types must stay aligned whenever a form changes.

## UI Layering

The UI layer currently mixes three concerns:

- Primitive wrappers around Radix or shadcn-style components
- App-level wrappers and composed components
- Feature-specific scheduling UI

That mixing is the main reason the UI feels messy.

### Intended Layer Boundaries

Primitive UI files should stay thin:

- They should provide reusable markup, structure, and interaction behavior.
- They should not contain scheduling-domain logic.
- They should not contain hidden serialization workarounds unless there is no cleaner integration path.
- They should not accumulate one-off styling rules that belong in shared variants or tokens.

App-level wrappers should exist only when they add real value:

- shared domain wording
- shared app-level defaults
- meaningful composition

Pass-through wrappers with no real value should be removed or avoided.

## Styling Conventions

The main design tokens currently live in [src/index.css](../src/index.css).

Prefer:

- shared tokens such as `primary`, `primary-hover`, `background`, and `background-accent`
- shared button variants in [src/components/ui/button.tsx](../src/components/ui/button.tsx)
- consistent interaction states across inputs, selects, buttons, and dialogs

Avoid:

- hardcoded one-off color choices in individual primitives when the same idea already has a shared token or variant
- duplicated modal shell class blocks across multiple files
- visual styles that imply dark-mode or theming support while also hardcoding backgrounds that break those semantics

## Import and File Organization

Prefer `@/` imports for cross-folder imports.

Use relative imports only when they stay local to the same feature area and are noticeably clearer.

Keep tooling metadata aligned with the repo structure:

- [components.json](../components.json) should reflect real aliases and real generated component locations.
- README claims should match actual implementation status.

## Known Structural Problems To Avoid Repeating

These issues are real and should not become patterns for future work:

- Placeholder product areas presented like finished features
- Domain-inappropriate placeholder UI used as if it were real app design
- Persistence logic leaking into presentational components
- Primitive UI wrappers carrying app-specific behavior
- Duplicated styling logic for dialogs and similar shells
- Mixed import conventions without a clear rule

## Near-Term Cleanup Priorities

If the app continues evolving from this point, these are the most useful cleanup targets:

1. Keep persistence in the provider only and remove any future duplicated storage behavior from components.
2. Continue simplifying the primitive UI layer, especially where forms need richer field types.
3. Align `components.json`, imports, and folder conventions with the actual structure you want to keep.
4. Improve placed-activity editing and interactions without leaking that logic into primitives.
5. Keep `README.md` and this document aligned with the real implementation state.

## How Copilot Should Use This Document

Use this document as the source of truth for:

- project domain vocabulary
- current architectural boundaries
- what is incomplete versus implemented
- which structural mistakes should not be repeated

If the code and this document drift apart, update the document as part of the same work instead of letting the drift accumulate.