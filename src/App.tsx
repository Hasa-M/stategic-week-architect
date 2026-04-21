import { BarChart3, LayoutGrid, StickyNote } from "lucide-react";
import { useEffect, useState } from "react";

import ApplicationHeader from "@/components/ApplicationHeader";
import Header from "@/components/Header";
import TemplatesBar from "@/components/TemplatesBar";
import { GridSettingsControls, GridToolbar, ScheduleGrid } from "@/components/Grid";
import { Sidebar, type SidebarView } from "@/components/Sidebar";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

type LayoutMode = "mobile" | "tablet" | "desktop";
type MobileView = "grid" | "notes" | "dashboard";

const MOBILE_BREAKPOINT = 768;
const GRID_TOOLBAR_COMPACT_BREAKPOINT = 960;
const DESKTOP_BREAKPOINT = 1360;

const MOBILE_NAV_ITEMS: {
    id: MobileView;
    label: string;
    icon: typeof LayoutGrid;
}[] = [
    { id: "grid", label: "Grid", icon: LayoutGrid },
    { id: "notes", label: "Notes", icon: StickyNote },
    { id: "dashboard", label: "Summary", icon: BarChart3 },
];

function getViewportWidth() {
    if (typeof window === "undefined") {
        return DESKTOP_BREAKPOINT;
    }

    return window.innerWidth;
}

function resolveLayoutMode(width: number): LayoutMode {
    if (width >= DESKTOP_BREAKPOINT) {
        return "desktop";
    }

    if (width >= MOBILE_BREAKPOINT) {
        return "tablet";
    }

    return "mobile";
}

function resolveToolbarLayout(width: number, layoutMode: LayoutMode): LayoutMode {
    if (width < GRID_TOOLBAR_COMPACT_BREAKPOINT) {
        return "mobile";
    }

    return layoutMode;
}

function App() {
    const [viewportWidth, setViewportWidth] = useState(() => getViewportWidth());
    const [layoutMode, setLayoutMode] = useState<LayoutMode>(() =>
        resolveLayoutMode(getViewportWidth())
    );
    const [sidebarView, setSidebarView] = useState<SidebarView>("summary");
    const [tabletSidebarOpen, setTabletSidebarOpen] = useState(false);
    const [mobileView, setMobileView] = useState<MobileView>("grid");
    const [mobileSettingsOpen, setMobileSettingsOpen] = useState(false);
    const [templatesVisible, setTemplatesVisible] = useState(false);
    const [isGridExpanded, setIsGridExpanded] = useState(false);
    const [isToolbarCompact, setIsToolbarCompact] = useState(false);
    const toolbarLayout = resolveToolbarLayout(viewportWidth, layoutMode);
    const isContinuousMobileLayout = layoutMode === "mobile" && !isGridExpanded;

    useEffect(() => {
        const handleResize = () => {
            const nextViewportWidth = window.innerWidth;
            const nextLayoutMode = resolveLayoutMode(nextViewportWidth);

            setViewportWidth((currentWidth) =>
                currentWidth === nextViewportWidth ? currentWidth : nextViewportWidth
            );
            setLayoutMode((currentMode) => {
                if (currentMode === nextLayoutMode) {
                    return currentMode;
                }

                if (nextLayoutMode !== "tablet") {
                    setTabletSidebarOpen(false);
                }

                if (nextLayoutMode !== "mobile") {
                    setMobileView("grid");
                }

                return nextLayoutMode;
            });
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    useEffect(() => {
        if (!isGridExpanded) {
            return;
        }

        const previousHtmlOverflow = document.documentElement.style.overflow;
        const previousBodyOverflow = document.body.style.overflow;

        document.documentElement.style.overflow = "hidden";
        document.body.style.overflow = "hidden";

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setIsGridExpanded(false);
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            document.documentElement.style.overflow = previousHtmlOverflow;
            document.body.style.overflow = previousBodyOverflow;
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [isGridExpanded]);

    const toggleGridExpanded = () => {
        setIsGridExpanded((current) => !current);
    };

    const toggleTemplatesVisible = () => {
        setTemplatesVisible((current) => !current);
    };

    const plannerContent = (
        <>
            <div
                className={cn(
                    isContinuousMobileLayout
                        ? "flex flex-col"
                        : "flex min-h-0 flex-1 flex-col overflow-hidden",
                    isGridExpanded &&
                        "fixed inset-0 z-50 bg-background/85 p-2 backdrop-blur-sm md:p-4"
                )}
            >
                <div
                    className={cn(
                        isContinuousMobileLayout
                            ? "flex flex-col gap-4"
                            : "flex h-full min-h-0 flex-1 flex-col gap-4",
                        isGridExpanded && "mx-auto h-full w-full max-w-540"
                    )}
                >
                    <GridToolbar
                        layout={toolbarLayout}
                        onOpenSettings={() => setMobileSettingsOpen(true)}
                        isExpanded={isGridExpanded}
                        onToggleExpand={toggleGridExpanded}
                        onCompactChange={setIsToolbarCompact}
                    />
                    <section
                        className={cn(
                            !isContinuousMobileLayout && "min-h-0 flex-1 overflow-hidden"
                        )}
                    >
                        <ScheduleGrid continuousScroll={isContinuousMobileLayout} />
                    </section>
                </div>
            </div>
        </>
    );

    const mobilePanelView: SidebarView =
        mobileView === "notes" ? "notes" : "summary";

    const mainContent =
        layoutMode === "mobile" && mobileView !== "grid" ? (
            <Sidebar
                view={mobilePanelView}
                continuousScroll={isContinuousMobileLayout}
                className={cn(
                    isContinuousMobileLayout ? "w-full" : "min-h-0 flex-1"
                )}
            />
        ) : (
            plannerContent
        );

    return (
        <div
            className={cn(
                "app-shell",
                isContinuousMobileLayout && "app-shell--mobile"
            )}
        >
            <ApplicationHeader
                layoutMode={layoutMode}
                templatesVisible={templatesVisible}
                onToggleTemplates={toggleTemplatesVisible}
            />

            {templatesVisible ? (
                <section className="app-shell__templates px-4 py-3 md:px-6 xl:px-8">
                    <div className="mx-auto max-w-540">
                        <TemplatesBar
                            id="app-templates-bar"
                            onClose={() => setTemplatesVisible(false)}
                        />
                    </div>
                </section>
            ) : null}

            <div
                className={cn(
                    "app-shell__content px-3 py-3 md:px-4 xl:px-5",
                    layoutMode === "mobile" &&
                        "pb-[calc(5.5rem+env(safe-area-inset-bottom))]"
                )}
            >
                <div
                    className={cn(
                        "mx-auto flex max-w-540 gap-3",
                        layoutMode === "desktop"
                            ? "h-full min-h-0 flex-row"
                            : layoutMode === "tablet"
                              ? "h-full min-h-0 flex-col"
                              : "flex-col"
                    )}
                >
                    <main
                        className={cn(
                            "flex min-w-0 flex-col gap-4",
                            layoutMode !== "mobile" && "min-h-0 overflow-hidden",
                            layoutMode === "desktop"
                                ? "w-full max-w-405 flex-1"
                                : layoutMode === "tablet"
                                  ? "flex-auto"
                                  : undefined
                        )}
                    >
                        <Header
                            layoutMode={layoutMode}
                            onOpenSidebar={() => setTabletSidebarOpen(true)}
                            compact={layoutMode === "mobile" || isToolbarCompact}
                        />
                        {mainContent}
                    </main>

                    {layoutMode === "desktop" ? (
                        <aside className="flex min-h-0 w-[clamp(280px,27vw,380px)] max-w-96 flex-none">
                            <Sidebar
                                view={sidebarView}
                                continuousScroll={false}
                                onViewChange={setSidebarView}
                                showViewSwitcher
                                className="w-full"
                            />
                        </aside>
                    ) : null}
                </div>
            </div>

            {layoutMode === "tablet" ? (
                <Dialog open={tabletSidebarOpen} onOpenChange={setTabletSidebarOpen}>
                    <DialogContent className="top-0 right-0 bottom-0 left-0 h-dvh max-h-dvh w-screen max-w-none translate-x-0 translate-y-0 gap-4 overflow-hidden border-0 bg-transparent p-4 shadow-none sm:max-w-none sm:p-4 md:p-6">
                        <DialogHeader className="sr-only">
                            <DialogTitle>Planner sidebar</DialogTitle>
                            <DialogDescription>
                                Switch between the dashboard and the full notes list
                                without shrinking the weekly grid.
                            </DialogDescription>
                        </DialogHeader>

                        <Sidebar
                            view={sidebarView}
                            continuousScroll={false}
                            onViewChange={setSidebarView}
                            showViewSwitcher
                            className="h-full"
                        />
                    </DialogContent>
                </Dialog>
            ) : null}

            <Dialog
                open={mobileSettingsOpen}
                onOpenChange={setMobileSettingsOpen}
            >
                <DialogContent
                    className={cn(
                        "gap-4",
                        layoutMode === "mobile"
                            ? "top-auto right-0 bottom-0 left-0 h-auto max-h-[min(80dvh,44rem)] w-full max-w-none translate-x-0 translate-y-0 rounded-t-4xl rounded-b-none border-x-0 border-b-0 p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] sm:max-w-none sm:p-5 sm:pb-[calc(1.25rem+env(safe-area-inset-bottom))]"
                            : "max-h-[min(90dvh,44rem)] w-[calc(100vw-2rem)] max-w-2xl overflow-y-auto p-5"
                    )}
                >
                    <DialogHeader>
                        <DialogTitle>Grid settings</DialogTitle>
                        <DialogDescription>
                            Choose the visible days, slot size, and time
                            range for the weekly plan.
                        </DialogDescription>
                    </DialogHeader>

                    <GridSettingsControls stacked />
                </DialogContent>
            </Dialog>

            {layoutMode === "mobile" ? (
                <>
                    <nav className="app-mobile-nav md:hidden" aria-label="Mobile navigation">
                        {MOBILE_NAV_ITEMS.map((item) => {
                            const Icon = item.icon;
                            const isActive = mobileView === item.id;

                            return (
                                <button
                                    key={item.id}
                                    type="button"
                                    className={cn(
                                        "app-mobile-nav__item",
                                        isActive && "app-mobile-nav__item--active"
                                    )}
                                    onClick={() => setMobileView(item.id)}
                                    aria-current={isActive ? "page" : undefined}
                                >
                                    <Icon className="app-mobile-nav__icon" />
                                    <span className="app-mobile-nav__label">{item.label}</span>
                                </button>
                            );
                        })}
                    </nav>
                </>
            ) : null}
        </div>
    );
}

export default App;
