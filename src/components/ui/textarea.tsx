import * as React from "react";

import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
    return (
        <textarea
            data-slot="textarea"
            className={cn(
                "app-input-surface w-full min-w-0 rounded-2xl border px-3.5 py-2.5 text-base backdrop-blur-sm transition-[border-color,box-shadow,background-color] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
                "field-sizing-content min-h-16 resize-none",
                "focus-visible:ring-4 focus-visible:ring-[color:var(--app-focus-ring)]",
                "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
                className
            )}
            {...props}
        />
    );
}

export { Textarea };