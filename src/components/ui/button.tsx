import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
    [
        "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all",
        "disabled:pointer-events-none disabled:opacity-50",
        "[&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0",
        "outline-none focus-visible:ring-[4px] focus-visible:ring-[color:var(--app-focus-ring)]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
    ],
    {
        variants: {
            variant: {
                default:
                    "bg-primary text-on-primary text-base shadow-[var(--app-shadow-button-primary)] hover:-translate-y-0.5 hover:bg-primary-hover hover:shadow-[var(--app-shadow-button-primary-hover)]",
                outline:
                    "border border-[color:var(--app-border-subtle)] bg-[color:var(--app-button-outline-bg)] text-base text-[color:var(--app-text)] shadow-[var(--app-shadow-button-outline)] hover:-translate-y-0.5 hover:border-[color:var(--app-border-strong)] hover:bg-[color:var(--app-button-outline-bg-hover)]",
                ghost: "bg-[color:var(--app-button-ghost-bg)] font-semibold text-base text-[color:var(--app-text-soft)] shadow-[var(--app-shadow-button-ghost)] hover:bg-[color:var(--app-button-ghost-bg-hover)] hover:text-primary",
                destructive:
                    "bg-destructive text-base text-on-primary shadow-[var(--app-shadow-button-destructive)] hover:-translate-y-0.5 hover:opacity-95 hover:shadow-[var(--app-shadow-button-destructive-hover)]",
            },
            size: {
                default: "h-10 rounded-full px-4 py-2 has-[>svg]:px-3",
                sm: "h-9 rounded-full gap-1.5 px-3.5 has-[>svg]:px-3",
                lg: "h-11 rounded-full px-6 has-[>svg]:px-6",
                icon: "size-10 rounded-full",
                "icon-sm": "size-9 rounded-full",
                "icon-lg": "size-11 rounded-full",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
);

type ButtonProps = React.ComponentProps<"button"> &
    VariantProps<typeof buttonVariants> & {
        asChild?: boolean;
    };

function Button({
    className,
    variant,
    size,
    asChild = false,
    ...props
}: ButtonProps) {
    const Comp = asChild ? Slot : "button";

    return (
        <Comp
            data-slot="button"
            className={cn(buttonVariants({ variant, size, className }))}
            {...props}
        />
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export { Button, buttonVariants };