import { Plus, X } from "lucide-react";
import { useCallback, useMemo } from "react";

import { Button } from "@/components/ui/button";
import TemplateCard from "./Card/TemplateCard";
import { FormModal } from "./Forms/FormModal";
import type { Activity, ActivityDraft } from "@/types";
import { activityFields } from "@/fieldConfigs";
import { useDispatch, useUserContext } from "@/context/hooks";
import { cn } from "@/lib/utils";

type TemplatesBarProps = {
    className?: string;
    id?: string;
    onClose?: () => void;
};

export default function TemplatesBar({
    className,
    id,
    onClose,
}: TemplatesBarProps) {
    const user = useUserContext();
    const dispatch = useDispatch();

    const templateList = useMemo(() => {
        return Object.values(user.templates);
    }, [user.templates]);

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
        <section
            id={id}
            className={cn("app-panel-muted flex flex-col gap-3 p-3.5", className)}
            aria-label="Templates"
        >
            <div
                className={cn(
                    "w-full gap-3",
                    onClose
                        ? "grid grid-cols-[minmax(0,1fr)_auto] items-center"
                        : "flex flex-col"
                )}
            >
                <div className="min-w-0 flex flex-col">
                    <p className="app-text-strong text-sm font-semibold">Templates</p>
                    <p className="app-text-muted text-xs">
                        Create, edit, and place reusable activities on the weekly grid.
                    </p>
                </div>

                {onClose ? (
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        className="size-8 shrink-0 self-center justify-self-end rounded-xl"
                        onClick={onClose}
                        aria-label="Hide templates"
                    >
                        <X className="size-4" />
                    </Button>
                ) : null}
            </div>

            <ul className="flex flex-row flex-wrap items-center gap-3">
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
        </section>
    );
}
