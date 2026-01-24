import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { CheckIcon } from "lucide-react";

import { cn } from "@/lib/utils";

function Checkbox({
    className,
    name,
    value,
    required,
    checked,
    defaultChecked,
    onCheckedChange,
    ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
    const [isChecked, setIsChecked] = React.useState<boolean>(() => {
        if (defaultChecked === "indeterminate") return false;
        if (typeof defaultChecked === "boolean") return defaultChecked;
        if (checked === true) return true;
        return false;
    });

    const handleCheckedChange = React.useCallback(
        (val: boolean | "indeterminate") => {
            const boolValue = val === true;
            setIsChecked(boolValue);
            onCheckedChange?.(val);
        },
        [onCheckedChange],
    );

    return (
        <>
            <CheckboxPrimitive.Root
                data-slot="checkbox"
                className={cn(
                    "peer size-5 shrink-0 rounded-[4px] border-2 border-primary shadow-xs outline-none dark:bg-input/30",
                    "data-[state=checked]:bg-primary data-[state=checked]:text-white data-[state=checked]:border-primary",
                    "bg-white",
                    "focus-visible:border-ring focus-visible:ring-primary/50 focus-visible:ring-2",
                    "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
                    "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
                    className,
                )}
                checked={checked}
                defaultChecked={defaultChecked}
                onCheckedChange={handleCheckedChange}
                {...props}
            >
                <CheckboxPrimitive.Indicator
                    data-slot="checkbox-indicator"
                    className="grid place-content-center text-current"
                >
                    <CheckIcon className="size-4" strokeWidth={3} />
                </CheckboxPrimitive.Indicator>
            </CheckboxPrimitive.Root>

            {name && (
                <input
                    type="checkbox"
                    name={name}
                    value={value?.toString() ?? "on"}
                    checked={isChecked}
                    required={required}
                    onChange={() => {}}
                    style={{ display: "none" }}
                    tabIndex={-1}
                    aria-hidden="true"
                />
            )}
        </>
    );
}

export { Checkbox };
