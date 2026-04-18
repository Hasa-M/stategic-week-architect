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
            <div className="min-w-0">
                <span className="app-badge mb-3 w-fit">Weekly Schedule</span>
                <p className="text-nowrap text-ellipsis text-[32px]/10 font-bold tracking-tight text-slate-800">
                    {schedule?.name ?? "Welcome to Your Weekly Schedule!"}
                </p>
            </div>
            <Button
                variant="outline"
                size="icon-sm"
                className="invisible opacity-0 group-hover:visible group-hover:opacity-100"
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
                    className="max-w-xl text-lg font-bold"
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
        <header className="app-panel flex flex-row flex-wrap items-center gap-4 p-5 md:p-6">
            <span className="group flex min-w-0 flex-1 items-center gap-3">
                {title}
            </span>
            <Button variant="ghost" size="lg" onClick={onToggleSidebar}>
                {sidebarView === "summary" ? "View all notes" : "View summary"}{" "}
                <ArrowRightIcon />
            </Button>
        </header>
    );
}
