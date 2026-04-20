import {
    DEFAULT_GRID_END_TIME,
    DEFAULT_GRID_SLOT_DURATION,
    DEFAULT_GRID_START_TIME,
    normalizeGridSettings,
} from "@/lib/grid";
import {
    type Activity,
    type ActivityNoteDraft,
    type ActivityNoteInput,
    type ActivitySnapshot,
    type Note,
    type ScheduleAction,
    type ScheduleState,
    type User,
} from "@/types";

const DEFAULT_SCHEDULE_NAME = "My Weekly Schedule";

function createScheduleState(
    overrides: Partial<Pick<ScheduleState, "id" | "name">> = {},
): ScheduleState {
    return {
        id: overrides.id ?? crypto.randomUUID(),
        name: overrides.name?.trim() || DEFAULT_SCHEDULE_NAME,
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
}

function ensureUserState(state: User): User {
    const scheduleIds = Object.keys(state.schedules);

    if (scheduleIds.length === 0) {
        const fallbackSchedule = createScheduleState();

        return {
            ...state,
            activeScheduleId: fallbackSchedule.id,
            schedules: {
                [fallbackSchedule.id]: fallbackSchedule,
            },
        };
    }

    if (state.schedules[state.activeScheduleId]) {
        return state;
    }

    return {
        ...state,
        activeScheduleId: scheduleIds[0],
    };
}

function resolveActiveScheduleId(state: User): string | null {
    if (state.schedules[state.activeScheduleId]) {
        return state.activeScheduleId;
    }

    return Object.keys(state.schedules)[0] ?? null;
}

function updateActiveSchedule(
    state: User,
    updateSchedule: (schedule: ScheduleState) => ScheduleState,
): User {
    const activeScheduleId = resolveActiveScheduleId(state);

    if (!activeScheduleId) {
        const fallbackState = ensureUserState(state);
        const fallbackActiveScheduleId = resolveActiveScheduleId(fallbackState);

        if (!fallbackActiveScheduleId) {
            return fallbackState;
        }

        return updateActiveSchedule(fallbackState, updateSchedule);
    }

    const activeSchedule = state.schedules[activeScheduleId];
    const nextSchedule = updateSchedule(activeSchedule);

    if (
        nextSchedule === activeSchedule &&
        activeScheduleId === state.activeScheduleId
    ) {
        return state;
    }

    return {
        ...state,
        activeScheduleId,
        schedules: {
            ...state.schedules,
            [activeScheduleId]: nextSchedule,
        },
    };
}

function mapSchedules(
    schedules: Record<string, ScheduleState>,
    updateSchedule: (schedule: ScheduleState) => ScheduleState,
): Record<string, ScheduleState> {
    let hasChanges = false;

    const nextEntries = Object.entries(schedules).map(([scheduleId, schedule]) => {
        const nextSchedule = updateSchedule(schedule);

        if (nextSchedule !== schedule) {
            hasChanges = true;
        }

        return [scheduleId, nextSchedule] as const;
    });

    if (!hasChanges) {
        return schedules;
    }

    return Object.fromEntries(nextEntries);
}

function reduceScheduleState(
    schedule: ScheduleState,
    action: ScheduleAction,
    templates: Record<string, Activity>,
): ScheduleState {
    switch (action.type) {
        case "SET_NAME":
            return {
                ...schedule,
                name: action.payload,
            };

        case "PLACE_ACTIVITY": {
            const template = templates[action.payload.templateId];

            if (!template) {
                return schedule;
            }

            const { notes: noteDrafts, ...placedActivityDraft } = action.payload;
            const placedId = crypto.randomUUID();
            const nextNotes = buildAssociatedNotes(noteDrafts, placedId);

            return {
                ...schedule,
                placedActivities: {
                    ...schedule.placedActivities,
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
                    ...schedule.notes,
                    ...nextNotes,
                },
            };
        }

        case "EDIT_PLACED_ACTIVITY": {
            const template = templates[action.payload.templateId];

            if (!template) {
                return schedule;
            }

            return {
                ...schedule,
                placedActivities: {
                    ...schedule.placedActivities,
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
            const template = templates[action.payload.templateId];
            const existingActivity =
                schedule.placedActivities[action.payload.placedId];

            if (!template || !existingActivity) {
                return schedule;
            }

            const { notes, ...placedActivityUpdate } = action.payload;

            return {
                ...schedule,
                placedActivities: {
                    ...schedule.placedActivities,
                    [action.payload.placedId]: {
                        ...placedActivityUpdate,
                        title: template.title,
                        description: template.description,
                        color: template.color,
                        subfactors: template.subfactors,
                    },
                },
                notes: syncActivityNotes(
                    schedule.notes,
                    action.payload.placedId,
                    notes,
                ),
            };
        }

        case "REMOVE_PLACED_ACTIVITY":
            return {
                ...schedule,
                placedActivities: Object.fromEntries(
                    Object.entries(schedule.placedActivities).filter(
                        ([id]) => id !== action.payload,
                    ),
                ),
                notes: filterNotesByActivityIds(
                    schedule.notes,
                    new Set([action.payload]),
                ),
            };

        case "SET_GRID_DAYS":
            return {
                ...schedule,
                grid: normalizeGridSettings({
                    ...schedule.grid,
                    days: action.payload,
                }),
            };

        case "SET_GRID_SLOT_DURATION":
            return {
                ...schedule,
                grid: normalizeGridSettings({
                    ...schedule.grid,
                    slotDuration: action.payload,
                }),
            };

        case "SET_GRID_TIME_RANGE":
            return {
                ...schedule,
                grid: normalizeGridSettings({
                    ...schedule.grid,
                    ...action.payload,
                }),
            };

        case "ADD_NOTE": {
            if (!schedule.placedActivities[action.payload.activityId]) {
                return schedule;
            }

            const id = crypto.randomUUID();

            return {
                ...schedule,
                notes: {
                    ...schedule.notes,
                    [id]: {
                        id,
                        ...action.payload,
                    },
                },
            };
        }

        case "EDIT_NOTE":
            if (
                !schedule.notes[action.payload.id] ||
                !schedule.placedActivities[action.payload.activityId]
            ) {
                return schedule;
            }

            return {
                ...schedule,
                notes: {
                    ...schedule.notes,
                    [action.payload.id]: action.payload,
                },
            };

        case "REMOVE_NOTE":
            return {
                ...schedule,
                notes: Object.fromEntries(
                    Object.entries(schedule.notes).filter(
                        ([id]) => id !== action.payload,
                    ),
                ),
            };

        default:
            return schedule;
    }
}

function applyPropagatedActivityChanges(
    schedule: ScheduleState,
    templateId: string,
    propagatedChanges: Partial<ActivitySnapshot>,
): ScheduleState {
    if (Object.keys(propagatedChanges).length === 0) {
        return schedule;
    }

    let hasChanges = false;

    const nextPlacedActivities = Object.fromEntries(
        Object.entries(schedule.placedActivities).map(([placedId, activity]) => {
            if (activity.templateId !== templateId) {
                return [placedId, activity];
            }

            hasChanges = true;

            return [
                placedId,
                {
                    ...activity,
                    ...propagatedChanges,
                },
            ];
        }),
    );

    if (!hasChanges) {
        return schedule;
    }

    return {
        ...schedule,
        placedActivities: nextPlacedActivities,
    };
}

function removeTemplateFromSchedule(
    schedule: ScheduleState,
    templateId: string,
): ScheduleState {
    const removedPlacedIds = new Set(
        Object.values(schedule.placedActivities)
            .filter((activity) => activity.templateId === templateId)
            .map((activity) => activity.placedId),
    );

    if (removedPlacedIds.size === 0) {
        return schedule;
    }

    return {
        ...schedule,
        placedActivities: Object.fromEntries(
            Object.entries(schedule.placedActivities).filter(
                ([, activity]) => activity.templateId !== templateId,
            ),
        ),
        notes: filterNotesByActivityIds(schedule.notes, removedPlacedIds),
    };
}

export function scheduleReducer(state: User, action: ScheduleAction): User {
    switch (action.type) {
        case "LOAD_STATE":
            return ensureUserState(action.payload);

        case "SET_THEME":
            return {
                ...state,
                theme: action.payload,
            };

        case "CREATE_SCHEDULE": {
            const nextSchedule = createScheduleState({
                name: action.payload?.name,
            });

            return {
                ...state,
                activeScheduleId: nextSchedule.id,
                schedules: {
                    ...state.schedules,
                    [nextSchedule.id]: nextSchedule,
                },
            };
        }

        case "SET_ACTIVE_SCHEDULE":
            if (!state.schedules[action.payload]) {
                return state;
            }

            return {
                ...state,
                activeScheduleId: action.payload,
            };

        case "DELETE_SCHEDULE": {
            if (!state.schedules[action.payload]) {
                return state;
            }

            const nextSchedules = Object.fromEntries(
                Object.entries(state.schedules).filter(
                    ([scheduleId]) => scheduleId !== action.payload,
                ),
            );

            if (Object.keys(nextSchedules).length === 0) {
                const fallbackState = ensureUserState({
                    ...state,
                    activeScheduleId: "",
                    schedules: {},
                });

                return fallbackState;
            }

            return {
                ...state,
                activeScheduleId:
                    state.activeScheduleId === action.payload
                        ? Object.keys(nextSchedules)[0]
                        : state.activeScheduleId,
                schedules: nextSchedules,
            };
        }

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
                action.payload.toPropagate,
            );
            const nextSchedules = mapSchedules(state.schedules, (schedule) =>
                applyPropagatedActivityChanges(
                    schedule,
                    templateId,
                    propagatedChanges,
                ),
            );

            return {
                ...state,
                templates: {
                    ...state.templates,
                    [templateId]: action.payload.activity,
                },
                schedules: nextSchedules,
            };
        }

        case "DELETE_TEMPLATE": {
            if (!state.templates[action.payload]) {
                return state;
            }

            return {
                ...state,
                templates: Object.fromEntries(
                    Object.entries(state.templates).filter(
                        ([templateId]) => templateId !== action.payload,
                    ),
                ),
                schedules: mapSchedules(state.schedules, (schedule) =>
                    removeTemplateFromSchedule(schedule, action.payload),
                ),
            };
        }

        case "SET_NAME":
        case "PLACE_ACTIVITY":
        case "EDIT_PLACED_ACTIVITY":
        case "SAVE_PLACED_ACTIVITY":
        case "REMOVE_PLACED_ACTIVITY":
        case "SET_GRID_DAYS":
        case "SET_GRID_SLOT_DURATION":
        case "SET_GRID_TIME_RANGE":
        case "ADD_NOTE":
        case "EDIT_NOTE":
        case "REMOVE_NOTE":
            return updateActiveSchedule(state, (schedule) =>
                reduceScheduleState(schedule, action, state.templates),
            );

        default:
            return state;
    }
}

function getPropagatedActivityChanges(
    activityNew: Activity,
    activityOld: Activity,
    toPropagate: boolean,
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
    activityId: string,
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
        }),
    );
}

function filterNotesByActivityIds(
    notes: Record<string, Note>,
    activityIds: Set<string>,
): Record<string, Note> {
    if (activityIds.size === 0) {
        return notes;
    }

    return Object.fromEntries(
        Object.entries(notes).filter(([, note]) => !activityIds.has(note.activityId)),
    );
}

function syncActivityNotes(
    notes: Record<string, Note>,
    activityId: string,
    noteInputs: ActivityNoteInput[],
): Record<string, Note> {
    const notesWithoutActivity = filterNotesByActivityIds(
        notes,
        new Set([activityId]),
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
        }),
    );

    return {
        ...notesWithoutActivity,
        ...nextActivityNotes,
    };
}