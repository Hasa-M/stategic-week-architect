import type { Activity, ActivityDraft } from "@/types";
import { getColorStyles } from "@/utils";
import { FormModal } from "@/components/Forms/FormModal";
import { activityFieldsForEdit } from "@/fieldConfigs";

type TemplateCardProps = {
    template: Activity;
    onEdit: (data: Activity & { toPropagate?: boolean }) => void;
    onDelete: (templateId: string) => void;
};

export default function TemplateCard({
    template,
    onEdit,
    onDelete,
}: TemplateCardProps) {
    const colorStyles = getColorStyles(template.color);

    return (
        <FormModal<ActivityDraft & { toPropagate: boolean }>
            title="Edit Template"
            description="Update this activity template."
            fields={activityFieldsForEdit}
            mode="edit"
            initialData={{ ...template, toPropagate: true }}
            onSubmit={(data) => onEdit({ ...data, templateId: template.templateId })}
            deleteAction={{
                title: "Delete Template",
                description: (
                    <>
                        Are you sure you want to delete "<strong>{template.title}</strong>"?
                        This will also remove all placed activities using this template.
                    </>
                ),
                onConfirm: () => onDelete(template.templateId),
                confirmLabel: "Delete",
                buttonLabel: "Delete template",
            }}
        >
            <button
                type="button"
                className={`${colorStyles.soft} ${colorStyles.border} app-template-chip inline-flex min-h-8 max-w-full items-center gap-2 rounded-full border px-3 py-1.5 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[color:var(--app-focus-ring)]`}
                title={template.title}
            >
                <span
                    className={`${colorStyles.solid} size-2.5 shrink-0 rounded-full`}
                    aria-hidden="true"
                />
                <span
                    className={`${colorStyles.text} min-w-0 truncate text-xs font-bold`}
                >
                    {template.title}
                </span>
            </button>
        </FormModal>
    );
}
