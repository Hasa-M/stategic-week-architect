import { Plus } from "lucide-react";
import { useCallback, useMemo } from "react";

import type { FormFieldConfig } from "@/components/Forms/FormField";
import { Button } from "@/components/ui/button";
import NoteCard from "../Card/NoteCard";
import { FormModal } from "../Forms/FormModal";
import { buildNoteFields } from "@/fieldConfigs";
import { useDispatch, useScheduleContext } from "@/context/hooks";
import { formatMinutes } from "@/lib/grid";
import { cn } from "@/lib/utils";
import type { Note, NoteDraft, PlacedActivity } from "@/types";
import SidebarSectionHeader from "@/components/Sidebar/SidebarSectionHeader";

const DAY_ORDER: Record<PlacedActivity["day"], number> = {
    Monday: 0,
    Tuesday: 1,
    Wednesday: 2,
    Thursday: 3,
    Friday: 4,
    Saturday: 5,
    Sunday: 6,
};

function comparePlacedActivities(left: PlacedActivity, right: PlacedActivity) {
    const dayDifference = DAY_ORDER[left.day] - DAY_ORDER[right.day];

    if (dayDifference !== 0) {
        return dayDifference;
    }

    const startDifference = left.startTime - right.startTime;

    if (startDifference !== 0) {
        return startDifference;
    }

    return left.title.localeCompare(right.title);
}

function getActivityLabel(activity: PlacedActivity) {
    return `${activity.day} · ${formatMinutes(activity.startTime)}-${formatMinutes(
        activity.endTime
    )} · ${activity.title}`;
}

export default function NotesSidebar({
    continuousScroll = false,
}: {
    continuousScroll?: boolean;
}) {
    const schedule = useScheduleContext();
    const dispatch = useDispatch();

    const placedActivities = useMemo(
        () =>
            Object.values(schedule?.placedActivities ?? {}).sort(
                comparePlacedActivities
            ),
        [schedule?.placedActivities]
    );

    const activityOptions = useMemo(
        () =>
            placedActivities.map((activity) => ({
                value: activity.placedId,
                label: getActivityLabel(activity),
                color: activity.color,
            })),
        [placedActivities]
    );

    const noteFields = useMemo<FormFieldConfig<NoteDraft>[]>(
        () => buildNoteFields(activityOptions),
        [activityOptions]
    );

    const activityLabels = useMemo(
        () =>
            new Map(
                placedActivities.map((activity) => [
                    activity.placedId,
                    getActivityLabel(activity),
                ])
            ),
        [placedActivities]
    );

    const activityOrder = useMemo(
        () =>
            new Map(
                placedActivities.map((activity, index) => [activity.placedId, index])
            ),
        [placedActivities]
    );

    const noteList = useMemo(() => {
        return Object.values(schedule?.notes ?? {}).sort((left, right) => {
            const activityDifference =
                (activityOrder.get(left.activityId) ?? Number.MAX_SAFE_INTEGER) -
                (activityOrder.get(right.activityId) ?? Number.MAX_SAFE_INTEGER);

            if (activityDifference !== 0) {
                return activityDifference;
            }

            return left.title.localeCompare(right.title);
        });
    }, [activityOrder, schedule?.notes]);

    const canAddNotes = activityOptions.length > 0;
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
        <div
            className={cn(
                "flex flex-col gap-4 p-2",
                !continuousScroll && "h-full min-h-0"
            )}
        >
            <SidebarSectionHeader
                title="All Activity Notes"
                action={
                    canAddNotes ? (
                        <FormModal<NoteDraft>
                            title="Add a Note to an Activity"
                            description="Create a new note and link it to an existing placed activity."
                            fields={noteFields}
                            onSubmit={handleAddNote}
                        >
                            <Button
                                size="icon-sm"
                                className="size-8 rounded-full"
                                aria-label="Add note"
                            >
                                <Plus />
                            </Button>
                        </FormModal>
                    ) : (
                        <span
                            className="inline-flex"
                            title="Place an activity before adding notes."
                        >
                            <Button
                                size="icon-sm"
                                className="size-8 rounded-full"
                                aria-label="Add note"
                                disabled
                            >
                                <Plus />
                            </Button>
                        </span>
                    )
                }
            />

            {noteList.length === 0 ? (
                <div
                    className={cn(
                        "app-card app-text-muted flex items-center justify-center px-4 py-10 text-center text-sm",
                        !continuousScroll && "min-h-0 flex-1"
                    )}
                >
                    {canAddNotes
                        ? "No notes yet. Click + to add one."
                        : "Place an activity on the grid before adding notes."}
                </div>
            ) : (
                <div
                    className={cn(
                        continuousScroll
                            ? "flex flex-col"
                            : "app-scrollbar min-h-0 flex-1 overflow-y-auto pr-1"
                    )}
                >
                    <ul
                        className={cn(
                            "flex list-none flex-col gap-3 pb-1",
                            !continuousScroll && "min-h-full"
                        )}
                    >
                        {noteList.map((note) => (
                            <li key={note.id}>
                                <NoteCard
                                    note={note}
                                    fields={noteFields}
                                    activityLabel={activityLabels.get(note.activityId)}
                                    onEdit={handleEditNote}
                                    onDelete={handleDeleteNote}
                                />
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
