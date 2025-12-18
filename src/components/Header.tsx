import { ArrowRightIcon, Pencil, Check, X } from "lucide-react";

import { Input } from "@/components/Inputs/ui-input/input";
import { WeeklyAppButton } from "./Button/Button";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useScheduleContext } from "@/context/hooks";
import { storageService } from "@/services/storageService";

export default function Header() {
    const input = useRef<HTMLInputElement>(null);
    const [isEdit, setIsEdit] = useState(false);

    const schedule = useScheduleContext();
    const dispatch = useDispatch();

    useEffect(() => {
        if (schedule) {
            storageService.saveState(schedule);
        }
    }, [schedule]);

    function handleEdit() {
        setIsEdit(true);
    }

    function handleSave() {
        if (input.current) {
            dispatch({
                type: "SET_NAME",
                payload: input.current.value,
            });
        }
        setIsEdit(false);
    }

    function handleClear() {
        setIsEdit(false);
    }

    let title = (
        <>
            <p className="text-nowrap text-ellipsis text-[32px]/10 font-bold text-cyan-800">
                {schedule?.name ?? "Welcome to Your Weekly Schedule!"}
            </p>
            <WeeklyAppButton
                variant="outline"
                size="icon-sm"
                className="invisible group-hover:visible opacity-0 group-hover:opacity-100 rounded-full transition-all duration-300 ease-in-out"
                onClick={handleEdit}
            >
                <Pencil />
            </WeeklyAppButton>
        </>
    );

    if (isEdit) {
        title = (
            <>
                <Input
                    type="email"
                    placeholder="Email"
                    defaultValue={
                        schedule?.name ?? "Welcome to Your Weekly Schedule!"
                    }
                    ref={input}
                    className="text-medium font-bold"
                />
                <WeeklyAppButton
                    variant="outline"
                    size="icon-sm"
                    className="text-red-600"
                    onClick={handleClear}
                >
                    <X />
                </WeeklyAppButton>
                <WeeklyAppButton
                    variant="outline"
                    size="icon-sm"
                    className="text-green-600"
                    onClick={handleSave}
                >
                    <Check />
                </WeeklyAppButton>
            </>
        );
    }

    return (
        <header className="p-0 flex flex-row flex-wrap gap-4">
            <span className="group flex-1 flex items-center gap-2">
                {title}
            </span>
            <WeeklyAppButton
                variant="ghost"
                size="lg"
                onClick={() =>
                    alert("This feature will be available in the future...")
                }
            >
                View Notes <ArrowRightIcon />
            </WeeklyAppButton>
        </header>
    );
}
