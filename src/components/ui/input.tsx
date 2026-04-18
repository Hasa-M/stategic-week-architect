import * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
    return (
        <input
            type={type}
            data-slot="input"
            className={cn(
                "app-input-surface h-10 w-full min-w-0 rounded-2xl border px-3.5 py-2 text-base backdrop-blur-sm transition-[border-color,box-shadow,background-color] outline-none md:text-sm",
                "file:text-foreground file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium",
                "focus-visible:ring-4 focus-visible:ring-[color:var(--app-focus-ring)]",
                "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
                "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
                className
            )}
            {...props}
        />
    );
}

export { Input };