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

export interface Activity {
    templateId: string; // Conceptually the activity is a template
    title: string;
    description: string;
    color: Color;
    subfactors: Subfactor[];
}

export interface PlacedActivity extends Activity {
    day: Day;
    placedId: string; // An activity placed into the schedule
    startTime: number;
    endTime: number;
}

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
    | { type: "EDIT_SCHEDULE"; payload: Omit<ScheduleState, "id"> }
    | { type: "ADD_TEMPLATE"; payload: Omit<Activity, "templateId"> }
    | {
          type: "EDIT_TEMPLATE";
          payload: { activity: Activity; toPropagate: boolean };
      }
    | { type: "DELETE_TEMPLATE"; payload: string }
    | {
          type: "PLACE_ACTIVITY";
          payload: Omit<PlacedActivity, "placedId" | "title" | "color">;
      }
    | {
          type: "EDIT_PLACED_ACTIVITY";
          payload: Omit<PlacedActivity, "title" | "color">; //Title and color should be derived from template, cannot be edited too.
      }
    | { type: "REMOVE_PLACED_ACTIVITY"; payload: string }
    | { type: "ADD_NOTE"; payload: Omit<Note, "id"> }
    | { type: "EDIT_NOTE"; payload: Note }
    | { type: "REMOVE_NOTE"; payload: string };
