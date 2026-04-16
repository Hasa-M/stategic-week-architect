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

export type Day =
    | "Monday"
    | "Tuesday"
    | "Wednesday"
    | "Thursday"
    | "Friday"
    | "Saturday"
    | "Sunday";

export type SlotWindow = 15 | 30 | 60 | 90 | 120 | 150 | 180 | 240;

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

export type PlacedActivityDraft = Pick<
    PlacedActivity,
    "templateId" | "day" | "startTime" | "endTime"
>;

export type PlacedActivityUpdate = PlacedActivityDraft &
    Pick<PlacedActivity, "placedId">;

export type DaysGrid = {
    days: Day[];
    slotDuration: SlotWindow;
    startTime: number;
    endTime: number;
};

export type Note = {
    id: string;
    title: string;
    content: string;
    color: Color;
};

export type NoteDraft = Omit<Note, "id">;

export type ScheduleState = {
    id: string;
    name: string;
    templates: Record<string, Activity>;
    placedActivities: Record<string, PlacedActivity>;
    grid: DaysGrid;
    notes: Record<string, Note>;
};

export type ScheduleAction =
    | { type: "LOAD_STATE"; payload: ScheduleState }
    | { type: "SET_NAME"; payload: string }
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
    | { type: "REMOVE_PLACED_ACTIVITY"; payload: string }
        | { type: "SET_GRID_DAYS"; payload: Day[] }
        | { type: "SET_GRID_SLOT_DURATION"; payload: SlotWindow }
    | { type: "ADD_NOTE"; payload: NoteDraft }
    | { type: "EDIT_NOTE"; payload: Note }
    | { type: "REMOVE_NOTE"; payload: string };
