import { useDispatch, useUserContext } from "@/context/hooks";
import { cn } from "@/lib/utils";
import type { ThemeMode } from "@/types";

const THEME_OPTIONS: { label: string; value: ThemeMode }[] = [
    { label: "Light", value: "light" },
    { label: "Contrast", value: "high-contrast" },
    { label: "Dark", value: "dark" },
];

type ThemeSwitcherProps = {
    className?: string;
    fill?: boolean;
    size?: "default" | "compact";
};

export default function ThemeSwitcher({
    className,
    fill = false,
    size = "default",
}: ThemeSwitcherProps) {
    const user = useUserContext();
    const dispatch = useDispatch();
    const isCompact = size === "compact";

    return (
        <div
            className={cn(
                "app-segmented-control min-w-0 items-center rounded-full border sm:h-auto",
                fill ? "flex w-full" : "inline-flex w-fit max-w-full",
                isCompact
                    ? "h-8 p-0.5"
                    : "p-1",
                className
            )}
            role="group"
            aria-label="Theme switcher"
        >
            {THEME_OPTIONS.map((option) => {
                const isActive = user.theme === option.value;

                return (
                    <button
                        key={option.value}
                        type="button"
                        className={cn(
                            "app-segmented-control__button inline-flex min-w-0 items-center justify-center whitespace-nowrap rounded-full font-semibold transition-all",
                            fill ? "flex-1 basis-0" : "flex-none w-fit",
                            isCompact
                                ? "h-7 px-2.5 text-[11px]"
                                : "px-3.5 py-2 text-sm",
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