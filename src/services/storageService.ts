import type { ScheduleState } from "@/types";

const STORAGE_KEY = "schedule_state_v1";

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null;
}

function isScheduleState(value: unknown): value is ScheduleState {
    if (!isRecord(value)) {
        return false;
    }

    const { id, name, templates, placedActivities, notes, grid } = value;

    return (
        typeof id === "string" &&
        typeof name === "string" &&
        isRecord(templates) &&
        isRecord(placedActivities) &&
        isRecord(notes) &&
        isRecord(grid) &&
        Array.isArray(grid.days) &&
        typeof grid.slotDuration === "number" &&
        typeof grid.startTime === "number" &&
        typeof grid.endTime === "number"
    );
}

export const storageService = {
    loadState: (): ScheduleState | null => {
        try {
            const serializedState = localStorage.getItem(STORAGE_KEY);
            if (serializedState === null) {
                return null;
            }

            const parsedState: unknown = JSON.parse(serializedState);

            if (!isScheduleState(parsedState)) {
                console.warn("Discarded invalid schedule state from storage.");
                localStorage.removeItem(STORAGE_KEY);
                return null;
            }

            return parsedState;
        } catch (e) {
            console.error("Failed to load schedule from storage:", e);
            return null;
        }
    },

    saveState: (state: ScheduleState): void => {
        try {
            const serializedState = JSON.stringify(state);
            localStorage.setItem(STORAGE_KEY, serializedState);
        } catch (e) {
            console.error("Failed to save schedule to storage:", e);
        }
    },

    clearState: (): void => {
        try {
            localStorage.removeItem(STORAGE_KEY);
        } catch (e) {
            console.error("Failed to clear storage:", e);
        }
    },
};
