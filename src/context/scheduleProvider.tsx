import { useEffect, useMemo, useReducer, type ReactNode } from "react";
import { scheduleReducer } from "./scheduleReducer"; // put initialState import there
import {
    ScheduleContext,
    ScheduleDispatchContext,
    UserContext,
} from "./scheduleContext";
import { storageService } from "@/services/storageService";
import type { ScheduleState, User } from "@/types";

//after to change with the real inizial schedule
import { INITIAL_USER_STATE as initialState } from "@/data/mockData";

const init = (defaultState: User): User => {
    const savedState = storageService.loadState();
    return savedState ?? defaultState;
};

export default function ScheduleProvider({
    children,
}: {
    children: ReactNode;
}) {
    const [userState, dispatch] = useReducer(
        scheduleReducer,
        initialState,
        init
    );
    const activeSchedule = useMemo<ScheduleState>(() => {
        return (
            userState.schedules[userState.activeScheduleId] ??
            Object.values(userState.schedules)[0] ??
            initialState.schedules[initialState.activeScheduleId]
        );
    }, [userState]);

    useEffect(() => {
        storageService.saveState(userState);
    }, [userState]);

    useEffect(() => {
        if (typeof document === "undefined") {
            return;
        }

        const root = document.documentElement;
        root.dataset.theme = userState.theme;
        root.style.colorScheme =
            userState.theme === "dark" ? "dark" : "light";
    }, [userState.theme]);

    return (
        <UserContext.Provider value={userState}>
            <ScheduleContext.Provider value={activeSchedule}>
                <ScheduleDispatchContext.Provider value={dispatch}>
                    {children}
                </ScheduleDispatchContext.Provider>
            </ScheduleContext.Provider>
        </UserContext.Provider>
    );
}
