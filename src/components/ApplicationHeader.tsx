import {
    ChevronDown,
    ChevronUp,
} from "lucide-react";

import logoUrl from "@/assets/logo.svg";
import UserMenu from "@/components/UserMenu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type LayoutMode = "desktop" | "tablet" | "mobile";

type ApplicationHeaderProps = {
    layoutMode: LayoutMode;
    templatesVisible: boolean;
    onToggleTemplates: () => void;
};

const BRAND_TITLE = "The Weekly Architect";
const BRAND_TITLE_COMPACT = "The Weekly Architect";
const BRAND_SUBTITLE = "Simple planning";

function ApplicationBrand({
    compact = false,
}: {
    compact?: boolean;
}) {
    return (
        <div className="flex min-w-0 items-center gap-3">
            <span className="app-application-header__brand-mark">
                <img
                    src={logoUrl}
                    alt=""
                    className="app-application-header__brand-logo"
                />
            </span>
            <div className="app-application-header__brand-copy">
                <span className="app-application-header__brand-name">
                    {compact
                        ? BRAND_TITLE_COMPACT
                        : BRAND_TITLE}
                </span>
                <span className="app-application-header__brand-caption">
                    {BRAND_SUBTITLE}
                </span>
            </div>
        </div>
    );
}

function TemplatesToggleButton({
    className,
    templatesVisible,
    onToggleTemplates,
}: {
    className?: string;
    templatesVisible: boolean;
    onToggleTemplates: () => void;
}) {
    return (
        <Button
            type="button"
            variant={templatesVisible ? "default" : "outline"}
            size="sm"
            className={cn(
                "h-8 rounded-xl px-3 text-xs font-semibold",
                className,
            )}
            onClick={onToggleTemplates}
            aria-pressed={templatesVisible}
            aria-expanded={templatesVisible}
            aria-controls="app-templates-bar"
            title={templatesVisible ? "Hide templates" : "Show templates"}
        >
            <span className="flex items-center gap-2">
                Templates
                {templatesVisible ? (
                    <ChevronUp className="size-3.5" />
                ) : (
                    <ChevronDown className="size-3.5" />
                )}
            </span>
        </Button>
    );
}

export default function ApplicationHeader({
    layoutMode,
    templatesVisible,
    onToggleTemplates,
}: ApplicationHeaderProps) {
    return (
        <header className="app-application-header">
            <div className="app-application-header__inner px-3 md:px-4 xl:px-5">
                <div className="mx-auto flex h-12 w-full max-w-540 items-center justify-between gap-3">
                    {/* Future: wire the brand to the main dashboard once routing exists. */}
                    <div className="min-w-0 overflow-hidden">
                        <ApplicationBrand compact={layoutMode === "mobile"} />
                    </div>

                    <div className="flex items-center gap-2">
                        <TemplatesToggleButton
                            className={cn(
                                layoutMode === "mobile" && "px-2.5 text-[11px]",
                            )}
                            templatesVisible={templatesVisible}
                            onToggleTemplates={onToggleTemplates}
                        />
                        <UserMenu layoutMode={layoutMode} />
                    </div>
                </div>
            </div>
        </header>
    );
}
