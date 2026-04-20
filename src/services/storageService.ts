import {
    DEFAULT_GRID_END_TIME,
    DEFAULT_GRID_SLOT_DURATION,
    DEFAULT_GRID_START_TIME,
    normalizeGridSettings,
} from "@/lib/grid";
import {
    DEFAULT_THEME_MODE,
    type Activity,
    type Note,
    type PlacedActivity,
    type ScheduleState,
    type ThemeMode,
    type User,
} from "@/types";

const STORAGE_KEY = "user_state_v2";
const LEGACY_STORAGE_KEY = "schedule_state_v1";
const DEFAULT_LOCAL_USER_ID = "user_local";
const DEFAULT_LOCAL_USER_NAME = "Local Planner";
const DEFAULT_SCHEDULE_NAME = "My Weekly Schedule";
const VALID_COLORS = new Set([
    "red",
    "amber",
    "lime",
    "emerald",
    "cyan",
    "blue",
    "violet",
    "fuchsia",
    "pink",
    "slate",
    "stone",
]);
const VALID_DAYS = new Set([
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
]);

type PersistedUser = Omit<User, "theme"> & {
    theme?: ThemeMode;
};

type PersistedScheduleState = Pick<ScheduleState, "id" | "name" | "grid"> & {
    placedActivities: Record<string, unknown>;
    notes: Record<string, unknown>;
};

type LegacyPersistedScheduleState = {
    id: string;
    name: string;
    theme?: ThemeMode;
    templates: Record<string, unknown>;
    placedActivities: Record<string, unknown>;
    notes: Record<string, unknown>;
    grid: ScheduleState["grid"];
};

function createFallbackScheduleState(
    overrides: Partial<Pick<ScheduleState, "id" | "name">> = {},
): ScheduleState {
    return {
        id: overrides.id ?? crypto.randomUUID(),
        name: overrides.name?.trim() || DEFAULT_SCHEDULE_NAME,
        placedActivities: {},
        grid: normalizeGridSettings({
            days: [
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
                "Sunday",
            ],
            slotDuration: DEFAULT_GRID_SLOT_DURATION,
            startTime: DEFAULT_GRID_START_TIME,
            endTime: DEFAULT_GRID_END_TIME,
        }),
        notes: {},
    };
}

function createFallbackUserState(): User {
    const fallbackSchedule = createFallbackScheduleState();

    return {
        id: DEFAULT_LOCAL_USER_ID,
        displayName: DEFAULT_LOCAL_USER_NAME,
        theme: DEFAULT_THEME_MODE,
        activeScheduleId: fallbackSchedule.id,
        templates: {},
        schedules: {
            [fallbackSchedule.id]: fallbackSchedule,
        },
    };
}

function isThemeMode(value: unknown): value is ThemeMode {
    return (
        value === "light" || value === "high-contrast" || value === "dark"
    );
}

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isSubfactorArray(value: unknown): value is Activity["subfactors"] {
    return (
        Array.isArray(value) &&
        value.every(
            (subfactor) =>
                isRecord(subfactor) &&
                typeof subfactor.title === "string" &&
                typeof subfactor.description === "string",
        )
    );
}

function isActivity(value: unknown): value is Activity {
    if (!isRecord(value)) {
        return false;
    }

    return (
        typeof value.templateId === "string" &&
        typeof value.title === "string" &&
        typeof value.description === "string" &&
        typeof value.color === "string" &&
        VALID_COLORS.has(value.color) &&
        isSubfactorArray(value.subfactors)
    );
}

function isPlacedActivity(value: unknown): value is PlacedActivity {
    if (!isRecord(value)) {
        return false;
    }

    return (
        typeof value.templateId === "string" &&
        typeof value.day === "string" &&
        VALID_DAYS.has(value.day) &&
        typeof value.placedId === "string" &&
        typeof value.startTime === "number" &&
        typeof value.endTime === "number" &&
        typeof value.title === "string" &&
        typeof value.description === "string" &&
        typeof value.color === "string" &&
        VALID_COLORS.has(value.color) &&
        isSubfactorArray(value.subfactors)
    );
}

function isNote(value: unknown): value is Note {
    if (!isRecord(value)) {
        return false;
    }

    return (
        typeof value.id === "string" &&
        typeof value.title === "string" &&
        typeof value.content === "string" &&
        typeof value.activityId === "string" &&
        typeof value.color === "string" &&
        VALID_COLORS.has(value.color)
    );
}

function isScheduleState(value: unknown): value is ScheduleState {
    if (!isRecord(value)) {
        return false;
    }

    const { id, name, placedActivities, notes, grid } = value;

    return (
        typeof id === "string" &&
        typeof name === "string" &&
        isRecord(placedActivities) &&
        isRecord(notes) &&
        isRecord(grid) &&
        Array.isArray(grid.days) &&
        typeof grid.slotDuration === "number" &&
        typeof grid.startTime === "number" &&
        typeof grid.endTime === "number"
    );
}

function isUserState(value: unknown): value is PersistedUser {
    if (!isRecord(value)) {
        return false;
    }

    const {
        id,
        displayName,
        email,
        avatarUrl,
        theme,
        activeScheduleId,
        templates,
        schedules,
    } = value;

    return (
        typeof id === "string" &&
        typeof displayName === "string" &&
        (email === undefined || typeof email === "string") &&
        (avatarUrl === undefined || typeof avatarUrl === "string") &&
        (theme === undefined || isThemeMode(theme)) &&
        typeof activeScheduleId === "string" &&
        isRecord(templates) &&
        isRecord(schedules)
    );
}

function isLegacyScheduleState(value: unknown): value is LegacyPersistedScheduleState {
    if (!isRecord(value)) {
        return false;
    }

    const { id, name, theme, templates, placedActivities, notes, grid } = value;

    return (
        typeof id === "string" &&
        typeof name === "string" &&
        (theme === undefined || isThemeMode(theme)) &&
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

function normalizeTemplates(
    templates: Record<string, unknown>,
): Record<string, Activity> {
    return Object.fromEntries(
        Object.values(templates)
            .filter(isActivity)
            .map((template) => [template.templateId, template]),
    );
}

function normalizePlacedActivities(
    placedActivities: Record<string, unknown>,
    templates: Record<string, Activity>,
): Record<string, PlacedActivity> {
    return Object.fromEntries(
        Object.values(placedActivities)
            .filter(isPlacedActivity)
            .filter((activity) => activity.templateId in templates)
            .map((activity) => [activity.placedId, activity]),
    );
}

function normalizeNotes(
    notes: Record<string, unknown>,
    placedActivities: Record<string, PlacedActivity>,
): Record<string, Note> {
    return Object.fromEntries(
        Object.values(notes)
            .filter(isNote)
            .filter((note) => note.activityId in placedActivities)
            .map((note) => [note.id, note]),
    );
}

function normalizeScheduleState(
    schedule: PersistedScheduleState,
    templates: Record<string, Activity>,
): ScheduleState {
    const placedActivities = normalizePlacedActivities(
        schedule.placedActivities,
        templates,
    );
    const notes = normalizeNotes(schedule.notes, placedActivities);

    return {
        id: schedule.id,
        name: schedule.name,
        grid: normalizeGridSettings(schedule.grid),
        placedActivities,
        notes,
    };
}

function normalizeUserState(state: PersistedUser): User {
    const templates = normalizeTemplates(state.templates);
    const normalizedSchedules = Object.fromEntries(
        Object.values(state.schedules)
            .filter(isScheduleState)
            .map((schedule) => {
                const normalizedSchedule = normalizeScheduleState(
                    schedule,
                    templates,
                );

                return [normalizedSchedule.id, normalizedSchedule];
            }),
    );
    const fallbackState =
        Object.keys(normalizedSchedules).length === 0
            ? createFallbackUserState()
            : null;
    const schedules = fallbackState?.schedules ?? normalizedSchedules;
    const activeScheduleId =
        state.activeScheduleId in schedules
            ? state.activeScheduleId
            : Object.keys(schedules)[0];

    return {
        id: state.id,
        displayName: state.displayName,
        ...(typeof state.email === "string" ? { email: state.email } : {}),
        ...(typeof state.avatarUrl === "string"
            ? { avatarUrl: state.avatarUrl }
            : {}),
        theme: isThemeMode(state.theme) ? state.theme : DEFAULT_THEME_MODE,
        activeScheduleId,
        templates: fallbackState?.templates ?? templates,
        schedules,
    };
}

function migrateLegacyScheduleState(state: LegacyPersistedScheduleState): User {
    const templates = normalizeTemplates(state.templates);
    const normalizedSchedule = normalizeScheduleState(
        {
            id: state.id,
            name: state.name,
            placedActivities: state.placedActivities,
            notes: state.notes,
            grid: state.grid,
        },
        templates,
    );

    return normalizeUserState({
        id: DEFAULT_LOCAL_USER_ID,
        displayName: DEFAULT_LOCAL_USER_NAME,
        theme: isThemeMode(state.theme) ? state.theme : DEFAULT_THEME_MODE,
        activeScheduleId: normalizedSchedule.id,
        templates,
        schedules: {
            [normalizedSchedule.id]: normalizedSchedule,
        },
    });
}

function loadFromStorageKey(storageKey: string): unknown | null {
    const serializedState = localStorage.getItem(storageKey);

    if (serializedState === null) {
        return null;
    }

    return JSON.parse(serializedState) as unknown;
}

export const storageService = {
    loadState: (): User | null => {
        try {
            const parsedUserState = loadFromStorageKey(STORAGE_KEY);

            if (parsedUserState !== null) {
                if (!isUserState(parsedUserState)) {
                    console.warn("Discarded invalid user state from storage.");
                    localStorage.removeItem(STORAGE_KEY);
                    return null;
                }

                return normalizeUserState(parsedUserState);
            }

            const parsedLegacyState = loadFromStorageKey(LEGACY_STORAGE_KEY);

            if (parsedLegacyState === null) {
                return null;
            }

            if (!isLegacyScheduleState(parsedLegacyState)) {
                console.warn("Discarded invalid legacy schedule state from storage.");
                localStorage.removeItem(LEGACY_STORAGE_KEY);
                return null;
            }

            const migratedState = migrateLegacyScheduleState(parsedLegacyState);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(migratedState));

            return migratedState;
        } catch (e) {
            console.error("Failed to load planner state from storage:", e);
            return null;
        }
    },

    saveState: (state: User): void => {
        try {
            const serializedState = JSON.stringify(state);
            localStorage.setItem(STORAGE_KEY, serializedState);
        } catch (e) {
            console.error("Failed to save planner state to storage:", e);
        }
    },

    clearState: (): void => {
        try {
            localStorage.removeItem(STORAGE_KEY);
            localStorage.removeItem(LEGACY_STORAGE_KEY);
        } catch (e) {
            console.error("Failed to clear storage:", e);
        }
    },
};