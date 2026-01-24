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

function ColorCircle({ color }: { color: string }) {
    const colorClass = COLOR_MAP[color];
    if (!colorClass) return null;
    return <span className={cn("size-3 rounded-full shrink-0", colorClass)} />;
}

function SelectRoot({
    ...props
}: React.ComponentProps<typeof SelectPrimitive.Root>) {
    return <SelectPrimitive.Root data-slot="select" {...props} />;
}

function SelectGroup({
    ...props
}: React.ComponentProps<typeof SelectPrimitive.Group>) {
    return <SelectPrimitive.Group data-slot="select-group" {...props} />;
}

function SelectValue({
    ...props
}: React.ComponentProps<typeof SelectPrimitive.Value>) {
    return <SelectPrimitive.Value data-slot="select-value" {...props} />;
}

function SelectTrigger({
    className,
    size = "default",
    children,
    ...props
}: React.ComponentProps<typeof SelectPrimitive.Trigger> & {
    size?: "sm" | "default";
}) {
    return (
        <SelectPrimitive.Trigger
            data-slot="select-trigger"
            data-size={size}
            className={cn(
                "flex w-full items-center justify-between gap-2 rounded-md border-2 border-primary bg-white px-3 py-2 text-sm whitespace-nowrap shadow-xs outline-none",
                "data-[size=default]:h-9 data-[size=sm]:h-8",
                "data-placeholder:text-gray-400",
                "focus:border-ring focus:ring-2 focus:ring-primary/50",
                "disabled:cursor-not-allowed disabled:opacity-50",
                "[&>span]:line-clamp-1",
                className,
            )}
            {...props}
        >
            {children}
            <SelectPrimitive.Icon asChild>
                <ChevronDownIcon className="size-4 opacity-50" />
            </SelectPrimitive.Icon>
        </SelectPrimitive.Trigger>
    );
}

function SelectContent({
    className,
    children,
    position = "popper",
    ...props
}: React.ComponentProps<typeof SelectPrimitive.Content>) {
    return (
        <SelectPrimitive.Portal>
            <SelectPrimitive.Content
                data-slot="select-content"
                position={position}
                className={cn(
                    "relative z-50 max-h-72 min-w-[8rem] overflow-hidden rounded-md border-2 border-primary bg-white shadow-lg",
                    "data-[state=open]:animate-in data-[state=closed]:animate-out",
                    "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
                    "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
                    "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
                    position === "popper" &&
                        "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
                    className,
                )}
                {...props}
            >
                <SelectScrollUpButton />
                <SelectPrimitive.Viewport
                    className={cn(
                        "p-1 max-h-60 overflow-y-auto",
                        position === "popper" &&
                            "w-full min-w-[var(--radix-select-trigger-width)]",
                    )}
                >
                    {children}
                </SelectPrimitive.Viewport>
                <SelectScrollDownButton />
            </SelectPrimitive.Content>
        </SelectPrimitive.Portal>
    );
}

function SelectLabel({
    className,
    ...props
}: React.ComponentProps<typeof SelectPrimitive.Label>) {
    return (
        <SelectPrimitive.Label
            data-slot="select-label"
            className={cn("py-1.5 pl-8 pr-2 text-sm font-semibold", className)}
            {...props}
        />
    );
}

function SelectItem({
    className,
    children,
    ...props
}: React.ComponentProps<typeof SelectPrimitive.Item>) {
    return (
        <SelectPrimitive.Item
            data-slot="select-item"
            className={cn(
                "relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none",
                "bg-white",
                "hover:bg-cyan-50",
                "focus:bg-cyan-100",
                "data-[state=checked]:bg-cyan-100 data-[state=checked]:text-cyan-700 data-[state=checked]:font-medium",
                "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
                className,
            )}
            {...props}
        >
            <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
            <span className="absolute right-2 flex h-3.5 w-3.5 items-center justify-center">
                <SelectPrimitive.ItemIndicator>
                    <CheckIcon className="size-4 text-cyan-600" />
                </SelectPrimitive.ItemIndicator>
            </span>
        </SelectPrimitive.Item>
    );
}

function SelectSeparator({
    className,
    ...props
}: React.ComponentProps<typeof SelectPrimitive.Separator>) {
    return (
        <SelectPrimitive.Separator
            data-slot="select-separator"
            className={cn("-mx-1 my-1 h-px bg-gray-200", className)}
            {...props}
        />
    );
}

function SelectScrollUpButton({
    className,
    ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollUpButton>) {
    return (
        <SelectPrimitive.ScrollUpButton
            data-slot="select-scroll-up-button"
            className={cn(
                "flex cursor-default items-center justify-center py-1 bg-white",
                className,
            )}
            {...props}
        >
            <ChevronUpIcon className="size-4" />
        </SelectPrimitive.ScrollUpButton>
    );
}

function SelectScrollDownButton({
    className,
    ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollDownButton>) {
    return (
        <SelectPrimitive.ScrollDownButton
            data-slot="select-scroll-down-button"
            className={cn(
                "flex cursor-default items-center justify-center py-1 bg-white",
                className,
            )}
            {...props}
        >
            <ChevronDownIcon className="size-4" />
        </SelectPrimitive.ScrollDownButton>
    );
}

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
    const [selectedValue, setSelectedValue] = React.useState(
        defaultValue ?? "",
    );

    const handleValueChange = React.useCallback(
        (newValue: string) => {
            setSelectedValue(newValue);
            onValueChange?.(newValue);
        },
        [onValueChange],
    );

    const currentValue = value !== undefined ? value : selectedValue;
    const selectedOption = options.find((opt) => opt.value === currentValue);

    return (
        <>
            <SelectRoot
                value={value}
                defaultValue={defaultValue}
                onValueChange={handleValueChange}
                disabled={disabled}
                required={required}
            >
                <SelectTrigger id={id} className={className}>
                    <SelectValue placeholder={placeholder}>
                        {selectedOption && (
                            <span className="flex items-center gap-2">
                                {showColorIndicator && (
                                    <ColorCircle
                                        color={
                                            selectedOption.color ??
                                            selectedOption.value
                                        }
                                    />
                                )}
                                {selectedOption.label}
                            </span>
                        )}
                    </SelectValue>
                </SelectTrigger>
                <SelectContent>
                    {options.map((option) => (
                        <SelectItem
                            key={option.value}
                            value={option.value}
                            disabled={option.disabled}
                            className={showColorIndicator ? "pl-2" : ""}
                        >
                            <span className="flex items-center gap-2">
                                {showColorIndicator && (
                                    <ColorCircle
                                        color={option.color ?? option.value}
                                    />
                                )}
                                {option.label}
                            </span>
                        </SelectItem>
                    ))}
                </SelectContent>
            </SelectRoot>

            <input
                type="hidden"
                name={name}
                value={currentValue}
                required={required}
            />
        </>
    );
}

export {
    Select,
    SelectRoot,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectScrollDownButton,
    SelectScrollUpButton,
    SelectSeparator,
    SelectTrigger,
    SelectValue,
    ColorCircle,
    COLOR_MAP,
};
