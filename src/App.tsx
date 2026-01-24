import Header from "./components/Header";
import TemplatesBar from "./components/TemplatesBar";


function App() {
    return (
        <div className="m-6 md:mx-8 flex flex-row h-full">
            {/* Main content area */}
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

            {/* Sidebar for notes and additional content */}
            <aside className="ml-3 md:w-80 2xl:w-120 flex-none">
                {/* TODO: Implement notes sidebar */}
                Sidebar
            </aside>
        </div>
    );
}

export default App;
