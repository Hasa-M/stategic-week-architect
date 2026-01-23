import { Plus } from "lucide-react";
import { useMemo } from "react";

import { WeeklyAppButton } from "./Button/Button";
import TemplateCard from "./Card/TemplateCard";
import { getColorClass } from "@/utils";
import { FormModal } from "./Forms/FormModal";
import type { Activity } from "@/types";
import { activityFields } from "@/fielsLists";
import { useDispatch, useScheduleContext } from "@/context/hooks";

export default function TemplatesBar() {
    const schedule = useScheduleContext();
    const dispatch = useDispatch();

    const templateList = useMemo(() => {
        return Object.values(schedule?.templates ?? {});
    }, [schedule?.templates]);

    return (
        <ul className="pt-6 pb-0 px-0 flex flex-row flex-wrap gap-4 items-center ">
            <FormModal<Activity>
                title="Add Template"
                description="Add new template"
                fields={activityFields}
                onSubmit={(data: Activity) =>
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
                        colorClass={getColorClass(template.color)}
                        label={template.title}
                    />
                </li>
            ))}
        </ul>
    );
}
