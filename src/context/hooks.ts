import { useContext } from "react";
import {
    ScheduleContext,
    ScheduleDispatchContext,
    UserContext,
} from "./scheduleContext";

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

export const useUserContext = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error(
            "useUserContext must be used within a UserContext provider"
        );
    }
    return context;
};
