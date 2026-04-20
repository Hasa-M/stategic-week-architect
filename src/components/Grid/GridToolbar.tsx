import { Expand, Minimize2, Plus } from "lucide-react";
import {
    useEffect,
    useMemo,
    useRef,
    useState,
    type ReactNode,
} from "react";

import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useDispatch, useScheduleContext, useUserContext } from "@/context/hooks";
import {
    ALL_DAYS,
    GRID_HOUR_OPTIONS,
    hourToMinutes,
    minutesToHour,
} from "@/lib/grid";
import type { Day, PlacedActivityDraft, SlotWindow } from "@/types";
import PlaceActivityModal from "./PlaceActivityModal";

const SLOT_OPTIONS: {
    value: SlotWindow;
    label: string;
    compactLabel: string;
}[] = [
    { value: 30, label: "30 min", compactLabel: "30m" },
    { value: 60, label: "1 hour", compactLabel: "1h" },
];

type GridSettingsControlsProps = {
    className?: string;
    stacked?: boolean;
    singleLine?: boolean;
    measurement?: boolean;
    trailingActions?: ReactNode;
    inputIdPrefix?: string;
};

type GridToolbarProps = {
    layout?: "desktop" | "tablet" | "mobile";
    onOpenSettings?: () => void;
    isExpanded?: boolean;
    onToggleExpand?: () => void;
    onCompactChange?: (isCompact: boolean) => void;
};

function formatRangeLabel(startTime: number, endTime: number) {
    return `${minutesToHour(startTime)}-${minutesToHour(endTime)}`;
}

function formatMinutes(minutes: number) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    return `${hours.toString().padStart(2, "0")}:${mins
        .toString()
        .padStart(2, "0")}`;
}

function AddActivityAction({ className }: { className?: string }) {
    const schedule = useScheduleContext();
    const user = useUserContext();
    const dispatch = useDispatch();
    const buttonClassName = cn(className, "h-8 min-h-8 rounded-full");

    const templateOptions = useMemo(
        () =>
            Object.values(user.templates).map((template) => ({
                value: template.templateId,
                label: template.title,
                color: template.color,
            })),
        [user.templates]
    );

    const timeOptions = useMemo(() => {
        const options: { value: string; label: string }[] = [];

        for (
            let minutes = schedule.grid.startTime;
            minutes <= schedule.grid.endTime;
            minutes += schedule.grid.slotDuration
        ) {
            options.push({
                value: String(minutes),
                label: formatMinutes(minutes),
            });
        }

        return options;
    }, [schedule.grid.endTime, schedule.grid.slotDuration, schedule.grid.startTime]);

    const handlePlaceActivity = (data: PlacedActivityDraft) => {
        dispatch({
            type: "PLACE_ACTIVITY",
            payload: data,
        });
    };

    if (templateOptions.length === 0) {
        return (
            <Button
                size="sm"
                className={buttonClassName}
                disabled
                title="Create at least one template before placing activities on the grid."
            >
                <Plus className="size-3.5" />
                Add Activity
            </Button>
        );
    }

    return (
        <PlaceActivityModal
            templateOptions={templateOptions}
            timeOptions={timeOptions}
            onSubmit={handlePlaceActivity}
        >
            <Button size="sm" className={buttonClassName}>
                <Plus className="size-3.5" />
                Add Activity
            </Button>
        </PlaceActivityModal>
    );
}

function ExpandGridAction({
    isExpanded = false,
    onToggleExpand,
}: Pick<GridToolbarProps, "isExpanded" | "onToggleExpand">) {
    if (!onToggleExpand) {
        return null;
    }

    const label = isExpanded
        ? "Exit full-page grid"
        : "Expand grid to full page";

    return (
        <Button
            type="button"
            variant="outline"
            size="icon-sm"
            className="size-8 shrink-0"
            onClick={onToggleExpand}
            aria-label={label}
            aria-pressed={isExpanded}
            title={label}
        >
            {isExpanded ? (
                <Minimize2 className="size-4" />
            ) : (
                <Expand className="size-4" />
            )}
        </Button>
    );
}

export function GridSettingsControls({
    className,
    stacked = false,
    singleLine = false,
    measurement = false,
    trailingActions,
    inputIdPrefix,
}: GridSettingsControlsProps) {
    const schedule = useScheduleContext();
    const dispatch = useDispatch();
    const startHour = minutesToHour(schedule.grid.startTime);
    const endHour = minutesToHour(schedule.grid.endTime);
    const startTimeSelectId = inputIdPrefix
        ? `${inputIdPrefix}start-time`
        : "grid-start-time";
    const endTimeSelectId = inputIdPrefix
        ? `${inputIdPrefix}end-time`
        : "grid-end-time";

    const toggleDay = (day: Day) => {
        const selectedDays = schedule.grid.days;
        const isSelected = selectedDays.includes(day);

        if (isSelected && selectedDays.length === 1) {
            return;
        }

        const nextDays = isSelected
            ? selectedDays.filter((selectedDay) => selectedDay !== day)
            : ALL_DAYS.filter((candidate) =>
                  [...selectedDays, day].includes(candidate)
              );

        dispatch({ type: "SET_GRID_DAYS", payload: nextDays });
    };

    const handleSlotDurationChange = (slotDuration: SlotWindow) => {
        dispatch({
            type: "SET_GRID_SLOT_DURATION",
            payload: slotDuration,
        });
    };

    const handleStartHourChange = (value: string) => {
        const nextStartHour = Number(value);

        dispatch({
            type: "SET_GRID_TIME_RANGE",
            payload: {
                startTime: hourToMinutes(nextStartHour),
                endTime: hourToMinutes(Math.max(nextStartHour + 1, endHour)),
            },
        });
    };

    const handleEndHourChange = (value: string) => {
        const nextEndHour = Number(value);

        dispatch({
            type: "SET_GRID_TIME_RANGE",
            payload: {
                startTime: hourToMinutes(Math.min(startHour, nextEndHour - 1)),
                endTime: hourToMinutes(nextEndHour),
            },
        });
    };

    const startHourOptions = GRID_HOUR_OPTIONS.slice(0, -1).map((hour) => ({
        value: String(hour),
        label: String(hour),
        disabled: hour >= endHour,
    }));

    const endHourOptions = GRID_HOUR_OPTIONS.slice(1).map((hour) => ({
        value: String(hour),
        label: String(hour),
        disabled: hour <= startHour,
    }));

    return (
        <div
            className={cn(
                singleLine
                    ? measurement
                        ? "inline-flex w-max min-w-max items-center gap-2.5"
                        : "flex min-w-0 w-full items-center gap-2.5 justify-between"
                    : "flex flex-col gap-3",
                !singleLine && !stacked && "md:flex-row md:flex-wrap md:items-center",
                className
            )}
        >
            <div
                className={cn(
                    "flex items-center",
                    singleLine
                        ? "shrink-0 flex-nowrap gap-1.5"
                        : "flex-1 flex-wrap gap-1.5 xl:min-w-84"
                )}
            >
                <span className="app-text-muted mr-1 text-[11px] font-semibold uppercase tracking-[0.08em]">
                    Visible days
                </span>
                {ALL_DAYS.map((day) => {
                    const isSelected = schedule.grid.days.includes(day);

                    return (
                        <Button
                            key={day}
                            type="button"
                            variant={isSelected ? "default" : "outline"}
                            size="sm"
                            className="h-7 rounded-full px-2.5 text-[11px]"
                            onClick={() => toggleDay(day)}
                        >
                            {day.slice(0, 3)}
                        </Button>
                    );
                })}
            </div>

            <div
                className={cn(
                    "flex w-fit max-w-full items-center",
                    singleLine
                        ? "shrink-0 flex-nowrap gap-2.5 self-auto"
                        : "flex-none flex-wrap gap-2.5 self-start md:self-auto"
                )}
            >
                <span className="app-text-muted shrink-0 text-[11px] font-semibold uppercase tracking-[0.08em]">
                    Slot size
                </span>
                <div className="app-segmented-control inline-flex min-w-0 rounded-full border p-0.5">
                    {SLOT_OPTIONS.map((option) => {
                        const isSelected = schedule.grid.slotDuration === option.value;

                        return (
                            <button
                                key={option.value}
                                type="button"
                                className={cn(
                                    "app-segmented-control__button rounded-full px-3 py-1.5 text-xs font-medium transition-all",
                                    isSelected &&
                                        "app-segmented-control__button--active"
                                )}
                                onClick={() => handleSlotDurationChange(option.value)}
                                aria-pressed={isSelected}
                            >
                                <span className="sm:hidden">{option.compactLabel}</span>
                                <span className="hidden sm:inline">{option.label}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            <div
                className={cn(
                    singleLine ? "flex shrink-0 items-center gap-2.5" : "flex flex-col gap-3",
                    trailingActions &&
                        !stacked &&
                        !singleLine &&
                        "md:basis-full md:flex-row md:items-center"
                )}
            >
                <div
                    className={cn(
                        "flex items-center",
                        singleLine
                            ? "shrink-0 flex-nowrap gap-2.5"
                            : "flex-1 flex-wrap gap-2.5 xl:min-w-64 xl:basis-auto"
                    )}
                >
                    <span className="app-text-muted shrink-0 text-[11px] font-semibold uppercase tracking-[0.08em]">
                        Time range
                    </span>
                    <div
                        className={cn(
                            "flex items-center gap-1.5",
                            singleLine ? "shrink-0" : "min-w-0 flex-1"
                        )}
                    >
                        <Select
                            id={startTimeSelectId}
                            name="gridStartTime"
                            value={String(startHour)}
                            onValueChange={handleStartHourChange}
                            options={startHourOptions}
                            className={cn(
                                "h-8 rounded-lg px-3 py-1.5 text-xs",
                                singleLine ? "w-20" : "min-w-20 flex-1"
                            )}
                        />
                        <span className="app-text-subtle text-xs font-medium">to</span>
                        <Select
                            id={endTimeSelectId}
                            name="gridEndTime"
                            value={String(endHour)}
                            onValueChange={handleEndHourChange}
                            options={endHourOptions}
                            className={cn(
                                "h-8 rounded-lg px-3 py-1.5 text-xs",
                                singleLine ? "w-20" : "min-w-20 flex-1"
                            )}
                        />
                    </div>
                </div>

                {trailingActions ? (
                    <div
                        className={cn(
                            singleLine
                                ? "flex shrink-0 items-center gap-1.5"
                                : "flex flex-wrap items-center justify-end gap-1.5 md:flex-none md:self-center"
                        )}
                    >
                        {trailingActions}
                    </div>
                ) : null}
            </div>
        </div>
    );
}

function GridToolbarSummary({
    onOpenSettings,
    isExpanded,
    onToggleExpand,
    slotSizeLabel,
    timeRangeLabel,
}: Pick<GridToolbarProps, "onOpenSettings" | "isExpanded" | "onToggleExpand"> & {
    slotSizeLabel: string;
    timeRangeLabel: string;
}) {
    const schedule = useScheduleContext();

    return (
        <div className="flex flex-col gap-2 py-0.5">
            <div className="app-panel-muted flex items-center justify-between gap-2 p-2.5">
                <div className="min-w-0">
                    <p className="app-text text-xs font-semibold uppercase tracking-[0.08em]">
                        Grid settings
                    </p>
                    <p className="app-text-muted mt-0.5 truncate text-[11px]">
                        {schedule.grid.days.length} visible day
                        {schedule.grid.days.length === 1 ? "" : "s"} · {slotSizeLabel} · {timeRangeLabel}
                    </p>
                </div>

                {onOpenSettings ? (
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-9 w-32 shrink-0 rounded-full px-4 text-xs font-semibold"
                        onClick={onOpenSettings}
                    >
                        Open settings
                    </Button>
                ) : null}
            </div>

            <div className="flex items-center gap-1.5">
                <AddActivityAction className="flex-1 justify-center px-3.5 text-xs" />
                <ExpandGridAction
                    isExpanded={isExpanded}
                    onToggleExpand={onToggleExpand}
                />
            </div>
        </div>
    );
}

function GridToolbarStacked({
    isExpanded,
    onToggleExpand,
}: Pick<GridToolbarProps, "isExpanded" | "onToggleExpand">) {
    return (
        <div className="app-card flex flex-col gap-4 p-2.5">
            <GridSettingsControls singleLine className="w-full" />

            <div className="flex items-center gap-1.5">
                <AddActivityAction className="flex-1 justify-center px-3.5 text-xs" />
                <ExpandGridAction
                    isExpanded={isExpanded}
                    onToggleExpand={onToggleExpand}
                />
            </div>
        </div>
    );
}

function GridToolbarInline({
    isExpanded,
    onToggleExpand,
    measurement = false,
}: Pick<GridToolbarProps, "isExpanded" | "onToggleExpand"> & {
    measurement?: boolean;
}) {
    return (
        <div
            className={cn(
                "app-card p-2.5",
                measurement ? "inline-flex w-max items-center" : "overflow-hidden"
            )}
        >
            <GridSettingsControls
                singleLine
                measurement={measurement}
                className={measurement ? undefined : "w-full"}
                inputIdPrefix={measurement ? "grid-toolbar-measure-" : undefined}
                trailingActions={
                    <>
                        <AddActivityAction className="px-3 text-xs" />
                        <ExpandGridAction
                            isExpanded={isExpanded}
                            onToggleExpand={onToggleExpand}
                        />
                    </>
                }
            />
        </div>
    );
}

export default function GridToolbar({
    layout = "desktop",
    onOpenSettings,
    isExpanded = false,
    onToggleExpand,
    onCompactChange,
}: GridToolbarProps) {
    const schedule = useScheduleContext();
    const toolbarContainerRef = useRef<HTMLDivElement | null>(null);
    const toolbarMeasureRef = useRef<HTMLDivElement | null>(null);
    const [useStackedLayout, setUseStackedLayout] = useState(false);

    const slotSizeLabel =
        SLOT_OPTIONS.find((option) => option.value === schedule.grid.slotDuration)
            ?.label ?? `${schedule.grid.slotDuration} min`;
    const timeRangeLabel = formatRangeLabel(
        schedule.grid.startTime,
        schedule.grid.endTime
    );
    const visibleDaysKey = schedule.grid.days.join("|");
    const isCompact = layout === "mobile" || useStackedLayout;

    useEffect(() => {
        if (layout === "mobile") {
            return;
        }

        const container = toolbarContainerRef.current;
        const measure = toolbarMeasureRef.current;

        if (!container || !measure) {
            return;
        }

        let frameId = 0;

        const updateLayoutMode = () => {
            cancelAnimationFrame(frameId);
            frameId = requestAnimationFrame(() => {
                const nextUseStackedLayout =
                    measure.scrollWidth > container.clientWidth + 1;

                setUseStackedLayout((current) =>
                    current === nextUseStackedLayout ? current : nextUseStackedLayout
                );
            });
        };

        updateLayoutMode();

        const observer = new ResizeObserver(() => {
            updateLayoutMode();
        });

        observer.observe(container);
        observer.observe(measure);

        return () => {
            cancelAnimationFrame(frameId);
            observer.disconnect();
        };
    }, [
        layout,
        visibleDaysKey,
        schedule.grid.endTime,
        schedule.grid.slotDuration,
        schedule.grid.startTime,
    ]);

    useEffect(() => {
        onCompactChange?.(isCompact);
    }, [isCompact, onCompactChange]);

    if (layout === "mobile") {
        return (
            <GridToolbarSummary
                onOpenSettings={onOpenSettings}
                isExpanded={isExpanded}
                onToggleExpand={onToggleExpand}
                slotSizeLabel={slotSizeLabel}
                timeRangeLabel={timeRangeLabel}
            />
        );
    }

    return (
        <div ref={toolbarContainerRef} className="relative py-0.5">
            <div
                ref={toolbarMeasureRef}
                aria-hidden="true"
                className="pointer-events-none absolute top-0 left-0 -z-10 overflow-hidden opacity-0"
            >
                <GridToolbarInline
                    measurement
                    isExpanded={isExpanded}
                    onToggleExpand={onToggleExpand}
                />
            </div>

            {useStackedLayout ? (
                <GridToolbarStacked
                    isExpanded={isExpanded}
                    onToggleExpand={onToggleExpand}
                />
            ) : (
                <GridToolbarInline
                    isExpanded={isExpanded}
                    onToggleExpand={onToggleExpand}
                />
            )}
        </div>
    );
}
