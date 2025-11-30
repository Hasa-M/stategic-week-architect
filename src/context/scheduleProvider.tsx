import { useEffect, useReducer, type ReactNode, useRef } from "react";
import { initialState, scheduleReducer } from "./scheduleReducer";
import { ScheduleContext, ScheduleDispatchContext } from "./scheduleContext";
import { storageService } from "@/services/storageService";

export default function ScheduleProvider({
    children,
}: {
    children: ReactNode;
}): ReactNode {
    const [scheduleState, dispatch] = useReducer(scheduleReducer, initialState);
    const isFirstRender = useRef(true);

    // load on mount
    useEffect(() => {
        const state = storageService.loadState();
        dispatch({ type: "LOAD_STATE", payload: state ?? initialState });
    }, []);

    // save data on change
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        storageService.saveState(scheduleState);
    }, [scheduleState]);

    return (
        <ScheduleContext.Provider value={scheduleState}>
            <ScheduleDispatchContext.Provider value={dispatch}>
                {children}
            </ScheduleDispatchContext.Provider>
        </ScheduleContext.Provider>
    );
}
