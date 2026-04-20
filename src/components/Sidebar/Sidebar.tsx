import NotesSidebar from "./NotesSidebar";
import { cn } from "@/lib/utils";
import SummaryDashboard from "./SummaryDashboard";

export type SidebarView = "summary" | "notes";

type SidebarProps = {
    view: SidebarView;
    className?: string;
    continuousScroll?: boolean;
    onViewChange?: (view: SidebarView) => void;
    showViewSwitcher?: boolean;
};

export default function Sidebar({
    view,
    className,
    continuousScroll = false,
    onViewChange,
    showViewSwitcher = false,
}: SidebarProps) {
    return (
        <div
            className={cn(
                "app-panel flex w-full flex-col p-3 md:p-4",
                continuousScroll ? "overflow-visible" : "h-full min-h-0 overflow-hidden",
                className
            )}
        >
            {showViewSwitcher ? (
                <div className="mb-2.5">
                    <div
                        className="app-segmented-control flex w-full min-w-0 items-center rounded-full border p-0.5"
                        role="group"
                        aria-label="Sidebar section"
                    >
                        <button
                            type="button"
                            className={cn(
                                "app-segmented-control__button inline-flex h-7 min-w-0 flex-1 basis-0 items-center justify-center whitespace-nowrap rounded-full px-2.5 text-[11px] font-semibold transition-all",
                                view === "summary" &&
                                    "app-segmented-control__button--active"
                            )}
                            onClick={() => onViewChange?.("summary")}
                            aria-pressed={view === "summary"}
                        >
                            Dashboard
                        </button>
                        <button
                            type="button"
                            className={cn(
                                "app-segmented-control__button inline-flex h-7 min-w-0 flex-1 basis-0 items-center justify-center whitespace-nowrap rounded-full px-2.5 text-[11px] font-semibold transition-all",
                                view === "notes" &&
                                    "app-segmented-control__button--active"
                            )}
                            onClick={() => onViewChange?.("notes")}
                            aria-pressed={view === "notes"}
                        >
                            Notes
                        </button>
                    </div>
                </div>
            ) : null}

            <div className={cn(!continuousScroll && "min-h-0 flex-1 overflow-hidden")}>
                {view === "notes" ? (
                    <NotesSidebar continuousScroll={continuousScroll} />
                ) : (
                    <SummaryDashboard continuousScroll={continuousScroll} />
                )}
            </div>
        </div>
    );
}
