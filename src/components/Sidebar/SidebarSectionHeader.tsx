import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type SidebarSectionHeaderProps = {
    title: string;
    description?: ReactNode;
    action?: ReactNode;
    className?: string;
};

export default function SidebarSectionHeader({
    title,
    description,
    action,
    className,
}: SidebarSectionHeaderProps) {
    return (
        <div
            className={cn(
                "rounded-[1.1rem] bg-(--app-surface-soft) px-3 py-2.5 backdrop-blur-sm",
                className
            )}
        >
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2.5">
                <div className="min-w-0">
                    <h2 className="app-text-strong text-[15px] font-semibold sm:text-base">
                        {title}
                    </h2>

                    {description ? (
                        <p className="app-text-muted mt-1.5 text-xs">
                            {description}
                        </p>
                    ) : null}
                </div>

                <div className="flex items-center justify-end self-center">
                    {action}
                </div>
            </div>
        </div>
    );
}