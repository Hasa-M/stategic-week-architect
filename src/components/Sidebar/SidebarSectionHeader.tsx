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
        <div className={cn("app-panel-muted p-4 sm:p-5", className)}>
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
                <div className="min-w-0">
                    <h2 className="app-text-strong text-base font-semibold sm:text-lg">
                        {title}
                    </h2>

                    {description ? (
                        <p className="app-text-muted mt-2 text-sm">
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