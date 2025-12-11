import {
    type ScheduleState,
    type ScheduleAction,
    type Activity,
} from "@/types";

export const initialState: ScheduleState = {
    id: crypto.randomUUID(),
    name: "My Weekly Schedule",
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

        case "SET_NAME":
            return {
                ...state,
                name: action.payload,
            };

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

        case "DELETE_TEMPLATE": {
            const templateId = action.payload;
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { [templateId]: _, ...others } = state.templates; // AI suggestion instead of entries trasformations into filter

            return {
                ...state,
                templates: others,
                placedActivities: Object.fromEntries(
                    Object.entries(state.placedActivities).filter(
                        ([, content]) => content.templateId !== templateId
                    )
                ),
            };
        }

        case "PLACE_ACTIVITY": {
            const placedId = crypto.randomUUID();
            const template = state.templates[action.payload.templateId];

            return {
                ...state,
                placedActivities: {
                    ...state.placedActivities,
                    [placedId]: {
                        ...action.payload,
                        placedId,
                        title: template.title,
                        color: template.color,
                    },
                },
            };
        }

        case "EDIT_PLACED_ACTIVITY": {
            const template = state.templates[action.payload.templateId];

            return {
                ...state,
                placedActivities: {
                    ...state.placedActivities,
                    [action.payload.placedId]: {
                        ...action.payload,
                        title: template.title,
                        color: template.color,
                    },
                },
            };
        }

        case "REMOVE_PLACED_ACTIVITY":
            return {
                ...state,
                placedActivities: Object.fromEntries(
                    Object.entries(state.placedActivities).filter(
                        ([id]) => id !== action.payload
                    )
                ),
            };

        case "ADD_NOTE": {
            const id = crypto.randomUUID();
            return {
                ...state,
                notes: {
                    ...state.notes,
                    [id]: {
                        id,
                        ...action.payload,
                    },
                },
            };
        }

        case "EDIT_NOTE":
            return {
                ...state,
                notes: {
                    ...state.notes,
                    [action.payload.id]: {
                        ...action.payload,
                    },
                },
            };

        case "REMOVE_NOTE":
            return {
                ...state,
                notes: Object.fromEntries(
                    Object.entries(state.notes).filter(
                        ([id]) => id !== action.payload
                    )
                ),
            };

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

    if (!toPropagate) {
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
