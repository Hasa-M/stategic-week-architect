import { ChevronDown, Plus, Trash2 } from "lucide-react";
import { useMemo, useState, type FormEvent } from "react";

import { AlertModal } from "@/components/Modals/AlertModal/AlertModal";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { useDispatch, useScheduleContext, useUserContext } from "@/context/hooks";
import { cn } from "@/lib/utils";

type LayoutMode = "desktop" | "tablet" | "mobile";

type ScheduleSwitcherProps = {
    layoutMode: LayoutMode;
    className?: string;
};

export default function ScheduleSwitcher({
    layoutMode,
    className,
}: ScheduleSwitcherProps) {
    const user = useUserContext();
    const schedule = useScheduleContext();
    const dispatch = useDispatch();
    const [menuOpen, setMenuOpen] = useState(false);
    const [createOpen, setCreateOpen] = useState(false);
    const [draftName, setDraftName] = useState("");
    const [draftError, setDraftError] = useState<string | null>(null);
    const scheduleCount = Object.keys(user.schedules).length;
    const templateCount = Object.keys(user.templates).length;
    const schedules = useMemo(
        () =>
            Object.values(user.schedules).map((item) => ({
                id: item.id,
                name: item.name,
                placedActivityCount: Object.keys(item.placedActivities).length,
                noteCount: Object.keys(item.notes).length,
            })),
        [user.schedules],
    );

    const closeCreateDialog = (nextOpen: boolean) => {
        setCreateOpen(nextOpen);

        if (!nextOpen) {
            setDraftName("");
            setDraftError(null);
        }
    };

    const handleCreateSchedule = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const nextName = draftName.trim();

        if (!nextName) {
            setDraftError("Enter a schedule name before creating it.");
            return;
        }

        dispatch({
            type: "CREATE_SCHEDULE",
            payload: { name: nextName },
        });

        closeCreateDialog(false);
        setMenuOpen(false);
    };

    const handleSelectSchedule = (scheduleId: string) => {
        dispatch({
            type: "SET_ACTIVE_SCHEDULE",
            payload: scheduleId,
        });
        setMenuOpen(false);
    };

    const handleDeleteSchedule = (scheduleId: string) => {
        dispatch({
            type: "DELETE_SCHEDULE",
            payload: scheduleId,
        });
        setMenuOpen(false);
    };

    const openCreateDialog = () => {
        setMenuOpen(false);
        closeCreateDialog(true);
    };

    const menuContent = (
        <div className="flex flex-col gap-3">
            <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                    <p className="app-text-strong text-sm font-semibold">Schedules</p>
                    <p className="app-text-muted text-xs leading-5">
                        Switch the active weekly plan or create a new one.
                    </p>
                </div>

                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="shrink-0 rounded-xl"
                    onClick={openCreateDialog}
                >
                    <Plus className="size-4" />
                    Create new
                </Button>
            </div>

            <div className="app-scrollbar flex max-h-72 flex-col gap-2 overflow-y-auto pr-1">
                {schedules.map((item) => {
                    const isActive = item.id === user.activeScheduleId;
                    const deleteLabel =
                        scheduleCount <= 1
                            ? "Create another schedule before deleting this one."
                            : `Delete ${item.name}`;

                    const deleteButton = (
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            className="shrink-0 rounded-xl"
                            disabled={scheduleCount <= 1}
                            title={deleteLabel}
                            aria-label={deleteLabel}
                        >
                            <Trash2 className="size-4" />
                        </Button>
                    );

                    return (
                        <div
                            key={item.id}
                            className={cn(
                                "flex items-start gap-2 rounded-2xl border px-3 py-2.5",
                                isActive
                                    ? "border-(--app-border-strong) bg-background-accent"
                                    : "border-(--app-border-subtle) bg-(--app-surface-soft)",
                            )}
                        >
                            <button
                                type="button"
                                className="min-w-0 flex-1 text-left"
                                onClick={() => handleSelectSchedule(item.id)}
                            >
                                <div className="flex items-center gap-2">
                                    <span className="app-text-strong truncate text-sm font-semibold">
                                        {item.name}
                                    </span>
                                    {isActive ? (
                                        <span className="rounded-full border border-(--app-border-strong) bg-surface px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-primary">
                                            Active
                                        </span>
                                    ) : null}
                                </div>

                                <p className="app-text-muted mt-1 text-xs leading-5">
                                    {templateCount} templates · {item.placedActivityCount} activities · {item.noteCount} notes
                                </p>
                            </button>

                            {scheduleCount <= 1 ? (
                                deleteButton
                            ) : (
                                <AlertModal
                                    title="Delete schedule"
                                    description={`This will remove ${item.name} and its notes and placed activities from the local planner.`}
                                    onConfirm={() => handleDeleteSchedule(item.id)}
                                    confirmLabel="Delete schedule"
                                    variant="destructive"
                                >
                                    {deleteButton}
                                </AlertModal>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );

    const trigger = (
        <button
            type="button"
            className={cn(
                "group flex min-w-0 max-w-full items-center gap-1.5 rounded-xl px-0.5 py-0.5 text-left transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-(--app-focus-ring)",
                className,
            )}
            title={schedule.name}
            aria-label="Open schedule switcher"
        >
            <span className="truncate">{schedule.name}</span>
            <ChevronDown className="size-5 shrink-0 text-(--app-text-subtle) transition-colors group-hover:text-primary" />
        </button>
    );

    return (
        <>
            <Dialog open={createOpen} onOpenChange={closeCreateDialog}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Create schedule</DialogTitle>
                        <DialogDescription>
                            Start a new weekly plan and switch to it immediately.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleCreateSchedule} className="space-y-5">
                        <div className="space-y-2">
                            <label
                                htmlFor="new-schedule-name"
                                className="app-text-strong text-sm font-medium"
                            >
                                Schedule name
                            </label>
                            <Input
                                id="new-schedule-name"
                                value={draftName}
                                onChange={(event) => {
                                    setDraftName(event.target.value);
                                    if (draftError) {
                                        setDraftError(null);
                                    }
                                }}
                                placeholder="Current week"
                                autoFocus
                            />
                            {draftError ? (
                                <p className="text-sm text-destructive">{draftError}</p>
                            ) : null}
                        </div>

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => closeCreateDialog(false)}
                            >
                                Cancel
                            </Button>
                            <Button type="submit">Create schedule</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {layoutMode === "mobile" ? (
                <Dialog open={menuOpen} onOpenChange={setMenuOpen}>
                    <DialogTrigger asChild>{trigger}</DialogTrigger>
                    <DialogContent className="top-auto right-0 bottom-0 left-0 h-auto max-h-[min(80dvh,40rem)] w-full max-w-none translate-x-0 translate-y-0 gap-4 rounded-t-4xl rounded-b-none border-x-0 border-b-0 p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] sm:max-w-none sm:p-5 sm:pb-[calc(1.25rem+env(safe-area-inset-bottom))]">
                        <DialogHeader>
                            <DialogTitle>Schedules</DialogTitle>
                            <DialogDescription>
                                Switch between saved weekly plans.
                            </DialogDescription>
                        </DialogHeader>

                        {menuContent}
                    </DialogContent>
                </Dialog>
            ) : (
                <Popover open={menuOpen} onOpenChange={setMenuOpen}>
                    <PopoverTrigger asChild>{trigger}</PopoverTrigger>
                    <PopoverContent align="start" className="w-[min(26rem,calc(100vw-1.5rem))]">
                        {menuContent}
                    </PopoverContent>
                </Popover>
            )}
        </>
    );
}