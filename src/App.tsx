import { useState } from "react";
import Header from "./components/Header";
import TemplatesBar from "./components/TemplatesBar";
import { Sidebar, type SidebarView } from "./components/Sidebar";
import { GridToolbar, ScheduleGrid } from "./components/Grid";

function App() {
    const [sidebarView, setSidebarView] = useState<SidebarView>("summary");

    const toggleSidebar = () => {
        setSidebarView((prev) => (prev === "summary" ? "notes" : "summary"));
    };

    return (
        <div className="app-shell px-4 py-4 md:px-6 xl:px-8">
            <div className="mx-auto flex h-full max-w-[1600px] gap-4 xl:gap-5">
                <main className="flex min-w-0 flex-auto flex-col gap-4">
                    <Header
                        sidebarView={sidebarView}
                        onToggleSidebar={toggleSidebar}
                    />
                    <TemplatesBar />
                    <GridToolbar />
                    <section className="app-scrollbar min-h-0 flex-1 overflow-auto">
                        <ScheduleGrid />
                    </section>
                </main>

                <aside className="flex min-h-0 flex-none md:w-80 2xl:w-120">
                    <Sidebar view={sidebarView} />
                </aside>
            </div>
        </div>
    );
}

export default App;
