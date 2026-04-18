import type { Activity, ActivityDraft } from "@/types";
import { getColorClass } from "@/utils";
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
    const colorClass = getColorClass(template.color);

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
            <div className="app-card app-card-interactive flex min-h-11 cursor-pointer items-center gap-3 px-3 py-2">
                <div
                    className={`w-1.5 self-stretch rounded-full shrink-0 ${colorClass}`}
                />
                <span className="flex-1 self-center truncate font-medium text-slate-700">
                    {template.title}
                </span>
            </div>
        </FormModal>
    );
}
