# Handoff: Modernised Visual Style — Weekly Flow Studio
## CSS variables + component layout updates

## Task for the AI coding tool
Apply **all changes in this file** to the existing codebase. Changes span two categories:
1. **CSS token overrides** in `src/index.css` — reduce shadow intensity, soften borders, lighten activity chip backgrounds, simplify the header.
2. **Component layout tweaks** in specific `.tsx` files — reduce border radii on surfaces, simplify the toolbar layout, compact the page-level grid.

Open `reference/ui_kit.html` in a browser to see the visual target before starting.

---

## PART 1 — `src/index.css` changes

### 1a. Shadows — reduce intensity (inside `:root { }`)

Find and replace these variable values:

```css
--app-panel-shadow:
    0 4px 16px rgba(15, 23, 42, 0.06),
    inset 0 1px 0 rgba(255, 255, 255, 0.92);

--app-panel-muted-shadow:
    0 3px 12px rgba(15, 23, 42, 0.05),
    inset 0 1px 0 rgba(255, 255, 255, 0.90);

--app-card-shadow:
    0 2px 8px rgba(15, 23, 42, 0.05),
    inset 0 1px 0 rgba(255, 255, 255, 0.90);

--app-card-hover-shadow:
    0 6px 20px rgba(15, 23, 42, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.94);

--app-shadow-button-primary:       0 2px 8px rgba(8, 145, 178, 0.22);
--app-shadow-button-primary-hover: 0 4px 14px rgba(8, 145, 178, 0.26);
--app-shadow-button-outline:       0 1px 4px rgba(15, 23, 42, 0.06);
--app-shadow-button-destructive:       0 2px 8px rgba(220, 38, 38, 0.18);
--app-shadow-button-destructive-hover: 0 4px 14px rgba(220, 38, 38, 0.22);

--app-shadow-field:
    inset 0 1px 0 rgba(255, 255, 255, 0.96),
    0 1px 4px rgba(15, 23, 42, 0.04);

--app-shadow-field-focus:
    inset 0 1px 0 rgba(255, 255, 255, 0.98),
    0 2px 8px rgba(15, 23, 42, 0.06);

--app-shadow-popover: 0 8px 24px rgba(15, 23, 42, 0.10);

--app-shadow-modal:
    0 8px 32px rgba(15, 23, 42, 0.12),
    inset 0 1px 0 rgba(255, 255, 255, 0.95);

--app-mobile-nav-shadow:
    0 4px 20px rgba(15, 23, 42, 0.10),
    inset 0 1px 0 rgba(255, 255, 255, 0.92);
```

### 1b. Borders — softer (inside `:root { }`)

```css
--app-border-subtle:     rgba(8, 145, 178, 0.10);
--app-border-strong:     rgba(8, 145, 178, 0.18);
--app-card-hover-border: rgba(8, 145, 178, 0.14);
```

### 1c. Overlay — lighter (inside `:root { }`)

```css
--app-overlay-bg: rgba(15, 23, 42, 0.10);
```

### 1d. Surface radii — smaller (inside `@layer components { }`)

Find the three surface class rules and update `border-radius`:

```css
.app-panel {
    border-radius: 1rem;        /* was: 2rem */
    /* all other properties unchanged */
}

.app-panel-muted {
    border-radius: 1rem;        /* was: 2rem */
    /* all other properties unchanged */
}

.app-card {
    border-radius: 0.875rem;    /* was: 1.5rem */
    /* all other properties unchanged */
}
```

Also update the `@media (max-width: 767px)` block at the bottom of the file:

```css
@media (max-width: 767px) {
    .app-panel,
    .app-panel-muted {
        border-radius: 0.875rem;   /* was: 1.6rem */
    }

    .app-card {
        border-radius: 0.75rem;    /* was: 1.25rem */
    }
    /* mobile nav rule unchanged */
}
```

### 1e. Application header — simplified (inside `@layer components { }`)

Find `.app-application-header` and replace its background and box-shadow:

```css
.app-application-header {
    position: sticky;
    top: 0;
    z-index: 30;
    border-bottom: 1px solid var(--app-border-subtle);
    background: rgba(255, 255, 255, 0.88);
    box-shadow: 0 1px 0 var(--app-border-subtle);
    backdrop-filter: blur(12px);
}
```

### 1f. Activity chip backgrounds — soft tints (inside `@layer components { }`)

For each `.app-activity-*` class, update **only** `--app-activity-soft`. Keep all other variables unchanged.

```css
.app-activity-red     { --app-activity-soft: rgba(220, 38, 38, 0.07); }
.app-activity-amber   { --app-activity-soft: rgba(217, 119, 6, 0.07); }
.app-activity-lime    { --app-activity-soft: rgba(101, 163, 13, 0.07); }
.app-activity-emerald { --app-activity-soft: rgba(5, 150, 105, 0.07); }
.app-activity-cyan    { --app-activity-soft: rgba(8, 145, 178, 0.07); }
.app-activity-blue    { --app-activity-soft: rgba(37, 99, 235, 0.07); }
.app-activity-violet  { --app-activity-soft: rgba(124, 58, 237, 0.07); }
.app-activity-fuchsia { --app-activity-soft: rgba(192, 38, 211, 0.07); }
.app-activity-pink    { --app-activity-soft: rgba(219, 39, 119, 0.07); }
.app-activity-slate   { --app-activity-soft: rgba(71, 85, 105, 0.07); }
.app-activity-stone   { --app-activity-soft: rgba(87, 83, 78, 0.07); }
```

### 1g. Self-host DM Sans (top of file)

Remove this line if present:
```css
@import url("https://fonts.googleapis.com/css2?family=DM+Sans:...");
```

Replace with:
```css
@font-face {
    font-family: "DM Sans";
    src: url("/fonts/DMSans-VariableFont_opsz_wght.ttf") format("truetype");
    font-weight: 100 1000;
    font-style: normal;
    font-display: swap;
}
@font-face {
    font-family: "DM Sans";
    src: url("/fonts/DMSans-Italic-VariableFont_opsz_wght.ttf") format("truetype");
    font-weight: 100 1000;
    font-style: italic;
    font-display: swap;
}
```

Then copy from this design system's `fonts/` folder into `public/fonts/`:
- `DMSans-VariableFont_opsz_wght.ttf`
- `DMSans-Italic-VariableFont_opsz_wght.ttf`

---

## PART 2 — Component layout changes

### 2a. `src/App.tsx` — page padding and gap

Find the outer content wrapper div (has classes `app-shell__content px-4 py-4 md:px-6 xl:px-8`) and reduce padding:

```tsx
// Before
className="app-shell__content px-4 py-4 md:px-6 xl:px-8"

// After
className="app-shell__content px-3 py-3 md:px-4 xl:px-5"
```

Find the inner flex container (has `mx-auto flex min-h-full max-w-540 gap-4 xl:gap-5`) and reduce gap:

```tsx
// Before
className="mx-auto flex min-h-full max-w-540 gap-4 xl:gap-5"

// After
className="mx-auto flex min-h-full max-w-540 gap-3"
```

Find the desktop sidebar `<aside>` and reduce its max width:

```tsx
// Before
className="flex min-h-0 w-[clamp(320px,31vw,520px)] max-w-130 flex-none"

// After
className="flex min-h-0 w-[clamp(280px,27vw,380px)] max-w-96 flex-none"
```

---

### 2b. `src/components/Header.tsx` — flatten the panel surface

The schedule header currently uses `app-panel` (large rounding, heavy glass). Change it to `app-card` for a lighter, flatter feel, and reduce padding:

```tsx
// Before
<header className="app-panel flex flex-col gap-3 p-4 md:flex-row md:items-start md:justify-between md:p-5">

// After
<header className="app-card flex flex-col gap-3 p-4 md:flex-row md:items-start md:justify-between">
```

Reduce the schedule name title size slightly on desktop:

```tsx
// Before
className="app-text-strong min-w-0 truncate text-[24px]/7 font-bold tracking-tight md:text-[30px]/9"

// After
className="app-text-strong min-w-0 truncate text-[22px]/7 font-bold tracking-tight md:text-[26px]/8"
```

---

### 2c. `src/components/Sidebar/Sidebar.tsx` — reduce padding

```tsx
// Before
className={cn(
    "app-panel flex h-full min-h-0 w-full flex-col overflow-hidden p-4 md:p-5",
    className
)}

// After
className={cn(
    "app-panel flex h-full min-h-0 w-full flex-col overflow-hidden p-3 md:p-4",
    className
)}
```

The view switcher inside the sidebar — reduce its margin-bottom and use `app-card` instead of `app-panel-muted`:

```tsx
// Before
<div className="mb-4 flex flex-wrap items-center justify-between gap-3">
    <div className="app-panel-muted flex items-center gap-2 p-1.5">

// After
<div className="mb-3 flex flex-wrap items-center justify-between gap-3">
    <div className="app-card flex items-center gap-2 p-1.5">
```

---

### 2d. `src/components/Grid/GridToolbar.tsx` — unified toolbar surface

On desktop, the toolbar renders multiple floating `app-panel-muted` blocks side-by-side. Wrap them in a single contained surface instead.

In `GridToolbarContent`, find the **desktop return** (the last `return` in the component, no layout check):

```tsx
// Before
return (
    <div className="flex flex-col gap-4 py-1 xl:flex-row xl:items-center">
        <GridSettingsControls className="flex-1" />
        <div className="flex flex-wrap items-center justify-end gap-2">
            <AddActivityAction />
            <ExpandGridAction ... />
        </div>
    </div>
);

// After
return (
    <div className="app-card flex flex-col gap-3 p-3 xl:flex-row xl:items-center">
        <GridSettingsControls className="flex-1" />
        <div className="flex flex-wrap items-center justify-end gap-2">
            <AddActivityAction />
            <ExpandGridAction ... />
        </div>
    </div>
);
```

Also in `GridSettingsControls`, the sub-sections (visible days, slot size, time range) each use `app-panel-muted` as their container. Change these to borderless inline groups:

```tsx
// Before — visible days section
<div className="app-panel-muted flex flex-1 flex-wrap items-center gap-2 p-3.5 xl:min-w-92">

// After
<div className="flex flex-1 flex-wrap items-center gap-2 rounded-lg border border-[color:var(--app-border-subtle)] bg-[color:var(--app-surface-soft)] px-3 py-2 xl:min-w-92">
```

```tsx
// Before — slot size section
<div className="app-panel-muted flex w-fit max-w-full flex-none flex-wrap items-center gap-3 self-start p-3.5 md:self-auto">

// After
<div className="flex w-fit max-w-full flex-none flex-wrap items-center gap-3 self-start rounded-lg border border-[color:var(--app-border-subtle)] bg-[color:var(--app-surface-soft)] px-3 py-2 md:self-auto">
```

```tsx
// Before — time range section
<div className="app-panel-muted flex flex-1 flex-wrap items-center gap-3 p-3.5 xl:min-w-72 xl:basis-auto">

// After
<div className="flex flex-1 flex-wrap items-center gap-3 rounded-lg border border-[color:var(--app-border-subtle)] bg-[color:var(--app-surface-soft)] px-3 py-2 xl:min-w-72 xl:basis-auto">
```

---

### 2e. `src/components/Sidebar/SummaryDashboard.tsx` — tighter spacing

```tsx
// Before
<div className="app-scrollbar flex h-full min-h-0 flex-col gap-4 p-2">

// After
<div className="app-scrollbar flex h-full min-h-0 flex-col gap-3 p-1">
```

Reduce padding inside stat cards:

```tsx
// Before (all four stat cards)
<div className="app-card p-4">

// After
<div className="app-card p-3">
```

Reduce padding in the week breakdown and recent templates cards:

```tsx
// Before
<div className="app-card p-4">

// After
<div className="app-card p-3">
```

---

## Verification checklist

After applying all changes, confirm visually against `reference/ui_kit.html`:

- [ ] Panels and cards have smaller corner radii (~16px panels, ~14px cards) — less bubbly
- [ ] Activity chips on the grid use soft tinted backgrounds, not vivid pastels
- [ ] The sticky application header has a single thin bottom border, no backdrop shadow cloud
- [ ] The schedule name header (`Header.tsx`) is a flat card, not a large floating panel
- [ ] The grid toolbar is a single contained card surface — not three floating sub-panels
- [ ] The sidebar is more compact with reduced padding
- [ ] Modal overlays are a barely-visible dim (10% black)
- [ ] DM Sans loads from `/fonts/` (no requests to fonts.googleapis.com in Network tab)
- [ ] All button and card hover states still work — shadows are just smaller, not removed

## Files changed summary

| File | Type of change |
|------|---------------|
| `src/index.css` | CSS variable overrides (shadows, borders, radii, activity colors, header, font) |
| `src/App.tsx` | Padding and gap reductions, sidebar width |
| `src/components/Header.tsx` | Surface class, padding, title size |
| `src/components/Sidebar/Sidebar.tsx` | Padding, view-switcher surface |
| `src/components/Sidebar/SummaryDashboard.tsx` | Spacing and card padding |
| `src/components/Grid/GridToolbar.tsx` | Toolbar wrapper surface, sub-section styling |
| `public/fonts/` | Add two DM Sans variable TTF files |
