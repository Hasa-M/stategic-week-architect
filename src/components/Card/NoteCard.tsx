import { Trash2 } from "lucide-react";
import type { Note } from "@/types";
import { getColorClass } from "@/utils";
import { FormModal } from "../Forms/FormModal";
import { AlertModal } from "../Modals/AlertModal/AlertModal";
import { noteFields } from "@/fieldConfigs";

type NoteCardProps = {
    note: Note;
    onEdit: (note: Note) => void;
    onDelete: (noteId: string) => void;
};

export default function NoteCard({ note, onEdit, onDelete }: NoteCardProps) {
    const colorClass = getColorClass(note.color);

    return (
        <div className="relative group">
            <FormModal<Note>
                title="Edit Note"
                description="Update this note."
                fields={noteFields}
                mode="edit"
                initialData={note}
                onSubmit={(data) => onEdit({ ...data, id: note.id })}
            >
                <div className="bg-white rounded-md p-3 shadow-sm hover:bg-background-accent transition duration-300 ease-in-out cursor-pointer">
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
