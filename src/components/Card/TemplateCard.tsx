import { Trash2 } from "lucide-react";
import type { Activity } from "@/types";
import { getColorClass } from "@/utils";
import { FormModal } from "../Forms/FormModal";
import { AlertModal } from "../Modals/AlertModal/AlertModal";
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
        <div className="relative group">
            <FormModal<Activity & { toPropagate: boolean }>
                title="Edit Template"
                description="Update this activity template."
                fields={activityFieldsForEdit}
                mode="edit"
                initialData={{ ...template, toPropagate: true }}
                onSubmit={(data) => onEdit({ ...data, templateId: template.templateId })}
            >
                <div className="h-8 bg-white flex rounded-sm pr-3 gap-3 shadow-sm hover:bg-background-accent transition duration-300 ease-in-out cursor-pointer">
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
                <button
                    className="absolute -top-2 -right-2 p-1 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
                    onClick={(e) => e.stopPropagation()}
                >
                    <Trash2 size={14} className="text-red-600" />
                </button>
            </AlertModal>
        </div>
    );
}
