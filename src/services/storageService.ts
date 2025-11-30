import type { ScheduleState } from "@/types";

const STORAGE_KEY = "schedule_state_v1";

export const storageService = {
    loadState: (): ScheduleState | null => {
        try {
            const serializedState = localStorage.getItem(STORAGE_KEY);
            if (serializedState === null) {
                return null;
            }
            return JSON.parse(serializedState) as ScheduleState;
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
            console.error("Failed to save schedule from storage", e);
        }
    },

    clearState: (): void => {
        try {
            localStorage.removeItem(STORAGE_KEY);
        } catch (e) {
            console.error("Failed to clear storage:", e);
        }
    },
    //---------------AI GENERATED END-------------------
};
