import type { Note, NoteDraft } from "@/types";
import { getColorClass } from "@/utils";
import { FormModal } from "@/components/Forms/FormModal";
import { AlertModal } from "@/components/Modals/AlertModal/AlertModal";
import { noteFields } from "@/fieldConfigs";
import CardDeleteButton from "@/components/Card/CardDeleteButton";

type NoteCardProps = {
    note: Note;
    onEdit: (note: Note) => void;
    onDelete: (noteId: string) => void;
};

export default function NoteCard({ note, onEdit, onDelete }: NoteCardProps) {
    const colorClass = getColorClass(note.color);

    return (
        <div className="relative group">
            <FormModal<NoteDraft>
                title="Edit Note"
                description="Update this note."
                fields={noteFields}
                mode="edit"
                initialData={note}
                onSubmit={(data) => onEdit({ ...data, id: note.id })}
            >
                <div className="bg-surface cursor-pointer rounded-md p-3 shadow-sm transition duration-300 ease-in-out hover:bg-background-accent">
                    <div className="flex items-start gap-3">
                        <div
                            className={`w-1 self-stretch rounded-full shrink-0 ${colorClass}`}
                        />
                        <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-sm truncate">
                                {note.title}
                            </h3>
                            <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                                {note.content}
                            </p>
                        </div>
                    </div>
                </div>
            </FormModal>

            <AlertModal
                title="Delete Note"
                description={
                    <>
                        Are you sure you want to delete "<strong>{note.title}</strong>"?
                    </>
                }
                onConfirm={() => onDelete(note.id)}
                variant="destructive"
                confirmLabel="Delete"
            >
                <CardDeleteButton onClick={(event) => event.stopPropagation()} />
            </AlertModal>
        </div>
    );
}
