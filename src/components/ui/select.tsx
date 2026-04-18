import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react";

import { cn } from "@/lib/utils";

const COLOR_MAP: Record<string, string> = {
    red: "bg-red-500",
    amber: "bg-amber-500",
    lime: "bg-lime-500",
    emerald: "bg-emerald-500",
    cyan: "bg-cyan-500",
    blue: "bg-blue-500",
    violet: "bg-violet-500",
    fuchsia: "bg-fuchsia-500",
    pink: "bg-pink-500",
    slate: "bg-slate-500",
    stone: "bg-stone-500",
};

type SelectOption = {
    value: string;
    label: string;
    color?: string;
    disabled?: boolean;
};

type SelectProps = {
    name: string;
    options: SelectOption[];
    placeholder?: string;
    defaultValue?: string;
    value?: string;
    onValueChange?: (value: string) => void;
    required?: boolean;
    disabled?: boolean;
    className?: string;
    id?: string;
    showColorIndicator?: boolean;
};

function ColorCircle({ color }: { color: string }) {
    const colorClass = COLOR_MAP[color];

    if (!colorClass) {
        return null;
    }

    return <span className={cn("size-3 shrink-0 rounded-full", colorClass)} />;
}

function Select({
    name,
    options,
    placeholder = "Select an option",
    defaultValue,
    value,
    onValueChange,
    required,
    disabled,
    className,
    id,
    showColorIndicator = false,
}: SelectProps) {
    const [internalValue, setInternalValue] = React.useState(defaultValue ?? "");

    const handleValueChange = React.useCallback(
        (newValue: string) => {
            setInternalValue(newValue);
            onValueChange?.(newValue);
        },
        [onValueChange]
    );

    const currentValue = value ?? internalValue;
    const selectedOption = options.find((option) => option.value === currentValue);

    return (
        <>
            <SelectPrimitive.Root
                value={value}
                defaultValue={defaultValue}
                onValueChange={handleValueChange}
                disabled={disabled}
                required={required}
            >
                <SelectPrimitive.Trigger
                    id={id}
                    data-slot="select-trigger"
                    className={cn(
                        "flex h-10 w-full items-center justify-between gap-2 rounded-2xl border border-primary/15 bg-white/86 px-3.5 py-2 text-sm text-slate-700 whitespace-nowrap shadow-[inset_0_1px_0_rgba(255,255,255,0.96),0_10px_26px_rgba(15,23,42,0.05)] backdrop-blur-sm outline-none",
                        "data-placeholder:text-slate-400",
                        "focus:border-primary/35 focus:bg-white focus:ring-4 focus:ring-primary/12",
                        "disabled:cursor-not-allowed disabled:opacity-50",
                        "[&>span]:line-clamp-1",
                        className
                    )}
                >
                    <SelectPrimitive.Value placeholder={placeholder}>
                        {selectedOption && (
                            <span className="flex items-center gap-2">
                                {showColorIndicator && (
                                    <ColorCircle
                                        color={selectedOption.color ?? selectedOption.value}
                                    />
                                )}
                                {selectedOption.label}
                            </span>
                        )}
                    </SelectPrimitive.Value>
                    <SelectPrimitive.Icon asChild>
                        <ChevronDownIcon className="size-4 opacity-50" />
                    </SelectPrimitive.Icon>
                </SelectPrimitive.Trigger>

                <SelectPrimitive.Portal>
                    <SelectPrimitive.Content
                        data-slot="select-content"
                        position="popper"
                        className={cn(
                            "relative z-50 max-h-72 min-w-36 overflow-hidden rounded-3xl border border-white/80 bg-linear-to-b from-white/95 via-white/90 to-sky-50/75 shadow-[0_22px_60px_rgba(15,23,42,0.16)] backdrop-blur-xl",
                            "data-[state=open]:animate-in data-[state=closed]:animate-out",
                            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
                            "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
                            "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1"
                        )}
                    >
                        <SelectPrimitive.ScrollUpButton className="flex cursor-default items-center justify-center bg-transparent py-1 text-slate-400">
                            <ChevronUpIcon className="size-4" />
                        </SelectPrimitive.ScrollUpButton>
                        <SelectPrimitive.Viewport className="app-scrollbar max-h-60 w-full min-w-(--radix-select-trigger-width) overflow-y-auto p-1.5">
                            {options.map((option) => (
                                <SelectPrimitive.Item
                                    key={option.value}
                                    value={option.value}
                                    disabled={option.disabled}
                                    className={cn(
                                        "relative flex w-full cursor-pointer select-none items-center rounded-2xl py-2 pl-3 pr-8 text-sm text-slate-600 outline-none transition-colors",
                                        "bg-transparent",
                                        "hover:bg-sky-50/85",
                                        "focus:bg-sky-50/85",
                                        "data-[state=checked]:bg-sky-100/90 data-[state=checked]:text-primary data-[state=checked]:font-medium",
                                        "data-disabled:pointer-events-none data-disabled:opacity-50"
                                    )}
                                >
                                    <SelectPrimitive.ItemText>
                                        <span className="flex items-center gap-2">
                                            {showColorIndicator && (
                                                <ColorCircle
                                                    color={option.color ?? option.value}
                                                />
                                            )}
                                            {option.label}
                                        </span>
                                    </SelectPrimitive.ItemText>
                                    <span className="absolute right-2 flex h-3.5 w-3.5 items-center justify-center">
                                        <SelectPrimitive.ItemIndicator>
                                            <CheckIcon className="size-4 text-primary" />
                                        </SelectPrimitive.ItemIndicator>
                                    </span>
                                </SelectPrimitive.Item>
                            ))}
                        </SelectPrimitive.Viewport>
                        <SelectPrimitive.ScrollDownButton className="flex cursor-default items-center justify-center bg-transparent py-1 text-slate-400">
                            <ChevronDownIcon className="size-4" />
                        </SelectPrimitive.ScrollDownButton>
                    </SelectPrimitive.Content>
                </SelectPrimitive.Portal>
            </SelectPrimitive.Root>

            <input type="hidden" name={name} value={currentValue} required={required} />
        </>
    );
}

export { Select, type SelectOption };