import { Plus } from "lucide-react";
import { useCallback, useMemo } from "react";

import { Button } from "@/components/ui/button";
import NoteCard from "./Card/NoteCard";
import { FormModal } from "./Forms/FormModal";
import type { Note, NoteDraft } from "@/types";
import { noteFields } from "@/fieldConfigs";
import { useDispatch, useScheduleContext } from "@/context/hooks";

export default function NotesSidebar() {
    const schedule = useScheduleContext();
    const dispatch = useDispatch();

    const noteList = useMemo(() => {
        return Object.values(schedule?.notes ?? {});
    }, [schedule?.notes]);

    const handleAddNote = useCallback(
        (data: NoteDraft) => {
            dispatch({ type: "ADD_NOTE", payload: data });
        },
        [dispatch]
    );

    const handleEditNote = useCallback(
        (note: Note) => {
            dispatch({ type: "EDIT_NOTE", payload: note });
        },
        [dispatch]
    );

    const handleDeleteNote = useCallback(
        (noteId: string) => {
            dispatch({ type: "REMOVE_NOTE", payload: noteId });
        },
        [dispatch]
    );

    return (
        <div className="flex flex-col h-full">
            <div className="flex justify-between items-center mb-4">
                <h2 className="font-semibold text-lg">Notes</h2>
                <FormModal<NoteDraft>
                    title="Add Note"
                    description="Create a new note."
                    fields={noteFields}
                    onSubmit={(data) => handleAddNote(data)}
                >
                    <Button size="icon-sm" className="rounded-full">
                        <Plus />
                    </Button>
                </FormModal>
            </div>

            {noteList.length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-8">
                    No notes yet. Click + to add one.
                </p>
            ) : (
                <ul className="flex flex-col gap-3 overflow-y-auto">
                    {noteList.map((note) => (
                        <li key={note.id}>
                            <NoteCard
                                note={note}
                                onEdit={handleEditNote}
                                onDelete={handleDeleteNote}
                            />
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
