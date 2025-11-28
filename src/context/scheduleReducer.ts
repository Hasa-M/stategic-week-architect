import {
    type ScheduleState,
    type ScheduleAction,
    type Activity,
} from "@/types";

export const initialState: ScheduleState = {
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
            return action.payload;

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

        case "EDIT_TEMPLATE": {
            const templateId = action.payload.activity.templateId;
            const changes = extractChanges(
                action.payload.activity,
                state.templates[templateId],
                action.payload.toPropagate
            );
            return {
                ...state,
                templates: {
                    ...state.templates,
                    [templateId]: {
                        ...action.payload.activity,
                    },
                },
                ...(Object.keys(changes).length > 0 && {
                    placedActivities: Object.fromEntries(
                        Object.entries(state.placedActivities).map(
                            ([id, content]) => [
                                id,
                                content.templateId === templateId
                                    ? { ...content, ...changes }
                                    : content,
                            ]
                        )
                    ),
                }),
            };
        }

        default:
            return state;
    }
}

function extractChanges(
    activityNew: Activity,
    activityOld: Activity,
    toPropagate: boolean
): Partial<Activity> {
    const keys = Object.keys(activityOld) as (keyof Activity)[];

    const changedKeys = keys.filter(
        (value) => activityNew[value] !== activityOld[value]
    );

    const propagatePartialActivity = Object.fromEntries(
        changedKeys.map((key) => [key, activityNew[key]])
    ) as Partial<Activity>;

    if (
        !toPropagate &&
        (changedKeys.includes("title") || changedKeys.includes("color"))
    ) {
        const mustPropagateKeys = changedKeys.filter(
            (key) => key === "title" || key === "color"
        );

        const mustPropagatePartialActivity = Object.fromEntries(
            mustPropagateKeys.map((key) => [key, activityNew[key]])
        );

        return mustPropagatePartialActivity;
    }
    return propagatePartialActivity;
}
