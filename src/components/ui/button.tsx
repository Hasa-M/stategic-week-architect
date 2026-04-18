import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
    [
        "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all",
        "disabled:pointer-events-none disabled:opacity-50",
        "[&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0",
        "outline-none focus-visible:ring-[4px] focus-visible:ring-primary/15",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
    ],
    {
        variants: {
            variant: {
                default:
                    "bg-primary text-on-primary text-base shadow-[0_14px_28px_rgba(8,145,178,0.22)] hover:-translate-y-0.5 hover:bg-primary-hover hover:shadow-[0_18px_36px_rgba(8,145,178,0.26)]",
                outline:
                    "border border-primary/15 bg-white/82 text-base text-slate-700 shadow-[0_10px_24px_rgba(15,23,42,0.06)] hover:-translate-y-0.5 hover:border-primary/25 hover:bg-white",
                ghost: "bg-white/60 font-semibold text-base text-slate-600 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] hover:bg-white/80 hover:text-primary",
                destructive:
                    "bg-destructive text-base text-on-primary shadow-[0_14px_28px_rgba(220,38,38,0.18)] hover:-translate-y-0.5 hover:opacity-95 hover:shadow-[0_18px_34px_rgba(220,38,38,0.22)]",
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