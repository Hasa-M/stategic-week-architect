import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/Modals/Modal/ui/dialog";
import { WeeklyAppButton } from "@/components/Button/Button";
import type { ReactNode } from "react";
import { X, Check } from "lucide-react";

export function FormModal({
    title,
    description,
    usedForm,
    children,
}: {
    title: string;
    description: ReactNode;
    usedForm: ReactNode;
    children: ReactNode;
}) {
    return (
        <Dialog>
            <form>
                <DialogTrigger asChild>{children}</DialogTrigger>
                <DialogContent className="md:max-w-180">
                    <DialogHeader>
                        <DialogTitle>{title}</DialogTitle>
                        <DialogDescription>{description}</DialogDescription>
                    </DialogHeader>
                    {usedForm}
                    <DialogFooter>
                        <DialogClose asChild>
                            <WeeklyAppButton variant="outline">
                                <X />
                                Cancel
                            </WeeklyAppButton>
                        </DialogClose>
                        <WeeklyAppButton type="submit">
                            <Check />
                            Save
                        </WeeklyAppButton>
                    </DialogFooter>
                </DialogContent>
            </form>
        </Dialog>
    );
}
