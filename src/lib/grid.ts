import type { Day, DaysGrid, PlacedActivity, SlotWindow } from "@/types";

export type VisiblePlacedActivity = PlacedActivity & {
    visibleStartTime: number;
    visibleEndTime: number;
};

export const ALL_DAYS: Day[] = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
];

export const GRID_HOUR_OPTIONS = Array.from({ length: 25 }, (_, index) => index);

export const DEFAULT_GRID_SLOT_DURATION: SlotWindow = 30;
export const DEFAULT_GRID_START_TIME = 8 * 60;
export const DEFAULT_GRID_END_TIME = 20 * 60;
export const START_OF_DAY_MINUTES = 0;
export const END_OF_DAY_MINUTES = 24 * 60;
export const TIME_MINUTE_STEP = 5;
export const TIME_MINUTE_OPTIONS = Array.from(
    { length: 60 / TIME_MINUTE_STEP },
    (_, index) => index * TIME_MINUTE_STEP
);

const MIN_GRID_HOUR = 0;
const MAX_GRID_HOUR = 24;
const MIN_GRID_SPAN_HOURS = 1;
const VALID_GRID_SLOT_DURATIONS: SlotWindow[] = [15, 30, 60];

function clamp(value: number, min: number, max: number) {
    return Math.min(Math.max(value, min), max);
}

function normalizeGridDays(days: DaysGrid["days"]): Day[] {
    const validDays = ALL_DAYS.filter((day) => days.includes(day));

    return validDays.length > 0 ? validDays : ["Monday"];
}

export function hourToMinutes(hour: number) {
    return hour * 60;
}

export function minutesToHour(minutes: number) {
    return Math.floor(minutes / 60);
}

export function clampMinutesToRange(
    minutes: number,
    minMinutes = START_OF_DAY_MINUTES,
    maxMinutes = END_OF_DAY_MINUTES
) {
    return clamp(minutes, minMinutes, maxMinutes);
}

export function normalizeTimeValue(
    minutes: number,
    {
        minMinutes = START_OF_DAY_MINUTES,
        maxMinutes = END_OF_DAY_MINUTES,
        step = TIME_MINUTE_STEP,
    }: {
        minMinutes?: number;
        maxMinutes?: number;
        step?: number;
    } = {}
) {
    const safeMinMinutes = clamp(
        minMinutes,
        START_OF_DAY_MINUTES,
        END_OF_DAY_MINUTES
    );
    const safeMaxMinutes = clamp(
        maxMinutes,
        safeMinMinutes,
        END_OF_DAY_MINUTES
    );

    if (!Number.isFinite(minutes)) {
        return safeMinMinutes;
    }

    const clampedMinutes = clamp(minutes, safeMinMinutes, safeMaxMinutes);

    if (clampedMinutes === END_OF_DAY_MINUTES) {
        return clampedMinutes;
    }

    return clamp(
        Math.round(clampedMinutes / step) * step,
        safeMinMinutes,
        safeMaxMinutes
    );
}

export function toTimeValue(hours: number, minutes: number) {
    return hours * 60 + minutes;
}

export function getTimeParts(minutes: number) {
    const normalizedMinutes = clampMinutesToRange(minutes);

    if (normalizedMinutes === END_OF_DAY_MINUTES) {
        return {
            hours: MAX_GRID_HOUR,
            minutes: 0,
        };
    }

    return {
        hours: Math.floor(normalizedMinutes / 60),
        minutes: normalizedMinutes % 60,
    };
}

export function formatMinutes(minutes: number) {
    const { hours, minutes: minuteValue } = getTimeParts(minutes);

    return `${hours.toString().padStart(2, "0")}:${minuteValue
        .toString()
        .padStart(2, "0")}`;
}

export function isTimeWithinRange(
    minutes: number,
    rangeStartTime: number,
    rangeEndTime: number
) {
    return minutes >= rangeStartTime && minutes <= rangeEndTime;
}

export function isValidGridSlotDuration(value: number): value is SlotWindow {
    return VALID_GRID_SLOT_DURATIONS.includes(value as SlotWindow);
}

export function normalizeGridRange(startTime: number, endTime: number) {
    const safeStartTime = Number.isFinite(startTime)
        ? startTime
        : DEFAULT_GRID_START_TIME;
    const safeEndTime = Number.isFinite(endTime)
        ? endTime
        : DEFAULT_GRID_END_TIME;
    const normalizedStartHour = clamp(
        Math.floor(safeStartTime / 60),
        MIN_GRID_HOUR,
        MAX_GRID_HOUR - MIN_GRID_SPAN_HOURS
    );
    const normalizedEndHour = clamp(
        Math.ceil(safeEndTime / 60),
        normalizedStartHour + MIN_GRID_SPAN_HOURS,
        MAX_GRID_HOUR
    );

    return {
        startTime: hourToMinutes(normalizedStartHour),
        endTime: hourToMinutes(normalizedEndHour),
    };
}

export function normalizeGridSettings(grid: DaysGrid): DaysGrid {
    const normalizedRange = normalizeGridRange(grid.startTime, grid.endTime);

    return {
        ...grid,
        days: normalizeGridDays(grid.days),
        slotDuration: isValidGridSlotDuration(grid.slotDuration)
            ? grid.slotDuration
            : DEFAULT_GRID_SLOT_DURATION,
        ...normalizedRange,
    };
}

export function clipActivityToVisibleRange(
    activity: PlacedActivity,
    rangeStartTime: number,
    rangeEndTime: number
): VisiblePlacedActivity | null {
    const visibleStartTime = Math.max(activity.startTime, rangeStartTime);
    const visibleEndTime = Math.min(activity.endTime, rangeEndTime);

    if (visibleStartTime >= visibleEndTime) {
        return null;
    }

    return {
        ...activity,
        visibleStartTime,
        visibleEndTime,
    };
}
