import NotesSidebar from "../NotesSidebar";
import SummaryDashboard from "./SummaryDashboard";

export type SidebarView = "summary" | "notes";

type SidebarProps = {
    view: SidebarView;
};

export default function Sidebar({ view }: SidebarProps) {
    return (
        <div className="app-panel h-full overflow-hidden p-4 md:p-5">
            {view === "notes" ? <NotesSidebar /> : <SummaryDashboard />}
        </div>
    );
}
