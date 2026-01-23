import type { Activity } from "@/types";
import type { FormFieldConfig } from "./components/Forms/FormField";

//activity
const activityFields: FormFieldConfig<Activity>[] = [
    {
        name: "title",
        label: "Title",
        type: "text",
        required: true,
    },
    {
        name: "description",
        label: "Description",
        type: "textarea",
        required: true,
    },
    {
        name: "color",
        label: "Color",
        type: "select",
        options: [
            { value: "red", label: "Red" },
            { value: "lime", label: "Lime" },
        ],
        required: true,
    },
    //  { TODO after the process is solid and works
    //     name: "subfactors",
    //  },
];

export { activityFields };
