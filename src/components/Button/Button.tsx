import { Button } from "@/components/Button/ui/button";
import type { ReactNode, ComponentPropsWithoutRef } from "react";

type WeeklyAppButtonProps = {
    variant?: "default" | "outline" | "ghost";
    children: ReactNode;
} & ComponentPropsWithoutRef<typeof Button>;

export function WeeklyAppButton({
    variant = "default",
    children,
    ...props
}: WeeklyAppButtonProps) {
    return (
        <Button variant={variant} {...props}>
            {children}
        </Button>
    );
}
