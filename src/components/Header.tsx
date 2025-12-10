export default function Header() {
    return (
        <header className="p-0 flex flex-row flex-wrap gap-4">
            <span className="flex-1">
                <p className="text-nowrap text-ellipsis text-[32px]/10 font-bold text-cyan-800">
                    Welcome to Your Weekly Schedule!
                </p>
            </span>
            <button
                className="w-fit font-bold text-primary hover:text-primary-hover"
                onClick={() =>
                    alert("This feature will be available in the future...")
                }
            >
                View Notes {"->"}
            </button>
        </header>
    );
}
