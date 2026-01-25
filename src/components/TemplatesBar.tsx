import { Plus } from "lucide-react";
import { useCallback, useMemo } from "react";

import { WeeklyAppButton } from "./Button/Button";
import TemplateCard from "./Card/TemplateCard";
import { FormModal } from "./Forms/FormModal";
import type { Activity } from "@/types";
import { activityFields } from "@/fieldConfigs";
import { useDispatch, useScheduleContext } from "@/context/hooks";

export default function TemplatesBar() {
    const schedule = useScheduleContext();
    const dispatch = useDispatch();

    const templateList = useMemo(() => {
        return Object.values(schedule?.templates ?? {});
    }, [schedule?.templates]);

    const handleEditTemplate = useCallback(
        (data: Activity & { toPropagate?: boolean }) => {
            dispatch({
                type: "EDIT_TEMPLATE",
                payload: {
                    activity: data,
                    toPropagate: data.toPropagate ?? false,
                },
            });
        },
        [dispatch]
    );

    const handleDeleteTemplate = useCallback(
        (templateId: string) => {
            dispatch({ type: "DELETE_TEMPLATE", payload: templateId });
        },
        [dispatch]
    );

    return (
        <ul className="pt-6 pb-0 px-0 flex flex-row flex-wrap gap-4 items-center">
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

            {templateList.map((template) => (
                <li key={template.templateId}>
                    <TemplateCard
                        template={template}
                        onEdit={handleEditTemplate}
                        onDelete={handleDeleteTemplate}
                    />
                </li>
            ))}
        </ul>
    );
}
