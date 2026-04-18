import NotesSidebar from "../NotesSidebar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import SummaryDashboard from "./SummaryDashboard";

export type SidebarView = "summary" | "notes";

type SidebarProps = {
    view: SidebarView;
    className?: string;
    onViewChange?: (view: SidebarView) => void;
    showViewSwitcher?: boolean;
};

export default function Sidebar({
    view,
    className,
    onViewChange,
    showViewSwitcher = false,
}: SidebarProps) {
    return (
        <div
            className={cn(
                "app-panel flex h-full min-h-0 flex-col overflow-hidden p-4 md:p-5",
                className
            )}
        >
            {showViewSwitcher ? (
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <span className="app-badge mb-2 w-fit">Sidebar</span>
                        <p className="text-lg font-semibold text-slate-800">
                            Dashboard or notes
                        </p>
                    </div>

                    <div className="app-panel-muted flex items-center gap-2 p-1.5">
                        <Button
                            type="button"
                            variant={view === "summary" ? "default" : "ghost"}
                            size="sm"
                            className="rounded-full"
                            onClick={() => onViewChange?.("summary")}
                        >
                            Dashboard
                        </Button>
                        <Button
                            type="button"
                            variant={view === "notes" ? "default" : "ghost"}
                            size="sm"
                            className="rounded-full"
                            onClick={() => onViewChange?.("notes")}
                        >
                            Notes
                        </Button>
                    </div>
                </div>
            ) : null}

            <div className="min-h-0 flex-1">
                {view === "notes" ? <NotesSidebar /> : <SummaryDashboard />}
            </div>
        </div>
    );
}
