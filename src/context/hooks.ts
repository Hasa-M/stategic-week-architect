import { useContext } from "react";
import { ScheduleContext, ScheduleDispatchContext } from "./scheduleContext";

export const useDispatch = () => {
    const context = useContext(ScheduleDispatchContext);
    if (!context) {
        throw new Error(
            "useDispatch must be used within a ScheduleDispatchContext provider"
        );
    }
    return context;
};

export const useScheduleContext = () => {
    const context = useContext(ScheduleContext);
    if (!context) {
        throw new Error(
            "useScheduleContext must be used within a ScheduleContext provider"
        );
    }
    return context;
};
