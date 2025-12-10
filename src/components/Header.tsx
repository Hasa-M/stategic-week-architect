import { ArrowRightIcon } from "lucide-react";

import { WeeklyAppButton } from "./Button/Button";

export default function Header() {
    return (
        <header className="p-0 flex flex-row flex-wrap gap-4">
            <span className="flex-1">
                <p className="text-nowrap text-ellipsis text-[32px]/10 font-bold text-cyan-800">
                    Welcome to Your Weekly Schedule!
                </p>
            </span>
            <WeeklyAppButton
                variant="ghost"
                size="lg"
                onClick={() =>
                    alert("This feature will be available in the future...")
                }
            >
                View Notes <ArrowRightIcon />
            </WeeklyAppButton>
        </header>
    );
}
