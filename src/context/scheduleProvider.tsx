import { useEffect, useReducer, type ReactNode, useRef } from "react";
import { scheduleReducer } from "./scheduleReducer"; // put initialState import there
import { ScheduleContext, ScheduleDispatchContext } from "./scheduleContext";
import { storageService } from "@/services/storageService";

//after to change with the real inizial schedule
import { INITIAL_SCHEDULE_STATE as initialState } from "@/data/mockData";

const init = (defaultState: ScheduleState): ScheduleState => {
  const savedState = storageService.loadState();
  return savedState ?? defaultState;
};

export default function ScheduleProvider({
    children,
}: {
    children: ReactNode;
}) {
    const [scheduleState, dispatch] = useReducer(scheduleReducer, initialState, init);
    const isFirstRender = useRef(true);

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
