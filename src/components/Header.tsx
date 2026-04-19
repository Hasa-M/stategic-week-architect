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
        <div className="min-w-0 space-y-1.5">
            <p className="app-text-subtle text-[10px] font-semibold uppercase tracking-[0.16em]">
                Current schedule
            </p>

            <div className="min-w-0">
                <div className="flex w-fit min-w-0 max-w-full items-center gap-2.5">
                    <p
                        className="app-text-strong min-w-0 truncate text-[24px]/7 font-bold tracking-tight md:text-[30px]/9"
                        title={schedule?.name ?? "Welcome to Your Weekly Schedule!"}
                    >
                        {schedule?.name ?? "Welcome to Your Weekly Schedule!"}
                    </p>

                    <Button
                        type="button"
                        variant="outline"
                        size="icon-sm"
                        className="shrink-0 rounded-xl"
                        onClick={handleEdit}
                        aria-label="Rename schedule"
                    >
                        <Pencil />
                    </Button>
                </div>

                {layoutMode === "desktop" ? (
                    <p className="app-text-muted mt-1 text-sm leading-5">
                        Keep templates, placed activities, and notes aligned inside the
                        active weekly grid.
                    </p>
                ) : null}
            </div>
        </div>
    );

    if (isEdit) {
        title = (
            <div className="flex min-w-0 flex-wrap items-center gap-2.5">
                <div className="w-full">
                    <p className="app-text-subtle mb-2 text-[10px] font-semibold uppercase tracking-[0.16em]">
                        Current schedule
                    </p>
                </div>

                <Input
                    type="text"
                    placeholder="Schedule name"
                    defaultValue={
                        schedule?.name ?? "Welcome to Your Weekly Schedule!"
                    }
                    ref={input}
                    className="max-w-xl flex-1 text-lg font-bold"
                />
                <Button
                    type="button"
                    variant="outline"
                    size="icon-sm"
                    className="rounded-xl text-red-600"
                    onClick={handleClear}
                    aria-label="Cancel schedule rename"
                >
                    <X />
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    size="icon-sm"
                    className="rounded-xl text-green-600"
                    onClick={handleSave}
                    aria-label="Save schedule rename"
                >
                    <Check />
                </Button>
            </div>
        );
    }

    return (
        <header className="app-panel flex flex-col gap-3 p-4 md:flex-row md:items-start md:justify-between md:p-5">
            <div className="min-w-0 flex-1">{title}</div>

            {action && ActionIcon ? (
                <div className="md:flex-none md:self-center">
                    <Button
                        variant="ghost"
                        size={action.size}
                        className={action.className}
                        onClick={action.onClick}
                    >
                        {action.label}
                        <ActionIcon />
                    </Button>
                </div>
            ) : null}
        </header>
    );
}
