import {
    ChevronDown,
    ChevronUp,
    Languages,
    LayoutGrid,
    Menu,
} from "lucide-react";

import logoUrl from "@/assets/logo.svg";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type {
    ScheduleCollectionItem,
    ScheduleCollectionSummary,
} from "@/types";

type LayoutMode = "desktop" | "tablet" | "mobile";

type ApplicationHeaderProps = {
    layoutMode: LayoutMode;
    scheduleCollectionSummary: ScheduleCollectionSummary;
    templatesVisible: boolean;
    onToggleTemplates: () => void;
    onOpenMobileMenu: () => void;
};

type ApplicationHeaderControlsProps = {
    compactTheme?: boolean;
    scheduleCollectionSummary: ScheduleCollectionSummary;
    showTemplatesToggle?: boolean;
    stacked?: boolean;
    templatesVisible: boolean;
    onToggleTemplates: () => void;
};

const BRAND_TITLE = "Weekly Flow Studio";
const BRAND_TITLE_COMPACT = "Weekly Flow";
const BRAND_SUBTITLE = "Simple planning";

function resolveActiveSchedule(
    scheduleCollectionSummary: ScheduleCollectionSummary,
): ScheduleCollectionItem | null {
    return (
        scheduleCollectionSummary.schedules.find(
            (schedule) =>
                schedule.id === scheduleCollectionSummary.activeScheduleId,
        ) ??
        scheduleCollectionSummary.schedules[0] ??
        null
    );
}

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
            <div className="flex min-w-0 flex-col justify-center gap-0.5">
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

export function ApplicationHeaderMenuPanel({
    scheduleCollectionSummary,
    templatesVisible,
    onToggleTemplates,
}: Omit<ApplicationHeaderControlsProps, "compactTheme" | "stacked">) {
    const activeSchedule = resolveActiveSchedule(scheduleCollectionSummary);

    return (
        <div className="flex h-full flex-col gap-5">
            <section className="app-panel-muted flex flex-col gap-4 p-4">
                <div className="flex items-center gap-3">
                    <span className="app-application-header__brand-mark shrink-0">
                        <img
                            src={logoUrl}
                            alt=""
                            className="app-application-header__brand-logo"
                        />
                    </span>
                    <div className="min-w-0 space-y-1">
                        <p className="app-text-strong text-sm font-semibold">
                            {BRAND_TITLE}
                        </p>
                        <p className="app-text-muted text-xs">
                            {BRAND_SUBTITLE}
                        </p>
                    </div>
                </div>

                {activeSchedule ? (
                    <div className="space-y-3">
                        <div className="space-y-1.5">
                            <p className="app-text-subtle text-[11px] font-semibold uppercase tracking-[0.16em]">
                                Active schedule
                            </p>
                            <p className="app-text-strong text-lg font-semibold tracking-tight">
                                {activeSchedule.name}
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <span className="app-inline-pill">
                                <span className="app-inline-pill__value">
                                    {activeSchedule.templateCount}
                                </span>
                                templates
                            </span>
                            <span className="app-inline-pill">
                                <span className="app-inline-pill__value">
                                    {activeSchedule.placedActivityCount}
                                </span>
                                planned slots
                            </span>
                            <span className="app-inline-pill">
                                <span className="app-inline-pill__value">
                                    {activeSchedule.noteCount}
                                </span>
                                notes
                            </span>
                        </div>
                    </div>
                ) : null}
            </section>

            <section className="space-y-3">
                <p className="app-text-subtle text-[11px] font-semibold uppercase tracking-[0.16em]">
                    Application controls
                </p>

                <ApplicationHeaderControls
                    scheduleCollectionSummary={scheduleCollectionSummary}
                    showTemplatesToggle={false}
                    stacked
                    templatesVisible={templatesVisible}
                    onToggleTemplates={onToggleTemplates}
                />
            </section>
        </div>
    );
}

export function ApplicationHeaderControls({
    compactTheme = false,
    scheduleCollectionSummary,
    showTemplatesToggle = true,
    stacked = false,
    templatesVisible,
    onToggleTemplates,
}: ApplicationHeaderControlsProps) {
    const scheduleCount = scheduleCollectionSummary.schedules.length;

    return (
        <div
            className={cn(
                "flex min-w-0 items-center gap-3",
                stacked ? "flex-col items-stretch" : "justify-end",
            )}
        >
            <Button
                type="button"
                variant="outline"
                size="sm"
                className={cn(
                    "h-8 rounded-xl px-3 text-xs font-semibold",
                    stacked && "w-full justify-between",
                )}
                disabled
            >
                <span className="flex items-center gap-2 text-left">
                    <LayoutGrid className="size-3.5" />
                    Lists
                </span>
                <span className="app-application-header__count-badge">
                    {scheduleCount}
                </span>
            </Button>

            {/* TODO: add language switching for French, Italian, Spanish, and German. */}
            <Button
                type="button"
                variant="outline"
                size="sm"
                className={cn(
                    "h-8 rounded-xl px-3 text-xs font-semibold",
                    stacked && "w-full justify-between",
                )}
                disabled
            >
                <span className="flex items-center gap-2">
                    <Languages className="size-3.5" />
                    Language
                </span>
            </Button>

            <ThemeSwitcher
                fill={stacked}
                size={compactTheme ? "compact" : "default"}
                className={cn(stacked ? "w-full" : "shrink-0")}
            />

            {showTemplatesToggle ? (
                <TemplatesToggleButton
                    className={cn(stacked && "w-full justify-between")}
                    templatesVisible={templatesVisible}
                    onToggleTemplates={onToggleTemplates}
                />
            ) : null}
        </div>
    );
}

export default function ApplicationHeader({
    layoutMode,
    scheduleCollectionSummary,
    templatesVisible,
    onToggleTemplates,
    onOpenMobileMenu,
}: ApplicationHeaderProps) {
    return (
        <header className="app-application-header">
            <div className="app-application-header__inner px-4 md:px-6 xl:px-8">
                {layoutMode === "mobile" ? (
                    <div className="relative mx-auto flex h-12 w-full max-w-540 items-center justify-center px-11">
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            className="absolute top-1/2 left-0 size-8 -translate-y-1/2 rounded-xl"
                            onClick={onOpenMobileMenu}
                            aria-label="Open application menu"
                        >
                            <Menu className="size-4" />
                        </Button>

                        <div className="flex min-w-0 max-w-full items-center justify-center gap-3 overflow-hidden">
                            {/* Future: wire the brand to the main dashboard once routing exists. */}
                            <div className="min-w-0 overflow-hidden">
                                <ApplicationBrand compact />
                            </div>
                            <TemplatesToggleButton
                                className="shrink-0 px-2.5 text-[11px]"
                                templatesVisible={templatesVisible}
                                onToggleTemplates={onToggleTemplates}
                            />
                        </div>
                    </div>
                ) : (
                    <div className="mx-auto flex h-12 max-w-540 items-center justify-between gap-4">
                        {/* Future: wire the brand to the main dashboard once routing exists. */}
                        <ApplicationBrand />
                        <ApplicationHeaderControls
                            compactTheme
                            scheduleCollectionSummary={
                                scheduleCollectionSummary
                            }
                            templatesVisible={templatesVisible}
                            onToggleTemplates={onToggleTemplates}
                        />
                    </div>
                )}
            </div>
        </header>
    );
}
