import { BarChart3, LayoutGrid, StickyNote } from "lucide-react";
import { useEffect, useState } from "react";

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

const TABLET_BREAKPOINT = 768;
const DESKTOP_BREAKPOINT = 1280;

const MOBILE_NAV_ITEMS: {
    id: MobileView;
    label: string;
    icon: typeof LayoutGrid;
}[] = [
    { id: "grid", label: "Grid", icon: LayoutGrid },
    { id: "notes", label: "Notes", icon: StickyNote },
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
];

function resolveLayoutMode(width: number): LayoutMode {
    if (width >= DESKTOP_BREAKPOINT) {
        return "desktop";
    }

    if (width >= TABLET_BREAKPOINT) {
        return "tablet";
    }

    return "mobile";
}

function App() {
    const [layoutMode, setLayoutMode] = useState<LayoutMode>(() => {
        if (typeof window === "undefined") {
            return "desktop";
        }

        return resolveLayoutMode(window.innerWidth);
    });
    const [sidebarView, setSidebarView] = useState<SidebarView>("summary");
    const [tabletSidebarOpen, setTabletSidebarOpen] = useState(false);
    const [mobileView, setMobileView] = useState<MobileView>("grid");
    const [mobileSettingsOpen, setMobileSettingsOpen] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            const nextMode = resolveLayoutMode(window.innerWidth);

            setLayoutMode((currentMode) => {
                if (currentMode === nextMode) {
                    return currentMode;
                }

                if (nextMode !== "tablet") {
                    setTabletSidebarOpen(false);
                }

                if (nextMode !== "mobile") {
                    setMobileSettingsOpen(false);
                    setMobileView("grid");
                }

                return nextMode;
            });
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    const toggleDesktopSidebar = () => {
        setSidebarView((prev) => (prev === "summary" ? "notes" : "summary"));
    };

    const plannerContent = (
        <>
            <TemplatesBar />
            <GridToolbar
                layout={layoutMode === "mobile" ? "mobile" : "desktop"}
                onOpenSettings={
                    layoutMode === "mobile"
                        ? () => setMobileSettingsOpen(true)
                        : undefined
                }
            />
            <section className="app-scrollbar min-h-0 flex-1 overflow-auto">
                <ScheduleGrid />
            </section>
        </>
    );

    const mobilePanelView: SidebarView =
        mobileView === "notes" ? "notes" : "summary";

    const mainContent =
        layoutMode === "mobile" && mobileView !== "grid" ? (
            <Sidebar view={mobilePanelView} className="flex-1" />
        ) : (
            plannerContent
        );

    return (
        <div
            className={cn(
                "app-shell px-4 py-4 md:px-6 xl:px-8",
                layoutMode === "mobile" &&
                    "pb-[calc(6.75rem+env(safe-area-inset-bottom))]"
            )}
        >
            <div
                className={cn(
                    "mx-auto flex min-h-full max-w-405 gap-4 xl:gap-5",
                    layoutMode === "desktop" ? "h-full" : "flex-col"
                )}
            >
                <main className="flex min-w-0 flex-auto flex-col gap-4">
                    <Header
                        layoutMode={layoutMode}
                        sidebarView={sidebarView}
                        onToggleSidebar={toggleDesktopSidebar}
                        onOpenSidebar={() => setTabletSidebarOpen(true)}
                    />
                    {mainContent}
                </main>

                {layoutMode === "desktop" ? (
                    <aside className="flex min-h-0 w-[clamp(320px,31vw,520px)] max-w-130 flex-none">
                        <Sidebar view={sidebarView} />
                    </aside>
                ) : null}
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
                            onViewChange={setSidebarView}
                            showViewSwitcher
                            className="h-full"
                        />
                    </DialogContent>
                </Dialog>
            ) : null}

            {layoutMode === "mobile" ? (
                <>
                    <Dialog
                        open={mobileSettingsOpen}
                        onOpenChange={setMobileSettingsOpen}
                    >
                        <DialogContent className="top-auto right-0 bottom-0 left-0 h-auto max-h-[min(80dvh,44rem)] w-full max-w-none translate-x-0 translate-y-0 gap-4 rounded-t-4xl rounded-b-none border-x-0 border-b-0 p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] sm:max-w-none sm:p-5 sm:pb-[calc(1.25rem+env(safe-area-inset-bottom))]">
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
                                    <Icon className="size-4" />
                                    <span>{item.label}</span>
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
