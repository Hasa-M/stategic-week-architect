import { useCallback, useMemo, useState, type ReactNode } from "react";
import { Check, ChevronDown, Plus, Trash2, X } from "lucide-react";

import { AlertModal } from "@/components/Modals/AlertModal/AlertModal";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, type SelectOption } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { COLOR_OPTIONS } from "@/fieldConfigs";
import type {
    ActivityNoteDraft,
    ActivityNoteInput,
    Day,
    PlacedActivityDraft,
    SavePlacedActivityPayload,
} from "@/types";

const ALL_DAYS: Day[] = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
];

export type PlacedActivityDialogInitialData = {
    templateId: string;
    day: Day;
    startTime: number;
    endTime: number;
    notes?: ActivityNoteInput[];
};

type PlacedActivityFormState = {
    templateId: string;
    day: string;
    startTime: string;
    endTime: string;
};

type EditableActivityNote = ActivityNoteInput & {
    localId: string;
};

type SharedDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    templateOptions: SelectOption[];
    timeOptions: SelectOption[];
    initialData?: PlacedActivityDialogInitialData;
};

type AddDialogProps = SharedDialogProps & {
    mode: "add";
    onSubmit: (data: PlacedActivityDraft) => void;
};

type EditDialogProps = SharedDialogProps & {
    mode: "edit";
    placedId: string;
    onSubmit: (data: SavePlacedActivityPayload) => void;
    onDelete: () => void;
};

type PlacedActivityDialogProps = AddDialogProps | EditDialogProps;

type PlaceActivityModalProps = {
    children: ReactNode;
    templateOptions: SelectOption[];
    timeOptions: SelectOption[];
    onSubmit: (data: PlacedActivityDraft) => void;
};

type AddPlacedActivityModalProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    templateOptions: SelectOption[];
    timeOptions: SelectOption[];
    initialData?: PlacedActivityDialogInitialData;
    onSubmit: (data: PlacedActivityDraft) => void;
};

type EditPlacedActivityModalProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    templateOptions: SelectOption[];
    timeOptions: SelectOption[];
    placedId: string;
    initialData: PlacedActivityDialogInitialData;
    onSubmit: (data: SavePlacedActivityPayload) => void;
    onDelete: () => void;
};

const EMPTY_FORM_STATE: PlacedActivityFormState = {
    templateId: "",
    day: "",
    startTime: "",
    endTime: "",
};

const EMPTY_NOTE_DRAFT: ActivityNoteDraft = {
    title: "",
    content: "",
    color: "slate",
};

function formatMinutes(minutes: number) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    return `${hours.toString().padStart(2, "0")}:${mins
        .toString()
        .padStart(2, "0")}`;
}

function buildInitialFormState(
    initialData?: PlacedActivityDialogInitialData
): PlacedActivityFormState {
    if (!initialData) {
        return EMPTY_FORM_STATE;
    }

    return {
        templateId: initialData.templateId,
        day: initialData.day,
        startTime: String(initialData.startTime),
        endTime: String(initialData.endTime),
    };
}

function buildEditableNotes(
    notes: ActivityNoteInput[] | undefined
): EditableActivityNote[] {
    if (!notes?.length) {
        return [];
    }

    return notes.map((note) => ({
        ...note,
        localId: note.id ?? crypto.randomUUID(),
    }));
}

function toActivityNoteInput(note: EditableActivityNote): ActivityNoteInput {
    return {
        ...(note.id ? { id: note.id } : {}),
        title: note.title,
        content: note.content,
        color: note.color,
    };
}

function mergeTimeOptions(
    timeOptions: SelectOption[],
    initialData?: PlacedActivityDialogInitialData
): SelectOption[] {
    const nextOptions = new Map(timeOptions.map((option) => [option.value, option]));

    if (initialData) {
        [initialData.startTime, initialData.endTime].forEach((minutes) => {
            const value = String(minutes);

            if (!nextOptions.has(value)) {
                nextOptions.set(value, {
                    value,
                    label: formatMinutes(minutes),
                });
            }
        });
    }

    return Array.from(nextOptions.values()).sort(
        (left, right) => Number(left.value) - Number(right.value)
    );
}

function buildAddDialogKey(
    open: boolean,
    initialData?: PlacedActivityDialogInitialData
) {
    if (!initialData) {
        return open ? "add-open" : "add-closed";
    }

    return `add-${initialData.day}-${initialData.startTime}-${initialData.endTime}-${
        open ? "open" : "closed"
    }`;
}

function PlacedActivityDialogContent(props: PlacedActivityDialogProps) {
    const { initialData, mode, onOpenChange, templateOptions, timeOptions } = props;
    const [formState, setFormState] = useState<PlacedActivityFormState>(() =>
        buildInitialFormState(initialData)
    );
    const [notes, setNotes] = useState<EditableActivityNote[]>(() =>
        buildEditableNotes(initialData?.notes)
    );
    const [notesOpen, setNotesOpen] = useState(Boolean(initialData?.notes?.length));
    const [error, setError] = useState<string | null>(null);

    const availableTimeOptions = useMemo(
        () => mergeTimeOptions(timeOptions, initialData),
        [initialData, timeOptions]
    );

    const handleFormChange = useCallback(
        (field: keyof PlacedActivityFormState, value: string) => {
            setFormState((currentState) => ({
                ...currentState,
                [field]: value,
            }));
        },
        []
    );

    const handleAddNote = useCallback(() => {
        setNotes((currentNotes) => [
            ...currentNotes,
            {
                ...EMPTY_NOTE_DRAFT,
                localId: crypto.randomUUID(),
            },
        ]);
        setNotesOpen(true);
    }, []);

    const handleRemoveNote = useCallback((localId: string) => {
        setNotes((currentNotes) =>
            currentNotes.filter((note) => note.localId !== localId)
        );
    }, []);

    const handleChangeNote = useCallback(
        <K extends keyof ActivityNoteDraft>(
            localId: string,
            field: K,
            value: ActivityNoteDraft[K]
        ) => {
            setNotes((currentNotes) =>
                currentNotes.map((note) =>
                    note.localId === localId ? { ...note, [field]: value } : note
                )
            );
        },
        []
    );

    const handleSubmit = useCallback(
        (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            setError(null);

            if (
                !formState.templateId ||
                !formState.day ||
                !formState.startTime ||
                !formState.endTime
            ) {
                setError("Complete template, day, start time, and end time before saving.");
                return;
            }

            if (Number(formState.endTime) <= Number(formState.startTime)) {
                setError("End time must be after the start time.");
                return;
            }

            const invalidNote = notes.findIndex(
                (note) =>
                    note.title.trim().length === 0 ||
                    note.content.trim().length === 0
            );

            if (invalidNote !== -1) {
                setError(`Note ${invalidNote + 1} must include both title and content.`);
                setNotesOpen(true);
                return;
            }

            if (mode === "edit") {
                props.onSubmit({
                    placedId: props.placedId,
                    templateId: formState.templateId,
                    day: formState.day as Day,
                    startTime: Number(formState.startTime),
                    endTime: Number(formState.endTime),
                    notes: notes.map(toActivityNoteInput),
                });
            } else {
                props.onSubmit({
                    templateId: formState.templateId,
                    day: formState.day as Day,
                    startTime: Number(formState.startTime),
                    endTime: Number(formState.endTime),
                    ...(notes.length > 0
                        ? {
                              notes: notes.map((note) => ({
                                  title: note.title,
                                  content: note.content,
                                  color: note.color,
                              })),
                          }
                        : {}),
                });
            }

            onOpenChange(false);
        },
        [formState, mode, notes, onOpenChange, props]
    );

    return (
        <DialogContent className="md:max-w-180">
            <DialogHeader>
                <DialogTitle>
                    {mode === "edit" ? "Edit Activity" : "Place Activity"}
                </DialogTitle>
                <DialogDescription>
                    {mode === "edit"
                        ? "Update the activity placement, adjust its notes, or remove it from the schedule."
                        : "Choose a template, a day, and a time range. You can optionally attach multiple notes to the new activity."}
                </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                    <div className="flex flex-col gap-1.5 md:col-span-2">
                        <Label htmlFor="placed-activity-template">
                            Template
                            <span className="ml-1 text-destructive">*</span>
                        </Label>
                        <Select
                            id="placed-activity-template"
                            name="templateId"
                            value={formState.templateId}
                            onValueChange={(value) =>
                                handleFormChange("templateId", value)
                            }
                            options={templateOptions}
                            placeholder="Choose a template"
                            showColorIndicator
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-1.5 md:col-span-2">
                        <Label htmlFor="placed-activity-day">
                            Day
                            <span className="ml-1 text-destructive">*</span>
                        </Label>
                        <Select
                            id="placed-activity-day"
                            name="day"
                            value={formState.day}
                            onValueChange={(value) => handleFormChange("day", value)}
                            options={ALL_DAYS.map((day) => ({
                                value: day,
                                label: day,
                            }))}
                            placeholder="Choose a day"
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="placed-activity-start-time">
                            Start time
                            <span className="ml-1 text-destructive">*</span>
                        </Label>
                        <Select
                            id="placed-activity-start-time"
                            name="startTime"
                            value={formState.startTime}
                            onValueChange={(value) =>
                                handleFormChange("startTime", value)
                            }
                            options={availableTimeOptions.slice(0, -1)}
                            placeholder="Choose a start time"
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="placed-activity-end-time">
                            End time
                            <span className="ml-1 text-destructive">*</span>
                        </Label>
                        <Select
                            id="placed-activity-end-time"
                            name="endTime"
                            value={formState.endTime}
                            onValueChange={(value) =>
                                handleFormChange("endTime", value)
                            }
                            options={availableTimeOptions.slice(1)}
                            placeholder="Choose an end time"
                            required
                        />
                    </div>
                </div>

                <div className="app-associated-notes">
                    <button
                        type="button"
                        className="app-associated-notes__toggle"
                        onClick={() => setNotesOpen((currentValue) => !currentValue)}
                    >
                        <div className="space-y-1">
                            <p className="app-text text-base font-semibold">
                                Associated notes
                            </p>
                            <p className="app-text-muted text-sm">
                                {mode === "edit"
                                    ? "Edit the notes linked to this activity."
                                    : "Optional context, reminders, or extra info for this activity."}
                            </p>
                        </div>

                        <div className="app-associated-notes__count-row">
                            <span className="app-associated-notes__count">
                                {notes.length} note{notes.length === 1 ? "" : "s"}
                            </span>
                            <ChevronDown
                                className={`app-text-muted size-4 transition-transform ${
                                    notesOpen ? "rotate-180" : ""
                                }`}
                            />
                        </div>
                    </button>

                    {notesOpen && (
                        <div className="app-associated-notes__body">
                            {notes.length === 0 ? (
                                <div className="app-associated-notes__empty">
                                    No notes added yet. Use the button below to attach one.
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {notes.map((note, index) => (
                                        <div
                                            key={note.localId}
                                            className="app-associated-notes__card"
                                        >
                                            <div className="mb-4 flex items-start justify-between gap-4">
                                                <div className="space-y-1">
                                                    <span className="app-associated-notes__badge">
                                                        Note {index + 1}
                                                    </span>
                                                    <p className="app-text-muted text-sm">
                                                        Attached note for this activity.
                                                    </p>
                                                </div>

                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="icon-sm"
                                                    className="app-associated-notes__remove rounded-full"
                                                    onClick={() =>
                                                        handleRemoveNote(note.localId)
                                                    }
                                                >
                                                    <Trash2 />
                                                </Button>
                                            </div>

                                            <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_12rem]">
                                                <div className="flex flex-col gap-1.5">
                                                    <Label htmlFor={`note-title-${note.localId}`}>
                                                        Title
                                                        <span className="ml-1 text-destructive">*</span>
                                                    </Label>
                                                    <Input
                                                        id={`note-title-${note.localId}`}
                                                        value={note.title}
                                                        onChange={(event) =>
                                                            handleChangeNote(
                                                                note.localId,
                                                                "title",
                                                                event.target.value
                                                            )
                                                        }
                                                        placeholder="Note title"
                                                        required
                                                    />
                                                </div>

                                                <div className="flex flex-col gap-1.5">
                                                    <Label htmlFor={`note-color-${note.localId}`}>
                                                        Color
                                                        <span className="ml-1 text-destructive">*</span>
                                                    </Label>
                                                    <Select
                                                        id={`note-color-${note.localId}`}
                                                        name={`note-color-${note.localId}`}
                                                        value={note.color}
                                                        onValueChange={(value) =>
                                                            handleChangeNote(
                                                                note.localId,
                                                                "color",
                                                                value as ActivityNoteDraft["color"]
                                                            )
                                                        }
                                                        options={COLOR_OPTIONS}
                                                        showColorIndicator
                                                        required
                                                    />
                                                </div>

                                                <div className="flex flex-col gap-1.5 md:col-span-2">
                                                    <Label htmlFor={`note-content-${note.localId}`}>
                                                        Content
                                                        <span className="ml-1 text-destructive">*</span>
                                                    </Label>
                                                    <Textarea
                                                        id={`note-content-${note.localId}`}
                                                        value={note.content}
                                                        onChange={(event) =>
                                                            handleChangeNote(
                                                                note.localId,
                                                                "content",
                                                                event.target.value
                                                            )
                                                        }
                                                        placeholder="Write the activity note here..."
                                                        rows={4}
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <Button
                                type="button"
                                variant="outline"
                                className="app-associated-notes__add rounded-full"
                                onClick={handleAddNote}
                            >
                                <Plus size={16} />
                                Add note
                            </Button>
                        </div>
                    )}
                </div>

                {error ? <p className="text-sm text-destructive">{error}</p> : null}

                <div className="flex flex-col gap-3 border-t border-primary/8 pt-5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        {mode === "edit" ? (
                            <AlertModal
                                title="Delete Activity"
                                description="This will remove the activity from the grid and delete all notes associated with it."
                                onConfirm={() => {
                                    props.onDelete();
                                    onOpenChange(false);
                                }}
                                confirmLabel="Delete"
                                variant="destructive"
                            >
                                <Button type="button" variant="destructive">
                                    <Trash2 />
                                    Delete activity
                                </Button>
                            </AlertModal>
                        ) : null}
                    </div>

                    <div className="flex flex-col-reverse gap-2 sm:flex-row">
                        <DialogClose asChild>
                            <Button type="button" variant="outline">
                                <X />
                                Cancel
                            </Button>
                        </DialogClose>

                        <Button type="submit">
                            <Check />
                            {mode === "edit" ? "Update activity" : "Save"}
                        </Button>
                    </div>
                </div>
            </form>
        </DialogContent>
    );
}

export function EditPlacedActivityModal({
    initialData,
    onDelete,
    onOpenChange,
    onSubmit,
    open,
    placedId,
    templateOptions,
    timeOptions,
}: EditPlacedActivityModalProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <PlacedActivityDialogContent
                key={`${placedId}-${open ? "open" : "closed"}`}
                mode="edit"
                open={open}
                onOpenChange={onOpenChange}
                templateOptions={templateOptions}
                timeOptions={timeOptions}
                placedId={placedId}
                initialData={initialData}
                onSubmit={onSubmit}
                onDelete={onDelete}
            />
        </Dialog>
    );
}

export function AddPlacedActivityModal({
    initialData,
    onOpenChange,
    onSubmit,
    open,
    templateOptions,
    timeOptions,
}: AddPlacedActivityModalProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <PlacedActivityDialogContent
                key={buildAddDialogKey(open, initialData)}
                mode="add"
                open={open}
                onOpenChange={onOpenChange}
                templateOptions={templateOptions}
                timeOptions={timeOptions}
                initialData={initialData}
                onSubmit={onSubmit}
            />
        </Dialog>
    );
}

export default function PlaceActivityModal({
    children,
    templateOptions,
    timeOptions,
    onSubmit,
}: PlaceActivityModalProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <PlacedActivityDialogContent
                key={buildAddDialogKey(isOpen)}
                mode="add"
                open={isOpen}
                onOpenChange={setIsOpen}
                templateOptions={templateOptions}
                timeOptions={timeOptions}
                onSubmit={onSubmit}
            />
        </Dialog>
    );
}