import { Plus } from "lucide-react";
import { useMemo } from "react";

import { WeeklyAppButton } from "./Button/Button";
import TemplateCard from "./Card/TemplateCard";
import { getColorClass } from "@/utils";
import { FormModal } from "./Forms/FormModal";
import type { Activity } from "@/types";
import { activityFields } from "@/fieldConfigs";
import { useDispatch, useScheduleContext } from "@/context/hooks";

/**
 * TemplatesBar - Displays activity templates with an add button.
 *
 * Shows a horizontal list of activity template cards that can be
 * dragged onto the schedule grid. Includes a FormModal for adding
 * new templates.
 */
export default function TemplatesBar() {
    const schedule = useScheduleContext();
    const dispatch = useDispatch();

    // Memoize template list to avoid unnecessary re-renders
    const templateList = useMemo(() => {
        return Object.values(schedule?.templates ?? {});
    }, [schedule?.templates]);

    return (
        <ul className="pt-6 pb-0 px-0 flex flex-row flex-wrap gap-4 items-center">
            {/* Add new template button with form modal */}
            <FormModal<Activity>
                title="Add Template"
                description="Create a new activity template that can be placed on your schedule."
                fields={activityFields}
                onSubmit={(data) =>
                    dispatch({ type: "ADD_TEMPLATE", payload: data })
                }
            >
                <WeeklyAppButton size="icon-sm" className="rounded-full">
                    <Plus />
                </WeeklyAppButton>
            </FormModal>

            {/* Template cards list */}
            {templateList.map((template) => (
                <li key={template.templateId}>
                    <TemplateCard
                        colorClass={getColorClass(template.color)}
                        label={template.title}
                    />
                </li>
            ))}
        </ul>
    );
}
