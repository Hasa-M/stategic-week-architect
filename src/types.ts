export type Color =
    | "red"
    | "amber"
    | "lime"
    | "emerald"
    | "cyan"
    | "blue"
    | "violet"
    | "fuchsia"
    | "pink"
    | "slate"
    | "stone";

export type ThemeMode = "light" | "high-contrast" | "dark";

export const DEFAULT_THEME_MODE: ThemeMode = "light";

export type Day =
    | "Monday"
    | "Tuesday"
    | "Wednesday"
    | "Thursday"
    | "Friday"
    | "Saturday"
    | "Sunday";

export type SlotWindow = 15 | 30 | 60;

export type Subfactor = {
    title: string;
    description: string;
};

export interface ActivitySnapshot {
    title: string;
    description: string;
    color: Color;
    subfactors: Subfactor[];
}

export interface Activity extends ActivitySnapshot {
    templateId: string; // Conceptually the activity is a template
}

export interface PlacedActivity extends ActivitySnapshot {
    templateId: string;
    day: Day;
    placedId: string; // An activity placed into the schedule
    startTime: number;
    endTime: number;
}

export type ActivityDraft = ActivitySnapshot;

export type DaysGrid = {
    days: Day[];
    slotDuration: SlotWindow;
    startTime: number;
    endTime: number;
};

export type GridTimeRange = Pick<DaysGrid, "startTime" | "endTime">;

export type Note = {
    id: string;
    title: string;
    content: string;
    color: Color;
    activityId: string; // Association with a PlacedActivity
};

export type ActivityNoteDraft = Omit<Note, "id" | "activityId">;

export type ActivityNoteInput = ActivityNoteDraft & {
    id?: string;
};

export type NoteDraft = Omit<Note, "id">;

export type PlacedActivityDraft = Pick<
    PlacedActivity,
    "templateId" | "day" | "startTime" | "endTime"
> & {
    notes?: ActivityNoteDraft[];
};

export type PlacedActivityUpdate = Pick<
    PlacedActivity,
    "templateId" | "day" | "startTime" | "endTime" | "placedId"
>;

export type SavePlacedActivityPayload = PlacedActivityUpdate & {
    notes: ActivityNoteInput[];
};

export type ScheduleState = {
    id: string;
    name: string;
    placedActivities: Record<string, PlacedActivity>;
    grid: DaysGrid;
    notes: Record<string, Note>;
};

export type UserProfile = {
    id: string;
    displayName: string;
    email?: string;
    avatarUrl?: string;
};

export type User = UserProfile & {
    theme: ThemeMode;
    activeScheduleId: string;
    templates: Record<string, Activity>;
    schedules: Record<string, ScheduleState>;
};

export type CreateSchedulePayload = {
    name?: string;
};

export type ScheduleAction =
    | { type: "LOAD_STATE"; payload: User }
    | { type: "SET_NAME"; payload: string }
    | { type: "SET_THEME"; payload: ThemeMode }
    | { type: "CREATE_SCHEDULE"; payload?: CreateSchedulePayload }
    | { type: "SET_ACTIVE_SCHEDULE"; payload: string }
    | { type: "DELETE_SCHEDULE"; payload: string }
    | { type: "ADD_TEMPLATE"; payload: ActivityDraft }
    | {
          type: "EDIT_TEMPLATE";
          payload: { activity: Activity; toPropagate: boolean };
      }
    | { type: "DELETE_TEMPLATE"; payload: string }
    | {
          type: "PLACE_ACTIVITY";
          payload: PlacedActivityDraft;
      }
    | {
          type: "EDIT_PLACED_ACTIVITY";
          payload: PlacedActivityUpdate;
      }
        | {
                    type: "SAVE_PLACED_ACTIVITY";
                    payload: SavePlacedActivityPayload;
            }
    | { type: "REMOVE_PLACED_ACTIVITY"; payload: string }
    | { type: "SET_GRID_DAYS"; payload: Day[] }
    | { type: "SET_GRID_SLOT_DURATION"; payload: SlotWindow }
    | { type: "SET_GRID_TIME_RANGE"; payload: GridTimeRange }
    | { type: "ADD_NOTE"; payload: NoteDraft }
    | { type: "EDIT_NOTE"; payload: Note }
    | { type: "REMOVE_NOTE"; payload: string };
