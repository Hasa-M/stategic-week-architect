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
} from "@/components/Modals/AlertModal/ui/alert-dialog";
import type { ReactNode } from "react";

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
                        className={
                            variant === "destructive"
                                ? "bg-red-600 text-white hover:bg-red-700"
                                : ""
                        }
                    >
                        {confirmLabel}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
