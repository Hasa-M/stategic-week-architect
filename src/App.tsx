import { useState } from "react";
import Header from "./components/Header";
import TemplatesBar from "./components/TemplatesBar";
import { Sidebar, type SidebarView } from "./components/Sidebar";
import { GridToolbar, ScheduleGrid } from "./components/Grid";

function App() {
    const [sidebarView, setSidebarView] = useState<SidebarView>("dashboard");

    const toggleSidebar = () => {
        setSidebarView((prev) => (prev === "dashboard" ? "notes" : "dashboard"));
    };

    return (
        <div className="m-6 md:mx-8 flex flex-row h-full">
            <main className="mr-3 flex-auto flex flex-col">
                <Header
                    sidebarView={sidebarView}
                    onToggleSidebar={toggleSidebar}
                />
                <TemplatesBar />
                <GridToolbar />
                <section className="flex-1 overflow-auto">
                    <ScheduleGrid />
                </section>
            </main>

            <aside className="ml-3 md:w-80 2xl:w-120 flex-none">
                <Sidebar view={sidebarView} />
            </aside>
        </div>
    );
}

export default App;
