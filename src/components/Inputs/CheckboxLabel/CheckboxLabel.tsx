import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
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
    className,
    ...props
}: CheckboxLabelProps) {
    return (
        <div className={info ? "flex items-start gap-3" : "flex items-center gap-3"}>
            <Checkbox id={id} name={name} className={className} {...props} />
            <div className="grid gap-1">
                <Label htmlFor={id}>{label}</Label>
                {info && (
                    <p className="text-muted-foreground text-sm">{info}</p>
                )}
            </div>
        </div>
    );
}
