import { ChevronDown, LogOut } from "lucide-react";
import { useState } from "react";

import ThemeSwitcher from "@/components/ThemeSwitcher";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { useUserContext } from "@/context/hooks";
import { cn } from "@/lib/utils";

type LayoutMode = "desktop" | "tablet" | "mobile";

type UserMenuProps = {
    layoutMode: LayoutMode;
};

function getUserInitials(displayName: string) {
    return displayName
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((segment) => segment[0]?.toUpperCase() ?? "")
        .join("") || "LP";
}

function Avatar({
    avatarUrl,
    displayName,
    className,
}: {
    avatarUrl?: string;
    displayName: string;
    className?: string;
}) {
    if (avatarUrl) {
        return (
            <span
                className={cn(
                    "inline-flex size-8 shrink-0 overflow-hidden rounded-full border border-(--app-border-subtle) bg-(--app-surface-soft)",
                    className,
                )}
            >
                <img
                    src={avatarUrl}
                    alt=""
                    className="size-full object-cover"
                />
            </span>
        );
    }

    return (
        <span
            className={cn(
                "inline-flex size-8 shrink-0 items-center justify-center rounded-full border border-(--app-border-subtle) bg-background-accent text-xs font-bold text-primary",
                className,
            )}
            aria-hidden="true"
        >
            {getUserInitials(displayName)}
        </span>
    );
}

function UserMenuContent() {
    const user = useUserContext();

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
                <Avatar
                    avatarUrl={user.avatarUrl}
                    displayName={user.displayName}
                    className="size-11 text-sm"
                />

                <div className="min-w-0 flex-1 space-y-1">
                    <p className="app-text-strong truncate text-sm font-semibold">
                        {user.displayName}
                    </p>
                    <p className="app-text-muted truncate text-xs">
                        {user.email ?? "Local planner profile"}
                    </p>
                </div>
            </div>

            <div className="rounded-2xl border border-(--app-border-subtle) bg-(--app-surface-soft) p-3">
                <p className="app-text-subtle text-[11px] font-semibold uppercase tracking-[0.16em]">
                    Theme
                </p>
                <p className="app-text-muted mt-1 text-xs leading-5">
                    Adjust the planner appearance from your profile menu.
                </p>
                <ThemeSwitcher fill size="compact" className="mt-3 w-full" />
            </div>

            <div className="space-y-2">
                <Button
                    type="button"
                    variant="outline"
                    className="w-full justify-between rounded-2xl px-3"
                    disabled
                >
                    <span className="flex items-center gap-2">
                        <LogOut className="size-4" />
                        Logout
                    </span>
                    <span className="app-text-subtle text-[11px] font-semibold uppercase tracking-[0.12em]">
                        Soon
                    </span>
                </Button>
                <p className="app-text-subtle px-1 text-[11px] leading-4">
                    Authentication is not wired yet, so logout stays disabled for
                    now.
                </p>
            </div>
        </div>
    );
}

export default function UserMenu({ layoutMode }: UserMenuProps) {
    const [open, setOpen] = useState(false);
    const user = useUserContext();

    const trigger = (
        <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-8 rounded-full px-2.5 sm:h-9"
            aria-label="Open user menu"
        >
            <Avatar avatarUrl={user.avatarUrl} displayName={user.displayName} />
            <ChevronDown className="size-3.5 text-(--app-text-subtle)" />
        </Button>
    );

    if (layoutMode === "mobile") {
        return (
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>{trigger}</DialogTrigger>
                <DialogContent className="top-auto right-0 bottom-0 left-0 h-auto max-h-[min(80dvh,34rem)] w-full max-w-none translate-x-0 translate-y-0 gap-4 rounded-t-4xl rounded-b-none border-x-0 border-b-0 p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] sm:max-w-none sm:p-5 sm:pb-[calc(1.25rem+env(safe-area-inset-bottom))]">
                    <DialogHeader>
                        <DialogTitle>User menu</DialogTitle>
                        <DialogDescription>
                            Manage the local planner profile and appearance.
                        </DialogDescription>
                    </DialogHeader>

                    <UserMenuContent />
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>{trigger}</PopoverTrigger>
            <PopoverContent className="w-80">
                <UserMenuContent />
            </PopoverContent>
        </Popover>
    );
}