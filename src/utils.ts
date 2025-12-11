import type { Color } from "./types";

export function getColorClass(color: Color): string {
    const colorClasses = {
        red: "bg-red-600",
        amber: "bg-amber-600",
        lime: "bg-lime-600",
        emerald: "bg-emerald-600",
        cyan: "bg-cyan-600",
        blue: "bg-blue-600",
        violet: "bg-violet-600",
        fuchsia: "bg-fuchsia-600",
        pink: "bg-pink-600",
        slate: "bg-slate-600",
        stone: "bg-stone-600",
    };

    return colorClasses[color];
}
