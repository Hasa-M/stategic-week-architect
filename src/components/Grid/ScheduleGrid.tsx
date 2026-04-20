import {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
    type KeyboardEvent,
    type PointerEvent as ReactPointerEvent,
} from "react";

import { useDispatch, useScheduleContext, useUserContext } from "@/context/hooks";
import { EditPlacedActivityModal } from "@/components/Grid/PlaceActivityModal";
import {
    clipActivityToVisibleRange,
    type VisiblePlacedActivity,
} from "@/lib/grid";
import { getColorStyles } from "@/utils";
import type {
    ActivityNoteInput,
    Day,
    Note,
    PlacedActivity,
    SavePlacedActivityPayload,
} from "@/types";

const SLOT_HEIGHT = 56;
const TIME_COLUMN_WIDTH = 64;
const DRAG_THRESHOLD = 6;
const ACTIVITY_SIDE_INSET = 8;
const OVERLAP_STAGGER = 18;

type DragState = {
    pointerId: number;
    placedId: string;
    templateId: string;
    duration: number;
    originClientX: number;
    originClientY: number;
    pointerOffsetY: number;
    previewDay: Day;
    previewStartTime: number;
    didDrag: boolean;
};

type OverlapLayout = {
    laneIndex: number;
    laneCount: number;
    isOverlapping: boolean;
};

function formatMinutes(minutes: number) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    return `${hours.toString().padStart(2, "0")}:${mins
        .toString()
        .padStart(2, "0")}`;
}

function clamp(value: number, min: number, max: number) {
    return Math.min(Math.max(value, min), max);
}

function resolveDayFromPointerX(
    clientX: number,
    days: Day[],
    dayColumnRefs: Partial<Record<Day, HTMLDivElement | null>>,
) {
    const dayRects = days
        .map((day) => {
            const element = dayColumnRefs[day];

            if (!element) {
                return null;
            }

            return {
                day,
                rect: element.getBoundingClientRect(),
            };
        })
        .filter((entry) => entry !== null);

    if (dayRects.length === 0) {
        return days[0] ?? "Monday";
    }

    if (clientX <= dayRects[0].rect.left) {
        return dayRects[0].day;
    }

    const lastRect = dayRects[dayRects.length - 1];

    if (clientX >= lastRect.rect.right) {
        return lastRect.day;
    }

    const containingDay = dayRects.find(
        ({ rect }) => clientX >= rect.left && clientX <= rect.right,
    );

    if (containingDay) {
        return containingDay.day;
    }

    return dayRects.reduce((closestDay, candidate) => {
        const closestCenter =
            (closestDay.rect.left + closestDay.rect.right) / 2;
        const candidateCenter =
            (candidate.rect.left + candidate.rect.right) / 2;

        return Math.abs(candidateCenter - clientX) <
            Math.abs(closestCenter - clientX)
            ? candidate
            : closestDay;
    }).day;
}

function resolveStartTimeFromPointer(
    clientY: number,
    day: Day,
    pointerOffsetY: number,
    dayColumnRefs: Partial<Record<Day, HTMLDivElement | null>>,
    gridStartTime: number,
    gridEndTime: number,
    slotDuration: number,
    duration: number,
) {
    const column = dayColumnRefs[day];

    if (!column) {
        return gridStartTime;
    }

    const rawTop =
        clientY - column.getBoundingClientRect().top - pointerOffsetY;
    const snappedSlotIndex = Math.round(rawTop / SLOT_HEIGHT);
    const unclampedStartTime = gridStartTime + snappedSlotIndex * slotDuration;
    const maxStartTime = Math.max(gridStartTime, gridEndTime - duration);

    return clamp(unclampedStartTime, gridStartTime, maxStartTime);
}

function buildDayOverlapLayout(dayActivities: VisiblePlacedActivity[]) {
    const sortedActivities = [...dayActivities].sort((left, right) => {
        if (left.visibleStartTime !== right.visibleStartTime) {
            return left.visibleStartTime - right.visibleStartTime;
        }

        if (left.visibleEndTime !== right.visibleEndTime) {
            return left.visibleEndTime - right.visibleEndTime;
        }

        return left.placedId.localeCompare(right.placedId);
    });
    const layout: Record<string, OverlapLayout> = {};
    let clusterEntries: { placedId: string; laneIndex: number }[] = [];
    let laneEndTimes: number[] = [];
    let clusterMaxEnd = Number.NEGATIVE_INFINITY;

    const finalizeCluster = () => {
        if (clusterEntries.length === 0) {
            return;
        }

        const laneCount = Math.max(laneEndTimes.length, 1);

        clusterEntries.forEach((entry) => {
            layout[entry.placedId] = {
                laneIndex: entry.laneIndex,
                laneCount,
                isOverlapping: laneCount > 1,
            };
        });

        clusterEntries = [];
        laneEndTimes = [];
        clusterMaxEnd = Number.NEGATIVE_INFINITY;
    };

    sortedActivities.forEach((activity) => {
        if (
            clusterEntries.length > 0 &&
            activity.visibleStartTime >= clusterMaxEnd
        ) {
            finalizeCluster();
        }

        let laneIndex = laneEndTimes.findIndex(
            (laneEndTime) => activity.visibleStartTime >= laneEndTime,
        );

        if (laneIndex === -1) {
            laneIndex = laneEndTimes.length;
            laneEndTimes.push(activity.visibleEndTime);
        } else {
            laneEndTimes[laneIndex] = activity.visibleEndTime;
        }

        clusterEntries.push({
            placedId: activity.placedId,
            laneIndex,
        });
        clusterMaxEnd = Math.max(clusterMaxEnd, activity.visibleEndTime);
    });

    finalizeCluster();

    return layout;
}

export default function ScheduleGrid() {
    const schedule = useScheduleContext();
    const user = useUserContext();
    const dispatch = useDispatch();
    const { days, slotDuration, startTime, endTime } = schedule.grid;
    const dayColumnRefs = useRef<Partial<Record<Day, HTMLDivElement | null>>>(
        {},
    );
    const dragStateRef = useRef<DragState | null>(null);
    const dragElementRef = useRef<HTMLButtonElement | null>(null);
    const [dragState, setDragState] = useState<DragState | null>(null);
    const [selectedPlacedId, setSelectedPlacedId] = useState<string | null>(
        null,
    );
    const isDragging = dragState !== null;

    const slotTimes = useMemo(() => {
        const totalSlots = Math.ceil((endTime - startTime) / slotDuration);

        return Array.from({ length: totalSlots }, (_, index) => {
            const minutes = startTime + index * slotDuration;
            return {
                label: formatMinutes(minutes),
                minutes,
            };
        });
    }, [endTime, slotDuration, startTime]);

    const dayActivities = useMemo(
        () =>
            Object.values(schedule.placedActivities).filter((activity) =>
                days.includes(activity.day),
            ),
        [days, schedule.placedActivities],
    );

    const templateOptions = useMemo(
        () =>
            Object.values(user.templates).map((template) => ({
                value: template.templateId,
                label: template.title,
                color: template.color,
            })),
        [user.templates],
    );

    const timeOptions = useMemo(() => {
        const options: { value: string; label: string }[] = [];

        for (
            let minutes = startTime;
            minutes <= endTime;
            minutes += slotDuration
        ) {
            options.push({
                value: String(minutes),
                label: formatMinutes(minutes),
            });
        }

        return options;
    }, [endTime, slotDuration, startTime]);

    const notesByActivity = useMemo(() => {
        return Object.values(schedule.notes).reduce<Record<string, Note[]>>(
            (accumulator, note) => {
                const activityNotes = accumulator[note.activityId] ?? [];

                activityNotes.push(note);
                accumulator[note.activityId] = activityNotes;

                return accumulator;
            },
            {},
        );
    }, [schedule.notes]);

    const renderedActivities = useMemo(() => {
        const nextActivities = dragState?.didDrag
            ? dayActivities.map((activity) =>
                  activity.placedId === dragState.placedId
                      ? {
                            ...activity,
                            day: dragState.previewDay,
                            startTime: dragState.previewStartTime,
                            endTime:
                                dragState.previewStartTime + dragState.duration,
                        }
                      : activity,
              )
            : dayActivities;

        return nextActivities
            .map((activity) =>
                clipActivityToVisibleRange(activity, startTime, endTime),
            )
            .filter(
                (activity): activity is VisiblePlacedActivity =>
                    activity !== null,
            );
    }, [dayActivities, dragState, endTime, startTime]);

    const overlapLayouts = useMemo(() => {
        return days.reduce<Record<string, OverlapLayout>>(
            (accumulator, day) => {
                const dayActivities = renderedActivities.filter(
                    (activity) => activity.day === day,
                );

                return {
                    ...accumulator,
                    ...buildDayOverlapLayout(dayActivities),
                };
            },
            {},
        );
    }, [days, renderedActivities]);

    const selectedActivity = selectedPlacedId
        ? (schedule.placedActivities[selectedPlacedId] ?? null)
        : null;

    const selectedActivityNotes = useMemo<ActivityNoteInput[]>(() => {
        if (!selectedActivity) {
            return [];
        }

        return (notesByActivity[selectedActivity.placedId] ?? []).map(
            (note) => ({
                id: note.id,
                title: note.title,
                content: note.content,
                color: note.color,
            }),
        );
    }, [notesByActivity, selectedActivity]);

    useEffect(() => {
        dragStateRef.current = dragState;
    }, [dragState]);

    const clearDragState = useCallback((pointerId?: number) => {
        const activePointerId = pointerId ?? dragStateRef.current?.pointerId;

        if (
            activePointerId !== undefined &&
            dragElementRef.current?.hasPointerCapture(activePointerId)
        ) {
            dragElementRef.current.releasePointerCapture(activePointerId);
        }

        dragElementRef.current = null;
        dragStateRef.current = null;
        setDragState(null);
    }, []);

    const handleSavePlacedActivity = useCallback(
        (data: SavePlacedActivityPayload) => {
            dispatch({ type: "SAVE_PLACED_ACTIVITY", payload: data });
            setSelectedPlacedId(null);
        },
        [dispatch],
    );

    const handleDeletePlacedActivity = useCallback(
        (placedId: string) => {
            dispatch({ type: "REMOVE_PLACED_ACTIVITY", payload: placedId });
            setSelectedPlacedId(null);
        },
        [dispatch],
    );

    const handleActivityPointerDown = useCallback(
        (
            event: ReactPointerEvent<HTMLButtonElement>,
            activity: PlacedActivity,
        ) => {
            if (event.pointerType === "mouse" && event.button !== 0) {
                return;
            }

            const rect = event.currentTarget.getBoundingClientRect();
            const nextDragState: DragState = {
                pointerId: event.pointerId,
                placedId: activity.placedId,
                templateId: activity.templateId,
                duration: activity.endTime - activity.startTime,
                originClientX: event.clientX,
                originClientY: event.clientY,
                pointerOffsetY: event.clientY - rect.top,
                previewDay: activity.day,
                previewStartTime: activity.startTime,
                didDrag: false,
            };

            event.currentTarget.setPointerCapture(event.pointerId);
            dragElementRef.current = event.currentTarget;
            dragStateRef.current = nextDragState;
            setDragState(nextDragState);
        },
        [],
    );

    const handleActivityKeyDown = useCallback(
        (event: KeyboardEvent<HTMLButtonElement>, placedId: string) => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                setSelectedPlacedId(placedId);
            }
        },
        [],
    );

    useEffect(() => {
        if (!isDragging) {
            return;
        }

        const previousUserSelect = document.body.style.userSelect;
        document.body.style.userSelect = "none";

        const handlePointerMove = (event: PointerEvent) => {
            const currentDragState = dragStateRef.current;

            if (
                !currentDragState ||
                event.pointerId !== currentDragState.pointerId
            ) {
                return;
            }

            const distance = Math.hypot(
                event.clientX - currentDragState.originClientX,
                event.clientY - currentDragState.originClientY,
            );

            if (!currentDragState.didDrag && distance < DRAG_THRESHOLD) {
                return;
            }

            const previewDay = resolveDayFromPointerX(
                event.clientX,
                days,
                dayColumnRefs.current,
            );
            const previewStartTime = resolveStartTimeFromPointer(
                event.clientY,
                previewDay,
                currentDragState.pointerOffsetY,
                dayColumnRefs.current,
                startTime,
                endTime,
                slotDuration,
                currentDragState.duration,
            );
            const nextDragState: DragState = {
                ...currentDragState,
                didDrag: true,
                previewDay,
                previewStartTime,
            };

            dragStateRef.current = nextDragState;
            setDragState(nextDragState);
        };

        const handlePointerEnd = (event: PointerEvent) => {
            const currentDragState = dragStateRef.current;

            if (
                !currentDragState ||
                event.pointerId !== currentDragState.pointerId
            ) {
                return;
            }

            if (currentDragState.didDrag) {
                dispatch({
                    type: "EDIT_PLACED_ACTIVITY",
                    payload: {
                        placedId: currentDragState.placedId,
                        templateId: currentDragState.templateId,
                        day: currentDragState.previewDay,
                        startTime: currentDragState.previewStartTime,
                        endTime:
                            currentDragState.previewStartTime +
                            currentDragState.duration,
                    },
                });
            } else {
                setSelectedPlacedId(currentDragState.placedId);
            }

            clearDragState(currentDragState.pointerId);
        };

        const handlePointerCancel = (event: PointerEvent) => {
            const currentDragState = dragStateRef.current;

            if (
                !currentDragState ||
                event.pointerId !== currentDragState.pointerId
            ) {
                return;
            }

            clearDragState(currentDragState.pointerId);
        };

        window.addEventListener("pointermove", handlePointerMove);
        window.addEventListener("pointerup", handlePointerEnd);
        window.addEventListener("pointercancel", handlePointerCancel);

        return () => {
            document.body.style.userSelect = previousUserSelect;
            window.removeEventListener("pointermove", handlePointerMove);
            window.removeEventListener("pointerup", handlePointerEnd);
            window.removeEventListener("pointercancel", handlePointerCancel);
        };
    }, [
        clearDragState,
        days,
        dispatch,
        endTime,
        isDragging,
        slotDuration,
        startTime,
    ]);

    const columnHeight = slotTimes.length * SLOT_HEIGHT;

    return (
        <>
            <div className="app-panel flex h-full min-h-0 flex-col overflow-hidden">
                <div className="app-scrollbar min-h-0 flex-1 overflow-auto">
                    <div
                        className="grid min-w-190"
                        style={{
                            gridTemplateColumns: `${TIME_COLUMN_WIDTH}px repeat(${days.length}, minmax(0, 1fr))`,
                        }}
                    >
                        <div className="app-grid-header-cell app-grid-slot-border app-text-muted border-b border-r border-primary/8 pr-4 pt-4 pb-2 text-right text-[11px] font-semibold uppercase tracking-wide">
                            Time
                        </div>
                        {days.map((day) => (
                            <div
                                key={day}
                                className="app-grid-header-cell app-grid-slot-border app-text border-b border-primary/8 px-3 py-3 text-sm font-semibold"
                            >
                                {day}
                            </div>
                        ))}

                        <div className="app-grid-time-column app-grid-slot-border border-r border-primary/8">
                            {slotTimes.map((slot) => (
                                <div
                                    key={slot.minutes}
                                    className="app-grid-slot-border app-text-muted border-b pr-4 py-2 text-right text-[11px]"
                                    style={{ height: SLOT_HEIGHT }}
                                >
                                    {slot.label}
                                </div>
                            ))}
                        </div>

                        {days.map((day) => {
                            const dayActivities = renderedActivities.filter(
                                (activity) => activity.day === day,
                            );

                            return (
                                <div
                                    key={day}
                                    ref={(element) => {
                                        dayColumnRefs.current[day] = element;
                                    }}
                                    className={`app-grid-day-column app-grid-slot-border relative border-l border-primary/8 transition-colors ${
                                        dragState?.didDrag &&
                                        dragState.previewDay === day
                                            ? "app-grid-day-column--preview"
                                            : ""
                                    }`}
                                    style={{ height: columnHeight }}
                                >
                                    {slotTimes.map((slot) => (
                                        <div
                                            key={`${day}-${slot.minutes}`}
                                            className="app-grid-slot-border border-b"
                                            style={{ height: SLOT_HEIGHT }}
                                        />
                                    ))}

                                    {dayActivities.map((activity) => {
                                        const activityNotes =
                                            notesByActivity[
                                                activity.placedId
                                            ] ?? [];
                                        const overlapLayout = overlapLayouts[
                                            activity.placedId
                                        ] ?? {
                                            laneIndex: 0,
                                            laneCount: 1,
                                            isOverlapping: false,
                                        };
                                        const isRangeClipped =
                                            activity.visibleStartTime !==
                                                activity.startTime ||
                                            activity.visibleEndTime !==
                                                activity.endTime;
                                        const top =
                                            ((activity.visibleStartTime -
                                                startTime) /
                                                slotDuration) *
                                            SLOT_HEIGHT;
                                        const rawHeight = Math.max(
                                            ((activity.visibleEndTime -
                                                activity.visibleStartTime) /
                                                slotDuration) *
                                                SLOT_HEIGHT -
                                                6,
                                            10,
                                        );
                                        const height = isRangeClipped
                                            ? rawHeight
                                            : Math.max(
                                                  rawHeight,
                                                  SLOT_HEIGHT * 0.85,
                                              );
                                        const colorStyles = getColorStyles(
                                            activity.color,
                                        );
                                        const maxVisibleNotes = Math.max(
                                            0,
                                            Math.floor((height - 56) / 32),
                                        );
                                        const visibleNotes =
                                            activityNotes.slice(
                                                0,
                                                maxVisibleNotes,
                                            );
                                        const hiddenNotesCount = Math.max(
                                            0,
                                            activityNotes.length -
                                                visibleNotes.length,
                                        );
                                        const isDraggedActivity =
                                            dragState?.didDrag &&
                                            dragState.placedId ===
                                                activity.placedId;
                                        const leftInset =
                                            ACTIVITY_SIDE_INSET +
                                            overlapLayout.laneIndex *
                                                OVERLAP_STAGGER;
                                        const rightInset =
                                            ACTIVITY_SIDE_INSET +
                                            (overlapLayout.laneCount -
                                                overlapLayout.laneIndex -
                                                1) *
                                                OVERLAP_STAGGER;

                                        return (
                                            <button
                                                key={activity.placedId}
                                                type="button"
                                                className={`${colorStyles.soft} ${colorStyles.border} absolute touch-none select-none overflow-hidden rounded-xl border px-3 py-2 text-left shadow-sm transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 ${
                                                    isDraggedActivity
                                                        ? "z-30 cursor-grabbing shadow-lg ring-1 ring-primary/20"
                                                        : overlapLayout.isOverlapping
                                                          ? "z-10 cursor-grab opacity-80 ring-1 ring-white/50 backdrop-blur-[1px] hover:z-30 hover:-translate-y-0.5 hover:opacity-100 hover:shadow-lg hover:saturate-150 hover:brightness-105 hover:ring-2 hover:ring-primary/25 active:cursor-grabbing"
                                                          : "cursor-grab hover:z-20 hover:-translate-y-0.5 hover:shadow-md hover:ring-1 hover:ring-primary/15 active:cursor-grabbing"
                                                }`}
                                                style={{
                                                    top: top + 3,
                                                    height,
                                                    left: leftInset,
                                                    right: rightInset,
                                                    zIndex: isDraggedActivity
                                                        ? 30
                                                        : overlapLayout.isOverlapping
                                                          ? 10 +
                                                            overlapLayout.laneIndex
                                                          : 1,
                                                }}
                                                onPointerDown={(event) =>
                                                    handleActivityPointerDown(
                                                        event,
                                                        activity,
                                                    )
                                                }
                                                onKeyDown={(event) =>
                                                    handleActivityKeyDown(
                                                        event,
                                                        activity.placedId,
                                                    )
                                                }
                                                aria-label={`Edit ${activity.title}`}
                                            >
                                                <div
                                                    className={`text-sm font-semibold ${colorStyles.text}`}
                                                >
                                                    {activity.title}
                                                </div>
                                                <p className="app-text-muted mt-1 text-xs">
                                                    {formatMinutes(
                                                        activity.startTime,
                                                    )}{" "}
                                                    -{" "}
                                                    {formatMinutes(
                                                        activity.endTime,
                                                    )}
                                                </p>
                                                {overlapLayout.isOverlapping && (
                                                    <p className="app-text-subtle mt-2 text-[10px] font-semibold uppercase tracking-[0.18em]">
                                                        Overlap{" "}
                                                        {overlapLayout.laneIndex +
                                                            1}
                                                        /
                                                        {
                                                            overlapLayout.laneCount
                                                        }
                                                    </p>
                                                )}
                                                {(visibleNotes.length > 0 ||
                                                    hiddenNotesCount > 0) && (
                                                    <ul className="mt-3 space-y-2">
                                                        {visibleNotes.map(
                                                            (note) => {
                                                                const noteStyles =
                                                                    getColorStyles(
                                                                        note.color,
                                                                    );

                                                                return (
                                                                    <li
                                                                        key={
                                                                            note.id
                                                                        }
                                                                        className="app-text-soft flex items-start gap-2 text-xs"
                                                                    >
                                                                        <span
                                                                            className={`${noteStyles.solid} mt-1 h-2 w-2 shrink-0 rounded-full`}
                                                                        />
                                                                        <span className="min-w-0 truncate font-medium">
                                                                            {
                                                                                note.title
                                                                            }
                                                                        </span>
                                                                    </li>
                                                                );
                                                            },
                                                        )}
                                                        {hiddenNotesCount >
                                                            0 && (
                                                            <li className="app-text-subtle text-[11px] font-medium uppercase tracking-wide">
                                                                +
                                                                {
                                                                    hiddenNotesCount
                                                                }{" "}
                                                                more
                                                            </li>
                                                        )}
                                                    </ul>
                                                )}
                                            </button>
                                        );
                                    })}

                                    {dayActivities.length === 0 && (
                                        <div className="app-text-subtle pointer-events-none absolute inset-0 flex items-center justify-center text-xs">
                                            No activities
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {selectedActivity ? (
                <EditPlacedActivityModal
                    open={selectedActivity !== null}
                    onOpenChange={(open) => {
                        if (!open) {
                            setSelectedPlacedId(null);
                        }
                    }}
                    templateOptions={templateOptions}
                    timeOptions={timeOptions}
                    placedId={selectedActivity.placedId}
                    initialData={{
                        templateId: selectedActivity.templateId,
                        day: selectedActivity.day,
                        startTime: selectedActivity.startTime,
                        endTime: selectedActivity.endTime,
                        notes: selectedActivityNotes,
                    }}
                    onSubmit={handleSavePlacedActivity}
                    onDelete={() =>
                        handleDeletePlacedActivity(selectedActivity.placedId)
                    }
                />
            ) : null}
        </>
    );
}
