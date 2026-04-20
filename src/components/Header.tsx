import {
    ArrowRightIcon,
    Check,
    Pencil,
    X,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRef, useState } from "react";
import { useDispatch, useScheduleContext, useUserContext } from "@/context/hooks";
import ScheduleSwitcher from "@/components/ScheduleSwitcher";
import { cn } from "@/lib/utils";

type HeaderProps = {
    layoutMode: "desktop" | "tablet" | "mobile";
    onOpenSidebar: () => void;
    compact?: boolean;
};

export default function Header({
    layoutMode,
    onOpenSidebar,
    compact = false,
}: HeaderProps) {
    const input = useRef<HTMLInputElement>(null);
    const [isEdit, setIsEdit] = useState(false);

    const schedule = useScheduleContext();
    const user = useUserContext();
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
        layoutMode === "tablet"
            ? {
                  label: "Open sidebar",
                  onClick: onOpenSidebar,
                  icon: ArrowRightIcon,
                  size: "sm" as const,
                  className: "w-full md:w-auto",
              }
            : null;

    const ActionIcon = action?.icon;
    const showStats = layoutMode === "desktop";
    const stats = [
        {
            label: "Templates",
            value: Object.keys(user.templates).length,
        },
        {
            label: "Activities",
            value: Object.keys(schedule.placedActivities).length,
        },
        {
            label: "Notes",
            value: Object.keys(schedule.notes).length,
        },
    ];

    let title = (
        <div className={cn("min-w-0", compact ? "space-y-1" : "space-y-1.5")}>
            {!compact ? (
                <p className="app-text-subtle text-[10px] font-semibold uppercase tracking-[0.16em]">
                    Current schedule
                </p>
            ) : null}

            <div className="min-w-0">
                <div className={cn("flex w-fit min-w-0 max-w-full items-center", compact ? "gap-2" : "gap-2.5")}>
                    <ScheduleSwitcher
                        layoutMode={layoutMode}
                        className={cn(
                            "app-text-strong min-w-0 truncate font-bold tracking-tight",
                            compact
                                ? "text-[18px]/6 md:text-[22px]/7"
                                : "text-[22px]/7 md:text-[26px]/8"
                        )}
                    />

                    <Button
                        type="button"
                        variant="outline"
                        size="icon-sm"
                        className={cn(
                            "shrink-0 rounded-xl",
                            compact && "size-8"
                        )}
                        onClick={handleEdit}
                        aria-label="Rename schedule"
                    >
                        <Pencil />
                    </Button>
                </div>
            </div>
        </div>
    );

    if (isEdit) {
        title = (
            <div className={cn("flex min-w-0 flex-wrap items-center", compact ? "gap-2" : "gap-2.5")}>
                {!compact ? (
                    <div className="w-full">
                        <p className="app-text-subtle mb-2 text-[10px] font-semibold uppercase tracking-[0.16em]">
                            Current schedule
                        </p>
                    </div>
                ) : null}

                <Input
                    type="text"
                    placeholder="Schedule name"
                    defaultValue={
                        schedule?.name ?? "Welcome to Your Weekly Schedule!"
                    }
                    ref={input}
                    className={cn(
                        "max-w-xl flex-1 font-bold",
                        compact ? "h-10 text-base" : "text-lg"
                    )}
                />
                <Button
                    type="button"
                    variant="outline"
                    size="icon-sm"
                    className={cn("rounded-xl text-red-600", compact && "size-8")}
                    onClick={handleClear}
                    aria-label="Cancel schedule rename"
                >
                    <X />
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    size="icon-sm"
                    className={cn("rounded-xl text-green-600", compact && "size-8")}
                    onClick={handleSave}
                    aria-label="Save schedule rename"
                >
                    <Check />
                </Button>
            </div>
        );
    }

    const showSecondaryArea = showStats || Boolean(action && ActionIcon);

    return (
        <header
            className={cn(
                "app-card flex flex-col md:flex-row md:justify-between",
                compact ? "gap-2.5 p-3 md:items-center" : "gap-3 p-4 md:items-start"
            )}
        >
            <div className="min-w-0 flex-1">{title}</div>

            {showSecondaryArea ? (
                <div
                    className={cn(
                        "flex flex-col",
                        showStats
                            ? compact
                                ? "gap-1.5 md:min-w-60 md:items-end"
                                : "gap-2 md:min-w-68 md:items-end"
                            : "md:flex-none md:self-center"
                    )}
                >
                    {showStats ? (
                        <div
                            className={cn(
                                "grid grid-cols-3",
                                compact ? "gap-1.5 md:min-w-60" : "gap-2 md:min-w-68"
                            )}
                        >
                            {stats.map((stat) => (
                                <div
                                    key={stat.label}
                                    className={cn(
                                        "rounded-xl bg-(--app-surface-soft) text-right",
                                        compact
                                            ? "px-2.5 py-1.5"
                                            : "border border-(--app-border-subtle) px-3 py-2"
                                    )}
                                >
                                    <p
                                        className={cn(
                                            "app-text-strong font-semibold leading-none",
                                            compact ? "text-xs md:text-sm" : "text-sm md:text-base"
                                        )}
                                    >
                                        {stat.value}
                                    </p>
                                    <p
                                        className={cn(
                                            "app-text-subtle font-semibold uppercase tracking-[0.14em]",
                                            compact ? "mt-0.5 text-[9px]" : "mt-1 text-[10px]"
                                        )}
                                    >
                                        {stat.label}
                                    </p>
                                </div>
                            ))}
                        </div>
                    ) : null}

                    {action && ActionIcon ? (
                        <Button
                            variant="ghost"
                            size={compact ? "sm" : action.size}
                            className={cn(
                                action.className,
                                compact && "h-8 px-3 text-xs"
                            )}
                            onClick={action.onClick}
                        >
                            {action.label}
                            <ActionIcon />
                        </Button>
                    ) : null}
                </div>
            ) : null}
        </header>
    );
}
