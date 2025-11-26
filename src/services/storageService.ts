import { type DataType } from "@/types";

export const storageService = {
    loadData: <T>(type: DataType): T | null => {
        try {
            const serializedState = localStorage.getItem(`${type}_data_v1`);
            if (serializedState === null) {
                return null;
            }
            return JSON.parse(serializedState) as T;
        } catch (e) {
            console.error("Failed to load schedule from storage:", e);
            return null;
        }
    },

    saveData: <T>(type: DataType, toSave: T): void => {
        try {
            const serializedState = JSON.stringify(toSave);
            localStorage.setItem(`${type}_data_v1`, serializedState);
        } catch (e) {
            console.error("Failed to save schedule from storage", e);
        }
    },

    clearData: (type: DataType): void => {
        try {
            localStorage.removeItem(`${type}_data_v1`);
        } catch (e) {
            console.error("Failed to clear storage:", e);
        }
    },

    clearAllData: (): void => {
        try {
            localStorage.removeItem("activities_data_v1");
            localStorage.removeItem("grid_data_v1");
            localStorage.removeItem("placed_activities_data_v1");
            localStorage.removeItem("notes_data_v1");
        } catch (e) {
            console.error("Failed to clear storage:", e);
        }
    },
};
