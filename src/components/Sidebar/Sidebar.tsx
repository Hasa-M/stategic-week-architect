import NotesSidebar from "../NotesSidebar";
import SummaryDashboard from "./SummaryDashboard";

export type SidebarView = "dashboard" | "notes";

type SidebarProps = {
    view: SidebarView;
};

export default function Sidebar({ view }: SidebarProps) {
    return (
        <div className="h-full">
            {view === "notes" ? <NotesSidebar /> : <SummaryDashboard />}
        </div>
    );
}
