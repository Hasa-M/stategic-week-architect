import { Expand, Minimize2, Plus } from "lucide-react";
import { useMemo, type ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useDispatch, useScheduleContext } from "@/context/hooks";
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
    trailingActions?: ReactNode;
};

type GridToolbarProps = {
    layout?: "desktop" | "tablet" | "mobile";
    onOpenSettings?: () => void;
    isExpanded?: boolean;
    onToggleExpand?: () => void;
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
    const dispatch = useDispatch();

    const templateOptions = useMemo(
        () =>
            Object.values(schedule.templates).map((template) => ({
                value: template.templateId,
                label: template.title,
                color: template.color,
            })),
        [schedule.templates]
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
                className={cn("rounded-full", className)}
                disabled
                title="Create at least one template before placing activities on the grid."
            >
                <Plus size={16} />
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
            <Button className={cn("rounded-full", className)}>
                <Plus size={16} />
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
            className="shrink-0"
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
    trailingActions,
}: GridSettingsControlsProps) {
    const schedule = useScheduleContext();
    const dispatch = useDispatch();
    const startHour = minutesToHour(schedule.grid.startTime);
    const endHour = minutesToHour(schedule.grid.endTime);

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
                "flex flex-col gap-4",
                !stacked && "md:flex-row md:flex-wrap md:items-center",
                className
            )}
        >
            <div className="app-panel-muted flex flex-1 flex-wrap items-center gap-2 p-3.5 xl:min-w-92">
                <span className="app-text-muted mr-2 text-sm font-medium">
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
                            className="rounded-full"
                            onClick={() => toggleDay(day)}
                        >
                            {day.slice(0, 3)}
                        </Button>
                    );
                })}
            </div>

            <div className="app-panel-muted flex w-fit max-w-full flex-none flex-wrap items-center gap-3 self-start p-3.5 md:self-auto">
                <span className="app-text-muted shrink-0 text-sm font-medium">
                    Slot size
                </span>
                <div className="app-segmented-control inline-flex min-w-0 rounded-full border p-1">
                    {SLOT_OPTIONS.map((option) => {
                        const isSelected = schedule.grid.slotDuration === option.value;

                        return (
                            <button
                                key={option.value}
                                type="button"
                                className={cn(
                                    "app-segmented-control__button rounded-full px-3.5 py-2 text-sm font-medium transition-all",
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
                    "flex flex-col gap-4",
                    trailingActions && !stacked && "md:basis-full md:flex-row md:items-center"
                )}
            >
                <div className="app-panel-muted flex flex-1 flex-wrap items-center gap-3 p-3.5 xl:min-w-72 xl:basis-auto">
                    <span className="app-text-muted shrink-0 text-sm font-medium">
                        Time range
                    </span>
                    <div className="flex min-w-0 flex-1 items-center gap-2">
                        <Select
                            id="grid-start-time"
                            name="gridStartTime"
                            value={String(startHour)}
                            onValueChange={handleStartHourChange}
                            options={startHourOptions}
                            className="min-w-24 flex-1"
                        />
                        <span className="app-text-subtle text-sm font-medium">to</span>
                        <Select
                            id="grid-end-time"
                            name="gridEndTime"
                            value={String(endHour)}
                            onValueChange={handleEndHourChange}
                            options={endHourOptions}
                            className="min-w-24 flex-1"
                        />
                    </div>
                </div>

                {trailingActions ? (
                    <div className="flex flex-wrap items-center justify-end gap-2 md:flex-none md:self-center">
                        {trailingActions}
                    </div>
                ) : null}
            </div>
        </div>
    );
}

function GridToolbarContent({
    layout,
    onOpenSettings,
    isExpanded,
    onToggleExpand,
    slotSizeLabel,
    timeRangeLabel,
}: GridToolbarProps & { slotSizeLabel: string; timeRangeLabel: string }) {
    const schedule = useScheduleContext();

    if (layout === "mobile") {
        return (
            <div className="flex flex-col gap-3 py-1">
                <div className="app-panel-muted flex flex-col gap-3 p-3.5 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                        <p className="app-text text-sm font-semibold">
                            Grid settings
                        </p>
                        <p className="app-text-muted text-sm">
                            {schedule.grid.days.length} visible day
                            {schedule.grid.days.length === 1 ? "" : "s"} · {slotSizeLabel} · {timeRangeLabel}
                        </p>
                    </div>

                    <Button
                        type="button"
                        variant="outline"
                        className="w-full sm:w-auto"
                        onClick={onOpenSettings}
                    >
                        Open settings
                    </Button>
                </div>

                <div className="flex items-center gap-2">
                    <AddActivityAction className="flex-1 justify-center" />
                    <ExpandGridAction
                        isExpanded={isExpanded}
                        onToggleExpand={onToggleExpand}
                    />
                </div>
            </div>
        );
    }

    if (layout === "tablet") {
        return (
            <div className="py-1">
                <GridSettingsControls
                    className="flex-1"
                    trailingActions={
                        <>
                            <AddActivityAction />
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

    return (
        <div className="flex flex-col gap-4 py-1 xl:flex-row xl:items-center">
            <GridSettingsControls className="flex-1" />
            <div className="flex flex-wrap items-center justify-end gap-2">
                <AddActivityAction />
                <ExpandGridAction
                    isExpanded={isExpanded}
                    onToggleExpand={onToggleExpand}
                />
            </div>
        </div>
    );
}

export default function GridToolbar({
    layout = "desktop",
    onOpenSettings,
    isExpanded = false,
    onToggleExpand,
}: GridToolbarProps) {
    const schedule = useScheduleContext();

    const slotSizeLabel =
        SLOT_OPTIONS.find((option) => option.value === schedule.grid.slotDuration)
            ?.label ?? `${schedule.grid.slotDuration} min`;
    const timeRangeLabel = formatRangeLabel(
        schedule.grid.startTime,
        schedule.grid.endTime
    );

    return (
        <GridToolbarContent
            layout={layout}
            onOpenSettings={onOpenSettings}
            isExpanded={isExpanded}
            onToggleExpand={onToggleExpand}
            slotSizeLabel={slotSizeLabel}
            timeRangeLabel={timeRangeLabel}
        />
    );
}
