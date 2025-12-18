import Header from "./components/Header";
import { Select } from "./components/Inputs/ui-select/select";
import TemplatesBar from "./components/TemplatesBar";

function App() {
    return (
        <div className="m-6 md:mx-8 flex flex-row h-full">
            <main className="mr-3 flex-auto">
                <Header />
                <TemplatesBar />
                <div className="pt-6 pb-0 px-0">
                    <span>Grid Toolbar</span>
                </div>
                <section className="pt-3 pb-0 px-0">
                    <span>Grid</span>
                </section>
                <Select
                    name="color"
                    options={[
                        { value: "red", label: "Red" },
                        { value: "lime", label: "Lime" },
                    ]}
                    required={true}
                />
            </main>
            <aside className="ml-3 md:w-80 2xl:w-120 flex-none">Sidebar</aside>
        </div>
    );
}

export default App;
