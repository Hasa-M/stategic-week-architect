import type { Activity, ActivityDraft } from "@/types";
import { getColorClass } from "@/utils";
import { FormModal } from "@/components/Forms/FormModal";
import { AlertModal } from "@/components/Modals/AlertModal/AlertModal";
import { activityFieldsForEdit } from "@/fieldConfigs";
import CardDeleteButton from "@/components/Card/CardDeleteButton";

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
        <div className="relative group">
            <FormModal<ActivityDraft & { toPropagate: boolean }>
                title="Edit Template"
                description="Update this activity template."
                fields={activityFieldsForEdit}
                mode="edit"
                initialData={{ ...template, toPropagate: true }}
                onSubmit={(data) => onEdit({ ...data, templateId: template.templateId })}
            >
                <div className="bg-surface flex h-8 cursor-pointer gap-3 rounded-sm pr-3 shadow-sm transition duration-300 ease-in-out hover:bg-background-accent">
                    <div
                        className={`w-1.5 self-stretch rounded-full shrink-0 ${colorClass}`}
                    />
                    <span className="flex-1 font-medium leading-7 self-center truncate">
                        {template.title}
                    </span>
                </div>
            </FormModal>

            <AlertModal
                title="Delete Template"
                description={
                    <>
                        Are you sure you want to delete "<strong>{template.title}</strong>"?
                        This will also remove all placed activities using this template.
                    </>
                }
                onConfirm={() => onDelete(template.templateId)}
                variant="destructive"
                confirmLabel="Delete"
            >
                <CardDeleteButton onClick={(event) => event.stopPropagation()} />
            </AlertModal>
        </div>
    );
}
