import { type ScheduleState, type ScheduleAction } from "@/types";

const initialState: ScheduleState = {
    templates: {},
    placedActivities: {},
    grid: {
        days: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
        ],
        slotDuration: 60,
        startTime: 480,
        endTime: 1439,
    },
    notes: {},
};

export function scheduleReducer(
    state: ScheduleState,
    action: ScheduleAction
): ScheduleState {
    switch (action.type) {
        case "LOAD_STATE":
            return initialState;

        case "ADD_TEMPLATE": {
            const templateId = crypto.randomUUID();
            return {
                ...state,
                templates: {
                    ...state.templates,
                    [templateId]: {
                        ...action.payload,
                        templateId,
                    },
                },
            };
        }

        // case ""

        default:
            return state;
    }
}
