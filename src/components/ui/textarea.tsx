import * as React from "react";

import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
    return (
        <textarea
            data-slot="textarea"
            className={cn(
                "w-full min-w-0 rounded-2xl border border-primary/15 bg-white/86 px-3.5 py-2.5 text-base text-slate-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.96),0_10px_26px_rgba(15,23,42,0.05)] backdrop-blur-sm transition-[border-color,box-shadow,background-color] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
                "placeholder:text-slate-400",
                "field-sizing-content min-h-16 resize-none",
                "focus-visible:border-primary/35 focus-visible:bg-white focus-visible:ring-4 focus-visible:ring-primary/12",
                "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
                className
            )}
            {...props}
        />
    );
}

export { Textarea };