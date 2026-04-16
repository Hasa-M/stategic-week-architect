/**
 * Field configuration definitions for various entity forms.
 *
 * This module contains all the field configurations used by FormModal
 * to dynamically render forms for different entity types (Activities, Notes, etc.).
 *
 * Each configuration array defines the structure, labels, validation rules,
 * and input types for a specific entity's form.
 */

import type { ActivityDraft, NoteDraft, Color } from "@/types";
import type { FormFieldConfig } from "./components/Forms/FormField";

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
const activityFields: FormFieldConfig<ActivityDraft>[] = [
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
type ActivityWithPropagate = ActivityDraft & { toPropagate: boolean };

const activityFieldsForEdit: FormFieldConfig<ActivityWithPropagate>[] = [
    ...activityFields,
    {
        name: "toPropagate",
        type: "checkbox",
        label: "Apply changes to placed activities",
        defaultChecked: true,
    },
];

const noteFields: FormFieldConfig<NoteDraft>[] = [
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

export { activityFields, activityFieldsForEdit, noteFields, COLOR_OPTIONS };
