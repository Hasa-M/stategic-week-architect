import { useDispatch, useScheduleContext } from "@/context/hooks";
import { cn } from "@/lib/utils";
import type { ThemeMode } from "@/types";

const THEME_OPTIONS: { label: string; value: ThemeMode }[] = [
    { label: "Light", value: "light" },
    { label: "Contrast", value: "high-contrast" },
    { label: "Dark", value: "dark" },
];

type ThemeSwitcherProps = {
    className?: string;
};

export default function ThemeSwitcher({ className }: ThemeSwitcherProps) {
    const schedule = useScheduleContext();
    const dispatch = useDispatch();

    return (
        <div
            className={cn(
                "app-segmented-control inline-flex w-full min-w-0 rounded-full border p-1 sm:w-auto",
                className
            )}
            role="group"
            aria-label="Theme switcher"
        >
            {THEME_OPTIONS.map((option) => {
                const isActive = schedule.theme === option.value;

                return (
                    <button
                        key={option.value}
                        type="button"
                        className={cn(
                            "app-segmented-control__button rounded-full px-3.5 py-2 text-sm font-semibold transition-all",
                            isActive && "app-segmented-control__button--active"
                        )}
                        onClick={() =>
                            dispatch({
                                type: "SET_THEME",
                                payload: option.value,
                            })
                        }
                        aria-pressed={isActive}
                    >
                        {option.label}
                    </button>
                );
            })}
        </div>
    );
}