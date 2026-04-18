import {
    DEFAULT_GRID_END_TIME,
    DEFAULT_GRID_SLOT_DURATION,
    DEFAULT_GRID_START_TIME,
    normalizeGridSettings,
} from "@/lib/grid";
import {
    DEFAULT_THEME_MODE,
    type Activity,
    type ActivityNoteDraft,
    type ActivityNoteInput,
    type ActivitySnapshot,
    type Note,
    type ScheduleAction,
    type ScheduleState,
} from "@/types";

export const initialState: ScheduleState = {
    id: crypto.randomUUID(),
    name: "My Weekly Schedule",
    theme: DEFAULT_THEME_MODE,
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
        slotDuration: DEFAULT_GRID_SLOT_DURATION,
        startTime: DEFAULT_GRID_START_TIME,
        endTime: DEFAULT_GRID_END_TIME,
    },
    notes: {},
};

export function scheduleReducer(
    state: ScheduleState,
    action: ScheduleAction
): ScheduleState {
    switch (action.type) {
        case "LOAD_STATE":
            return {
                ...action.payload,
                theme: action.payload.theme ?? DEFAULT_THEME_MODE,
                grid: normalizeGridSettings(action.payload.grid),
            };

        case "SET_NAME":
            return {
                ...state,
                name: action.payload,
            };

        case "SET_THEME":
            return {
                ...state,
                theme: action.payload,
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
            const removedPlacedIds = new Set(
                Object.values(state.placedActivities)
                    .filter((content) => content.templateId === templateId)
                    .map((content) => content.placedId)
            );
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
                notes: filterNotesByActivityIds(state.notes, removedPlacedIds),
            };
        }

        case "PLACE_ACTIVITY": {
            const template = state.templates[action.payload.templateId];

            if (!template) {
                return state;
            }

            const { notes: noteDrafts, ...placedActivityDraft } = action.payload;
            const placedId = crypto.randomUUID();
            const nextNotes = buildAssociatedNotes(noteDrafts, placedId);

            return {
                ...state,
                placedActivities: {
                    ...state.placedActivities,
                    [placedId]: {
                        ...placedActivityDraft,
                        placedId,
                        title: template.title,
                        description: template.description,
                        color: template.color,
                        subfactors: template.subfactors,
                    },
                },
                notes: {
                    ...state.notes,
                    ...nextNotes,
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

        case "SAVE_PLACED_ACTIVITY": {
            const template = state.templates[action.payload.templateId];
            const existingActivity = state.placedActivities[action.payload.placedId];

            if (!template || !existingActivity) {
                return state;
            }

            const { notes, ...placedActivityUpdate } = action.payload;

            return {
                ...state,
                placedActivities: {
                    ...state.placedActivities,
                    [action.payload.placedId]: {
                        ...placedActivityUpdate,
                        title: template.title,
                        description: template.description,
                        color: template.color,
                        subfactors: template.subfactors,
                    },
                },
                notes: syncActivityNotes(
                    state.notes,
                    action.payload.placedId,
                    notes
                ),
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
                notes: filterNotesByActivityIds(
                    state.notes,
                    new Set([action.payload])
                ),
            };

        case "SET_GRID_DAYS":
            return {
                ...state,
                grid: normalizeGridSettings({
                    ...state.grid,
                    days: action.payload,
                }),
            };

        case "SET_GRID_SLOT_DURATION":
            return {
                ...state,
                grid: normalizeGridSettings({
                    ...state.grid,
                    slotDuration: action.payload,
                }),
            };

        case "SET_GRID_TIME_RANGE":
            return {
                ...state,
                grid: normalizeGridSettings({
                    ...state.grid,
                    ...action.payload,
                }),
            };

        case "ADD_NOTE": {
            if (!state.placedActivities[action.payload.activityId]) {
                return state;
            }

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
            if (
                !state.notes[action.payload.id] ||
                !state.placedActivities[action.payload.activityId]
            ) {
                return state;
            }

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

function buildAssociatedNotes(
    noteDrafts: ActivityNoteDraft[] | undefined,
    activityId: string
): Record<string, Note> {
    if (!noteDrafts?.length) {
        return {};
    }

    return Object.fromEntries(
        noteDrafts.map((noteDraft) => {
            const id = crypto.randomUUID();

            return [
                id,
                {
                    id,
                    activityId,
                    ...noteDraft,
                },
            ];
        })
    );
}

function filterNotesByActivityIds(
    notes: Record<string, Note>,
    activityIds: Set<string>
): Record<string, Note> {
    if (activityIds.size === 0) {
        return notes;
    }

    return Object.fromEntries(
        Object.entries(notes).filter(
            ([, note]) => !activityIds.has(note.activityId)
        )
    );
}

function syncActivityNotes(
    notes: Record<string, Note>,
    activityId: string,
    noteInputs: ActivityNoteInput[]
): Record<string, Note> {
    const notesWithoutActivity = filterNotesByActivityIds(
        notes,
        new Set([activityId])
    );

    const nextActivityNotes = Object.fromEntries(
        noteInputs.map((noteInput) => {
            const canReuseId =
                noteInput.id !== undefined &&
                notes[noteInput.id]?.activityId === activityId;
            const id = canReuseId ? noteInput.id : crypto.randomUUID();

            return [
                id,
                {
                    id,
                    activityId,
                    title: noteInput.title,
                    content: noteInput.content,
                    color: noteInput.color,
                },
            ];
        })
    );

    return {
        ...notesWithoutActivity,
        ...nextActivityNotes,
    };
}
