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
import type { FormFieldConfig } from "@/components/Forms/FormField";
import FormField from "@/components/Forms/FormField";

type FormModalProps<T> = {
    title: string;
    description: ReactNode;
    fields: FormFieldConfig<T>[];
    children: ReactNode;
    onSubmit: (data: T) => void;
};

export function FormModal<T>({
    title,
    description,
    fields,
    children,
    onSubmit,
}: FormModalProps<T>) {
    function submitHandler(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const data = Object.fromEntries(formData.entries()) as unknown as T;

        onSubmit(data);
    }
    return (
        <Dialog>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="md:max-w-180">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>

                <form onSubmit={submitHandler}>
                    {fields.map((field) => (
                        <div className="mt-3" key={field.name}>
                            <FormField<T> config={field} />
                        </div>
                    ))}
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
                </form>
            </DialogContent>
        </Dialog>
    );
}
