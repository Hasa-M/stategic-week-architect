import type { Color } from "./types";

type ColorStyles = {
    solid: string;
    soft: string;
    text: string;
    border: string;
};

const COLOR_STYLES: Record<Color, ColorStyles> = {
    red: {
        solid: "bg-red-600",
        soft: "bg-red-50",
        text: "text-red-700",
        border: "border-red-200",
    },
    amber: {
        solid: "bg-amber-600",
        soft: "bg-amber-50",
        text: "text-amber-700",
        border: "border-amber-200",
    },
    lime: {
        solid: "bg-lime-600",
        soft: "bg-lime-50",
        text: "text-lime-700",
        border: "border-lime-200",
    },
    emerald: {
        solid: "bg-emerald-600",
        soft: "bg-emerald-50",
        text: "text-emerald-700",
        border: "border-emerald-200",
    },
    cyan: {
        solid: "bg-cyan-600",
        soft: "bg-cyan-50",
        text: "text-cyan-700",
        border: "border-cyan-200",
    },
    blue: {
        solid: "bg-blue-600",
        soft: "bg-blue-50",
        text: "text-blue-700",
        border: "border-blue-200",
    },
    violet: {
        solid: "bg-violet-600",
        soft: "bg-violet-50",
        text: "text-violet-700",
        border: "border-violet-200",
    },
    fuchsia: {
        solid: "bg-fuchsia-600",
        soft: "bg-fuchsia-50",
        text: "text-fuchsia-700",
        border: "border-fuchsia-200",
    },
    pink: {
        solid: "bg-pink-600",
        soft: "bg-pink-50",
        text: "text-pink-700",
        border: "border-pink-200",
    },
    slate: {
        solid: "bg-slate-600",
        soft: "bg-slate-100",
        text: "text-slate-700",
        border: "border-slate-200",
    },
    stone: {
        solid: "bg-stone-600",
        soft: "bg-stone-100",
        text: "text-stone-700",
        border: "border-stone-200",
    },
};

export function getColorStyles(color: Color): ColorStyles {
    return COLOR_STYLES[color];
}

export function getColorClass(color: Color): string {
    return getColorStyles(color).solid;
}
