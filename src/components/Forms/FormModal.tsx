import { useState, useCallback } from "react";
import type { ReactNode } from "react";
import { X, Check } from "lucide-react";

import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { FormFieldConfig } from "@/components/Forms/FormField";
import FormField from "@/components/Forms/FormField";

type FormMode = "add" | "edit";

type FormModalProps<T extends object> = {
    title: string;
    description: ReactNode;
    fields: FormFieldConfig<T>[];
    children: ReactNode;
    onSubmit: (data: T) => void;
    mode?: FormMode;
    initialData?: Partial<T>;
    submitLabel?: string;
    cancelLabel?: string;
    closeOnSubmit?: boolean;
    validate?: (data: T) => boolean | string;
};

/**
 * Polymorphic modal form component - dynamically renders form fields
 * based on configuration, supporting add/edit modes.
 */
export function FormModal<T extends object>({
    title,
    description,
    fields,
    children,
    onSubmit,
    mode = "add",
    initialData,
    submitLabel,
    cancelLabel,
    closeOnSubmit = true,
    validate,
}: FormModalProps<T>) {
    const [isOpen, setIsOpen] = useState(false);

    const handleSubmit = useCallback(
        (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();

            const formData = new FormData(event.currentTarget);
            const processedData = fields.reduce<Record<string, unknown>>(
                (accumulator, field) => {
                    if (field.type === "checkbox") {
                        accumulator[field.name] = formData.has(field.name);
                        return accumulator;
                    }

                    const value = formData.get(field.name);

                    if (typeof value === "string") {
                        accumulator[field.name] = value;
                    }

                    return accumulator;
                },
                {}
            );

            const data = processedData as T;

            if (validate) {
                const validationResult = validate(data);
                if (validationResult !== true) {
                    console.error("Validation failed:", validationResult);
                    return;
                }
            }

            onSubmit(data);

            if (closeOnSubmit) {
                setIsOpen(false);
            }
        },
        [fields, onSubmit, validate, closeOnSubmit]
    );

    const getFieldsWithInitialData = useCallback((): FormFieldConfig<T>[] => {
        if (!initialData) return fields;

        return fields.map((field) => {
            const initialValue = initialData[field.name as keyof T];
            if (initialValue === undefined) return field;

            switch (field.type) {
                case "checkbox":
                    return { ...field, defaultChecked: Boolean(initialValue) };
                case "text":
                case "textarea":
                case "select":
                    return { ...field, defaultValue: String(initialValue) };
                default:
                    return field;
            }
        });
    }, [fields, initialData]);

    const effectiveSubmitLabel =
        submitLabel ?? (mode === "edit" ? "Update" : "Save");
    const effectiveCancelLabel = cancelLabel ?? "Cancel";

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>

            <DialogContent className="md:max-w-180">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {getFieldsWithInitialData().map((field) => (
                        <FormField<T> key={field.name} config={field} />
                    ))}

                    <DialogFooter className="pt-4">
                        <DialogClose asChild>
                            <Button type="button" variant="outline">
                                <X />
                                {effectiveCancelLabel}
                            </Button>
                        </DialogClose>

                        <Button type="submit">
                            <Check />
                            {effectiveSubmitLabel}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export type InferFormData<F extends FormFieldConfig<unknown>[]> = {
    [K in F[number]["name"]]: string;
};
