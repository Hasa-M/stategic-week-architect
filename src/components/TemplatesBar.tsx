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
            className={cn(
                "app-card relative flex flex-col gap-2.5 px-4 py-3.5",
                className
            )}
            aria-label="Templates"
        >
            {onClose ? (
                <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    className="absolute top-3 right-3 size-8 rounded-xl shadow-none"
                    onClick={onClose}
                    aria-label="Hide templates"
                >
                    <X className="size-4" />
                </Button>
            ) : null}

            <div className={cn("min-w-0 space-y-1", onClose && "pr-10")}>
                <p className="app-text-strong text-sm font-semibold">Templates</p>
                <p className="app-text-muted text-[11px]">Reusable activities</p>
            </div>

            <ul className="flex flex-wrap items-center gap-2.5">
                <li>
                    <FormModal<ActivityDraft>
                        title="Add Template"
                        description="Create a new activity template that can be placed on your schedule."
                        fields={activityFields}
                        onSubmit={(data) =>
                            dispatch({ type: "ADD_TEMPLATE", payload: data })
                        }
                    >
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="h-8 rounded-full px-3.5 text-xs font-semibold shadow-none"
                        >
                            <Plus className="size-4" />
                            Add
                        </Button>
                    </FormModal>
                </li>

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
