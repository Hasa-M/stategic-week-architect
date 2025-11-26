import { type Activity, type DaysGrid, type Note, type PlacedActivity } from "../types/index"; // Adjust path as needed

// ----------------------------AI GENRATER START-----------------------------------------------
// CONFIGURATION
// ---------------------------------------------------------------------------

export const MOCK_GRID_CONFIG: DaysGrid = {
  days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
  slotDuration: 30, // 30 minutes per visual slot
  startTime: 480,   // 08:00 AM (in minutes from midnight)
  endTime: 1200,    // 08:00 PM (in minutes from midnight)
};

// ---------------------------------------------------------------------------
// ACTIVITIES (The "Backlog")
// ---------------------------------------------------------------------------

export const MOCK_ACTIVITIES: Activity[] = [
  {
    templateId: "act_1",
    title: "API Development",
    description: "Implement user authentication endpoints in FastAPI",
    color: "blue",
    subfactors: [
      { title: "JWT Logic", description: "Implement encoding/decoding" },
      { title: "DB Schema", description: "Update User model in SQLAlchemy" },
    ],
  },
  {
    templateId: "act_2",
    title: "Frontend Refactor",
    description: "Migrate legacy context providers to Zustand store",
    color: "violet",
    subfactors: [
      { title: "Auth Store", description: "Migrate auth state" },
      { title: "UI Components", description: "Update strict typing" },
    ],
  },
  {
    templateId: "act_3",
    title: "System Design Study",
    description: "Read DDIA Chapter 5: Replication",
    color: "emerald",
    subfactors: [],
  },
  {
    templateId: "act_4",
    title: "Code Review",
    description: "Review PRs for the data ingestion pipeline",
    color: "slate",
    subfactors: [
      { title: "Check Types", description: "Verify Pydantic models" },
    ],
  },
  {
    templateId: "act_5",
    title: "Deep Work",
    description: "Uninterrupted focus block",
    color: "stone",
    subfactors: [],
  },
  {
    templateId: "act_6",
    title: "Lunch Break",
    description: "AFK",
    color: "amber",
    subfactors: [],
  },
];

// ---------------------------------------------------------------------------
// PLACED ACTIVITIES (The "Calendar")
// ---------------------------------------------------------------------------

export const MOCK_PLACED_ACTIVITIES: PlacedActivity[] = [
  // Monday: Coding morning, Meeting afternoon
  {
    ...MOCK_ACTIVITIES[0], // API Development
    placedId: "tpl_1",
    day: "Monday",
    startTime: 540, // 09:00
    endTime: 720,   // 12:00
  },
  {
    ...MOCK_ACTIVITIES[5], // Lunch
    placedId: "tpl_2",
    day: "Monday",
    startTime: 780, // 13:00
    endTime: 840,   // 14:00
  },
  {
    ...MOCK_ACTIVITIES[3], // Code Review
    placedId: "tpl_3",
    day: "Monday",
    startTime: 840, // 14:00
    endTime: 960,   // 16:00
  },

  // Tuesday: Deep work
  {
    ...MOCK_ACTIVITIES[4], // Deep Work
    placedId: "tpl_4",
    day: "Tuesday",
    startTime: 540, // 09:00
    endTime: 780,   // 13:00
  },
  {
    ...MOCK_ACTIVITIES[2], // System Design
    placedId: "tpl_5",
    day: "Tuesday",
    startTime: 840, // 14:00
    endTime: 960,   // 16:00
  },
  
  // Wednesday: Early start
  {
    ...MOCK_ACTIVITIES[1], // Frontend Refactor
    placedId: "tpl_6",
    day: "Wednesday",
    startTime: 480, // 08:00
    endTime: 660,   // 11:00
  },
];

// ---------------------------------------------------------------------------
// NOTES (Sidebar/Sticky notes)
// ---------------------------------------------------------------------------

export const MOCK_NOTES: Note[] = [
  {
    id: "note_1",
    title: "Deployment Credentials",
    content: "AWS_ACCESS_KEY needs rotation before Friday deployment.",
    color: "red",
  },
  {
    id: "note_2",
    title: "Interview Prep",
    content: "Review CAP theorem and isolation levels.",
    color: "fuchsia",
  },
  {
    id: "note_3",
    title: "Grocery List",
    content: "Coffee, Milk, Bread.",
    color: "lime",
  },
];


//---------------AI GENERATED END-------------------