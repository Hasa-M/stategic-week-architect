import {
    ArrowRightIcon,
    Check,
    Pencil,
    X,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRef, useState } from "react";
import { useDispatch, useScheduleContext } from "@/context/hooks";
import type { SidebarView } from "./Sidebar/Sidebar";
import ThemeSwitcher from "@/components/ThemeSwitcher";

type HeaderProps = {
    layoutMode: "desktop" | "tablet" | "mobile";
    sidebarView: SidebarView;
    onToggleSidebar: () => void;
    onOpenSidebar: () => void;
};

export default function Header({
    layoutMode,
    sidebarView,
    onToggleSidebar,
    onOpenSidebar,
}: HeaderProps) {
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

    const action =
        layoutMode === "mobile"
            ? null
            : layoutMode === "tablet"
              ? {
                    label: "Open sidebar",
                    onClick: onOpenSidebar,
                    icon: ArrowRightIcon,
                    size: "lg" as const,
                    className: "w-full md:w-auto",
                }
              : {
                    label:
                        sidebarView === "summary"
                            ? "View all notes"
                            : "View dashboard",
                    onClick: onToggleSidebar,
                    icon: ArrowRightIcon,
                    size: "lg" as const,
                    className: "w-full md:w-auto",
                };

    const ActionIcon = action?.icon;

    let title = (
        <>
            <div className="min-w-0">
                <p className="app-text-strong max-w-[18ch] text-[26px]/8 font-bold tracking-tight md:max-w-none md:text-[32px]/10">
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
        <header className="app-panel flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between md:p-6">
            <span className="group flex min-w-0 flex-1 items-start gap-3">
                {title}
            </span>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end md:flex-none">
                <ThemeSwitcher className="self-start sm:self-auto" />
                {action && ActionIcon ? (
                    <Button
                        variant="ghost"
                        size={action.size}
                        className={action.className}
                        onClick={action.onClick}
                    >
                        {action.label}
                        <ActionIcon />
                    </Button>
                ) : null}
            </div>
        </header>
    );
}
