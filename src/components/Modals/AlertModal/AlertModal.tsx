import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { buttonVariants } from "@/components/ui/button";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type AlertModalProps = {
    title: string;
    description: ReactNode;
    children: ReactNode;
    onConfirm: () => void;
    confirmLabel?: string;
    cancelLabel?: string;
    variant?: "default" | "destructive";
};

export function AlertModal({
    title,
    description,
    children,
    onConfirm,
    confirmLabel = "Continue",
    cancelLabel = "Cancel",
    variant = "default",
}: AlertModalProps) {
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {description}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>{cancelLabel}</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={onConfirm}
                        className={cn(
                            variant === "destructive" &&
                                buttonVariants({ variant: "destructive" })
                        )}
                    >
                        {confirmLabel}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
