import { Plus } from "lucide-react";
import { useContext, useMemo } from "react";

import { WeeklyAppButton } from "./Button/Button";
import TemplateCard from "./Card/TemplateCard";
import { getColorClass } from "@/utils";
import { ScheduleContext } from "@/context/scheduleContext";

export default function TemplatesBar() {
    const schedule = useContext(ScheduleContext);
    console.log(schedule);

    const templateList = useMemo(() => {
        return Object.values(schedule?.templates ?? {});
    }, [schedule?.templates]);

    return (
        <ul className="pt-6 pb-0 px-0 flex flex-row flex-wrap gap-4 items-center ">
            <WeeklyAppButton size="icon-sm" className="rounded-full">
                <Plus />
            </WeeklyAppButton>

            {templateList.map((template) => (
                <TemplateCard
                    key={template.templateId}
                    colorClass={getColorClass(template.color)}
                    label={template.title}
                />
            ))}
        </ul>
    );
}
