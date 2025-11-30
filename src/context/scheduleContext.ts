import type { ScheduleAction, ScheduleState } from "@/types";
import { createContext, type Dispatch } from "react";

export const ScheduleContext = createContext<ScheduleState | null>(null);
export const ScheduleDispatchContext =
    createContext<Dispatch<ScheduleAction> | null>(null);
