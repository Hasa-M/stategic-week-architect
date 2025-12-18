import { Checkbox } from "./ui-checkbox/checkbox";
import { Label } from "../ui-label/label";
import type { CheckboxProps } from "@radix-ui/react-checkbox";

interface CheckboxLabelProps extends CheckboxProps {
    label: string;
    info?: string;
}

export default function CheckboxLabel({
    id,
    name,
    label,
    info,
    ...props
}: CheckboxLabelProps) {
    return (
        <div className="flex items-start gap-3">
            <Checkbox id={id} name={name} {...props} />
            <div className="grid gap-2">
                <Label htmlFor={id}>{label}</Label>
                {info && (
                    <p className="text-muted-foreground text-sm">{info}</p>
                )}
            </div>
        </div>
    );
}
