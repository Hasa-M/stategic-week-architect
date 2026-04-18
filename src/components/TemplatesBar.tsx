import { Plus } from "lucide-react";
import { useCallback, useMemo } from "react";

import { Button } from "@/components/ui/button";
import TemplateCard from "./Card/TemplateCard";
import { FormModal } from "./Forms/FormModal";
import type { Activity, ActivityDraft } from "@/types";
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
        <ul className="app-panel-muted flex flex-row flex-wrap items-center gap-3 p-3.5">
            <FormModal<ActivityDraft>
                title="Add Template"
                description="Create a new activity template that can be placed on your schedule."
                fields={activityFields}
                onSubmit={(data) =>
                    dispatch({ type: "ADD_TEMPLATE", payload: data })
                }
            >
                <Button size="icon-sm" className="rounded-full">
                    <Plus />
                </Button>
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
