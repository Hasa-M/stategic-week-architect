import { useReducer, type ReactNode } from "react";
import { initialState, scheduleReducer } from "./scheduleReducer";
import { ScheduleContext, ScheduleDispatchContext } from "./scheduleContext";

export default function ScheduleProvider({
    children,
}: {
    children: ReactNode;
}): ReactNode {
    const [scheduleState, dispatch] = useReducer(scheduleReducer, initialState);

    return (
        <ScheduleContext.Provider value={scheduleState}>
            <ScheduleDispatchContext.Provider value={dispatch}>
                {children}
            </ScheduleDispatchContext.Provider>
        </ScheduleContext.Provider>
    );
}
