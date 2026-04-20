import type { ScheduleAction, ScheduleState, User } from "@/types";
import { createContext, type Dispatch } from "react";

export const UserContext = createContext<User | null>(null);
export const ScheduleContext = createContext<ScheduleState | null>(null);
export const ScheduleDispatchContext =
    createContext<Dispatch<ScheduleAction> | null>(null);
