import type { Note, NoteDraft } from "@/types";
import type { FormFieldConfig } from "@/components/Forms/FormField";
import { getColorClass } from "@/utils";
import { FormModal } from "@/components/Forms/FormModal";

type NoteCardProps = {
    note: Note;
    fields: FormFieldConfig<NoteDraft>[];
    activityLabel?: string;
    onEdit: (note: Note) => void;
    onDelete: (noteId: string) => void;
};

export default function NoteCard({
    note,
    fields,
    activityLabel,
    onEdit,
    onDelete,
}: NoteCardProps) {
    const colorClass = getColorClass(note.color);

    return (
        <FormModal<NoteDraft>
            title="Edit Note"
            description="Update this note."
            fields={fields}
            mode="edit"
            initialData={note}
            onSubmit={(data) => onEdit({ ...data, id: note.id })}
            deleteAction={{
                title: "Delete Note",
                description: (
                    <>
                        Are you sure you want to delete "<strong>{note.title}</strong>"?
                    </>
                ),
                onConfirm: () => onDelete(note.id),
                confirmLabel: "Delete",
                buttonLabel: "Delete note",
            }}
        >
            <div className="app-card app-card-interactive cursor-pointer p-3.5">
                <div className="flex items-start gap-3">
                    <div
                        className={`w-1 self-stretch rounded-full shrink-0 ${colorClass}`}
                    />
                    <div className="flex-1 min-w-0">
                        <h3 className="app-text font-medium text-sm truncate">
                            {note.title}
                        </h3>
                        {activityLabel ? (
                            <p className="app-text-subtle mt-1 line-clamp-1 text-[11px]">
                                {activityLabel}
                            </p>
                        ) : null}
                        <p className="app-text-muted mt-1 line-clamp-2 text-xs">
                            {note.content}
                        </p>
                    </div>
                </div>
            </div>
        </FormModal>
    );
}
