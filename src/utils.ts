import type { Color } from "./types";

type ColorStyles = {
    solid: string;
    soft: string;
    text: string;
    border: string;
};

const COLOR_STYLES: Record<Color, ColorStyles> = {
    red: {
        solid: "app-activity-red app-activity-solid",
        soft: "app-activity-red app-activity-soft",
        text: "app-activity-red app-activity-text",
        border: "app-activity-red app-activity-border",
    },
    amber: {
        solid: "app-activity-amber app-activity-solid",
        soft: "app-activity-amber app-activity-soft",
        text: "app-activity-amber app-activity-text",
        border: "app-activity-amber app-activity-border",
    },
    lime: {
        solid: "app-activity-lime app-activity-solid",
        soft: "app-activity-lime app-activity-soft",
        text: "app-activity-lime app-activity-text",
        border: "app-activity-lime app-activity-border",
    },
    emerald: {
        solid: "app-activity-emerald app-activity-solid",
        soft: "app-activity-emerald app-activity-soft",
        text: "app-activity-emerald app-activity-text",
        border: "app-activity-emerald app-activity-border",
    },
    cyan: {
        solid: "app-activity-cyan app-activity-solid",
        soft: "app-activity-cyan app-activity-soft",
        text: "app-activity-cyan app-activity-text",
        border: "app-activity-cyan app-activity-border",
    },
    blue: {
        solid: "app-activity-blue app-activity-solid",
        soft: "app-activity-blue app-activity-soft",
        text: "app-activity-blue app-activity-text",
        border: "app-activity-blue app-activity-border",
    },
    violet: {
        solid: "app-activity-violet app-activity-solid",
        soft: "app-activity-violet app-activity-soft",
        text: "app-activity-violet app-activity-text",
        border: "app-activity-violet app-activity-border",
    },
    fuchsia: {
        solid: "app-activity-fuchsia app-activity-solid",
        soft: "app-activity-fuchsia app-activity-soft",
        text: "app-activity-fuchsia app-activity-text",
        border: "app-activity-fuchsia app-activity-border",
    },
    pink: {
        solid: "app-activity-pink app-activity-solid",
        soft: "app-activity-pink app-activity-soft",
        text: "app-activity-pink app-activity-text",
        border: "app-activity-pink app-activity-border",
    },
    slate: {
        solid: "app-activity-slate app-activity-solid",
        soft: "app-activity-slate app-activity-soft",
        text: "app-activity-slate app-activity-text",
        border: "app-activity-slate app-activity-border",
    },
    stone: {
        solid: "app-activity-stone app-activity-solid",
        soft: "app-activity-stone app-activity-soft",
        text: "app-activity-stone app-activity-text",
        border: "app-activity-stone app-activity-border",
    },
};

export function getColorStyles(color: Color): ColorStyles {
    return COLOR_STYLES[color];
}

export function getColorClass(color: Color): string {
    return getColorStyles(color).solid;
}
