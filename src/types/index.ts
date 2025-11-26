export type DataType = "activities" | "grid" | "placed_activities" | "notes";

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

export type Subfactor = {
    title: string;
    description: string;
};

export interface Activity {
    templateId: string;
    title: string;
    description: string;
    color: Color;
    subfactors: Subfactor[];
}

export interface PlacedActivity extends Activity {
    day: Day;
    placedId: string;
    startTime: number;
    endTime: number;
}

export type DaysGrid = {
    days: Day[];
    slotDuration: number;
    startTime: number;
    endTime: number;
};

export type Note = {
    id: string;
    title: string;
    content: string;
    color: Color;
};
