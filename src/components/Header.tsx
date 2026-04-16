import { ArrowRightIcon, Pencil, Check, X } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRef, useState } from "react";
import { useDispatch, useScheduleContext } from "@/context/hooks";
import type { SidebarView } from "./Sidebar/Sidebar";

type HeaderProps = {
    sidebarView: SidebarView;
    onToggleSidebar: () => void;
};

export default function Header({ sidebarView, onToggleSidebar }: HeaderProps) {
    const input = useRef<HTMLInputElement>(null);
    const [isEdit, setIsEdit] = useState(false);

    const schedule = useScheduleContext();
    const dispatch = useDispatch();

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
            <p className="text-primary text-nowrap text-ellipsis text-[32px]/10 font-bold">
                {schedule?.name ?? "Welcome to Your Weekly Schedule!"}
            </p>
            <Button
                variant="outline"
                size="icon-sm"
                className="invisible group-hover:visible opacity-0 group-hover:opacity-100 rounded-full transition-all duration-300 ease-in-out"
                onClick={handleEdit}
            >
                <Pencil />
            </Button>
        </>
    );

    if (isEdit) {
        title = (
            <>
                <Input
                    type="text"
                    placeholder="Schedule name"
                    defaultValue={
                        schedule?.name ?? "Welcome to Your Weekly Schedule!"
                    }
                    ref={input}
                    className="text-medium font-bold"
                />
                <Button
                    variant="outline"
                    size="icon-sm"
                    className="text-red-600"
                    onClick={handleClear}
                >
                    <X />
                </Button>
                <Button
                    variant="outline"
                    size="icon-sm"
                    className="text-green-600"
                    onClick={handleSave}
                >
                    <Check />
                </Button>
            </>
        );
    }

    return (
        <header className="p-0 flex flex-row flex-wrap gap-4">
            <span className="group flex-1 flex items-center gap-2">
                {title}
            </span>
            <Button variant="ghost" size="lg" onClick={onToggleSidebar}>
                {sidebarView === "summary" ? "View notes" : "View summary"}{" "}
                <ArrowRightIcon />
            </Button>
        </header>
    );
}
