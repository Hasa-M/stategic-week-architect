/**
 * Field configuration definitions for various entity forms.
 *
 * This module contains all the field configurations used by FormModal
 * to dynamically render forms for different entity types (Activities, Notes, etc.).
 *
 * Each configuration array defines the structure, labels, validation rules,
 * and input types for a specific entity's form.
 */

import type { Activity, Note, Color } from "@/types";
import type { FormFieldConfig } from "./components/Forms/FormField";

// =============================================================================
// SHARED OPTIONS
// =============================================================================

/**
 * All available color options for activities and notes.
 * Derived from the Color type in types.ts.
 */
const COLOR_OPTIONS: { value: Color; label: string }[] = [
    { value: "red", label: "Red" },
    { value: "amber", label: "Amber" },
    { value: "lime", label: "Lime" },
    { value: "emerald", label: "Emerald" },
    { value: "cyan", label: "Cyan" },
    { value: "blue", label: "Blue" },
    { value: "violet", label: "Violet" },
    { value: "fuchsia", label: "Fuchsia" },
    { value: "pink", label: "Pink" },
    { value: "slate", label: "Slate" },
    { value: "stone", label: "Stone" },
];

// =============================================================================
// ACTIVITY FIELDS
// =============================================================================

/**
 * Field configuration for creating/editing Activity templates.
 *
 * @example
 * ```tsx
 * <FormModal<Activity>
 *   title="Add Activity"
 *   fields={activityFields}
 *   onSubmit={handleSubmit}
 * >
 *   <Button>Add</Button>
 * </FormModal>
 * ```
 */
const activityFields: FormFieldConfig<Activity>[] = [
    {
        name: "title",
        label: "Title",
        type: "text",
        placeholder: "Enter activity title",
        required: true,
    },
    {
        name: "description",
        label: "Description",
        type: "textarea",
        placeholder: "Describe the activity",
        required: true,
    },
    {
        name: "color",
        label: "Color",
        type: "select",
        options: COLOR_OPTIONS,
        placeholder: "Select a color",
        required: true,
        showColorIndicator: true,
    },
    // TODO: Add subfactors field after implementing nested form fields
    // {
    //     name: "subfactors",
    //     type: "array", // Would need new field type for array of objects
    // },
];

// =============================================================================
// NOTE FIELDS
// =============================================================================

/**
 * Field configuration for creating/editing Notes.
 *
 * @example
 * ```tsx
 * <FormModal<Note>
 *   title="Add Note"
 *   fields={noteFields}
 *   onSubmit={handleSubmit}
 * >
 *   <Button>Add Note</Button>
 * </FormModal>
 * ```
 */
const noteFields: FormFieldConfig<Note>[] = [
    {
        name: "title",
        label: "Title",
        type: "text",
        placeholder: "Note title",
        required: true,
    },
    {
        name: "content",
        label: "Content",
        type: "textarea",
        placeholder: "Write your note here...",
        required: true,
    },
    {
        name: "color",
        label: "Color",
        type: "select",
        options: COLOR_OPTIONS,
        placeholder: "Select a color",
        required: true,
        showColorIndicator: true,
    },
];

// =============================================================================
// EXPORTS
// =============================================================================

export { activityFields, noteFields, COLOR_OPTIONS };
