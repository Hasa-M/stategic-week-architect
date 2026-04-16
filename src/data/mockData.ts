import {
    type ScheduleState,
    type Activity,
    type PlacedActivity,
    type Note,
    type DaysGrid,
} from "../types";

// ---------------------------------------------------------------------------
// 1. CONFIGURATION (Grid)
// ---------------------------------------------------------------------------
const MOCK_GRID: DaysGrid = {
    days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    slotDuration: 30, // 30 minutes per visual slot
    startTime: 480, // 08:00 AM
    endTime: 1200, // 08:00 PM
};

// ---------------------------------------------------------------------------
// 2. ACTIVITIES (Templates) - Converted to Record<string, Activity>
// ---------------------------------------------------------------------------
const MOCK_TEMPLATES: Record<string, Activity> = {
    act_1: {
        templateId: "act_1",
        title: "API Development",
        description: "Implement user authentication endpoints in FastAPI",
        color: "blue",
        subfactors: [
            { title: "JWT Logic", description: "Implement encoding/decoding" },
            {
                title: "DB Schema",
                description: "Update User model in SQLAlchemy",
            },
        ],
    },
    act_2: {
        templateId: "act_2",
        title: "Frontend Refactor",
        description: "Migrate legacy context providers to Zustand store",
        color: "violet",
        subfactors: [
            { title: "Auth Store", description: "Migrate auth state" },
            { title: "UI Components", description: "Update strict typing" },
        ],
    },
    act_3: {
        templateId: "act_3",
        title: "System Design Study",
        description: "Read DDIA Chapter 5: Replication",
        color: "emerald",
        subfactors: [],
    },
    act_4: {
        templateId: "act_4",
        title: "Code Review",
        description: "Review PRs for the data ingestion pipeline",
        color: "slate",
        subfactors: [
            { title: "Check Types", description: "Verify Pydantic models" },
        ],
    },
    act_5: {
        templateId: "act_5",
        title: "Deep Work",
        description: "Uninterrupted focus block",
        color: "stone",
        subfactors: [],
    },
    act_6: {
        templateId: "act_6",
        title: "Lunch Break",
        description: "AFK",
        color: "amber",
        subfactors: [],
    },
};

function createPlacedActivity(
    placedId: string,
    templateId: keyof typeof MOCK_TEMPLATES,
    day: PlacedActivity["day"],
    startTime: number,
    endTime: number
): PlacedActivity {
    const template = MOCK_TEMPLATES[templateId];

    return {
        placedId,
        templateId: template.templateId,
        day,
        startTime,
        endTime,
        title: template.title,
        description: template.description,
        color: template.color,
        subfactors: template.subfactors,
    };
}

// ---------------------------------------------------------------------------
// 3. PLACED ACTIVITIES (Calendar) - Converted to Record<string, PlacedActivity>
// ---------------------------------------------------------------------------
const MOCK_PLACED: Record<string, PlacedActivity> = {
    tpl_1: createPlacedActivity("tpl_1", "act_1", "Monday", 540, 720),
    tpl_2: createPlacedActivity("tpl_2", "act_6", "Monday", 780, 840),
    tpl_3: createPlacedActivity("tpl_3", "act_4", "Monday", 840, 960),
    tpl_4: createPlacedActivity("tpl_4", "act_5", "Tuesday", 540, 780),
    tpl_5: createPlacedActivity("tpl_5", "act_3", "Tuesday", 840, 960),
    tpl_6: createPlacedActivity("tpl_6", "act_2", "Wednesday", 480, 660),
};

// ---------------------------------------------------------------------------
// 4. NOTES - Converted to Record<string, Note>
// ---------------------------------------------------------------------------
const MOCK_NOTES_DATA: Record<string, Note> = {
    note_1: {
        id: "note_1",
        title: "Deployment Credentials",
        content: "AWS_ACCESS_KEY needs rotation before Friday deployment.",
        color: "red",
    },
    note_2: {
        id: "note_2",
        title: "Interview Prep",
        content: "Review CAP theorem and isolation levels.",
        color: "fuchsia",
    },
    note_3: {
        id: "note_3",
        title: "Grocery List",
        content: "Coffee, Milk, Bread.",
        color: "lime",
    },
};

// ---------------------------------------------------------------------------
// FINAL EXPORT (Matches ScheduleState)
// ---------------------------------------------------------------------------
export const INITIAL_SCHEDULE_STATE: ScheduleState = {
    id: "sched_1",
    name: "My Weekly Plan",
    grid: MOCK_GRID,
    templates: MOCK_TEMPLATES,
    placedActivities: MOCK_PLACED,
    notes: MOCK_NOTES_DATA,
};
