import Header from "./components/Header";
import TemplatesBar from "./components/TemplatesBar";
import NotesSidebar from "./components/NotesSidebar";

function App() {
    return (
        <div className="m-6 md:mx-8 flex flex-row h-full">
            <main className="mr-3 flex-auto">
                <Header />
                <TemplatesBar />

                {/* TODO: Implement grid toolbar */}
                <div className="pt-6 pb-0 px-0">
                    <span>Grid Toolbar</span>
                </div>

                {/* TODO: Implement schedule grid */}
                <section className="pt-3 pb-0 px-0">
                    <span>Grid</span>
                </section>
            </main>

            <aside className="ml-3 md:w-80 2xl:w-120 flex-none">
                <NotesSidebar />
            </aside>
        </div>
    );
}

export default App;
