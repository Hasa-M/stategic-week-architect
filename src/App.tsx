function App() {
    return (
        <div className="flex flex-row h-full">
            <main className="my-5 ml-6 mr-3 flex-auto">
                <header className="pt-5 pb-0 px-0">
                    <span>Title + Notes Control</span>
                </header>
                <div className="pt-6 pb-0 px-0">
                    <span>Templates Bar</span>
                </div>
                <div className="pt-6 pb-0 px-0">
                    <span>Grid Toolbar</span>
                </div>
                <section className="pt-3 pb-0 px-0">
                    <span>Grid</span>
                </section>
            </main>
            <aside className="my-5 ml-3 mr-6 md:w-80 2xl:w-120 flex-none">
                Sidebar
            </aside>
        </div>
    );
}

export default App;
