import {
    type Activity,
    type ActivitySnapshot,
    type ScheduleAction,
    type ScheduleState,
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
            const existingTemplate = state.templates[templateId];

            if (!existingTemplate) {
                return state;
            }

            const propagatedChanges = getPropagatedActivityChanges(
                action.payload.activity,
                existingTemplate,
                action.payload.toPropagate
            );

            return {
                ...state,
                templates: {
                    ...state.templates,
                    [templateId]: action.payload.activity,
                },
                ...(Object.keys(propagatedChanges).length > 0 && {
                    placedActivities: Object.fromEntries(
                        Object.entries(state.placedActivities).map(
                            ([id, content]) => [
                                id,
                                content.templateId === templateId
                                    ? { ...content, ...propagatedChanges }
                                    : content,
                            ]
                        )
                    ),
                }),
            };
        }

        case "DELETE_TEMPLATE": {
            const templateId = action.payload;
            const others = Object.fromEntries(
                Object.entries(state.templates).filter(
                    ([id]) => id !== templateId
                )
            );

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
            const template = state.templates[action.payload.templateId];

            if (!template) {
                return state;
            }

            const placedId = crypto.randomUUID();

            return {
                ...state,
                placedActivities: {
                    ...state.placedActivities,
                    [placedId]: {
                        ...action.payload,
                        placedId,
                        title: template.title,
                        description: template.description,
                        color: template.color,
                        subfactors: template.subfactors,
                    },
                },
            };
        }

        case "EDIT_PLACED_ACTIVITY": {
            const template = state.templates[action.payload.templateId];

            if (!template) {
                return state;
            }

            return {
                ...state,
                placedActivities: {
                    ...state.placedActivities,
                    [action.payload.placedId]: {
                        ...action.payload,
                        title: template.title,
                        description: template.description,
                        color: template.color,
                        subfactors: template.subfactors,
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

        case "SET_GRID_DAYS":
            return {
                ...state,
                grid: {
                    ...state.grid,
                    days: action.payload,
                },
            };

        case "SET_GRID_SLOT_DURATION":
            return {
                ...state,
                grid: {
                    ...state.grid,
                    slotDuration: action.payload,
                },
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
                    [action.payload.id]: action.payload,
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

function getPropagatedActivityChanges(
    activityNew: Activity,
    activityOld: Activity,
    toPropagate: boolean
): Partial<ActivitySnapshot> {
    const changes: Partial<ActivitySnapshot> = {};

    if (activityNew.title !== activityOld.title) {
        changes.title = activityNew.title;
    }

    if (activityNew.color !== activityOld.color) {
        changes.color = activityNew.color;
    }

    if (!toPropagate) {
        return changes;
    }

    if (activityNew.description !== activityOld.description) {
        changes.description = activityNew.description;
    }

    if (
        JSON.stringify(activityNew.subfactors) !==
        JSON.stringify(activityOld.subfactors)
    ) {
        changes.subfactors = activityNew.subfactors;
    }

    return changes;
}
