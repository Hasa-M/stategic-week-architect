import { Input } from "../Inputs/ui-input/input";
import { Select } from "../Inputs/ui-select/select";
import { Textarea } from "../Inputs/ui-textarea/textarea";
import { Label } from "../Inputs/ui-label/label";
import CheckboxLabel from "../Inputs/CheckboxLabel/CheckboxLabel";

type BaseFieldConfig<T> = {
    name: keyof T & string;
    label?: string;
    disabled?: boolean;
    required?: boolean;
    className?: string;
};

type TextFieldConfig<T> = BaseFieldConfig<T> & {
    type: "text";
    placeholder?: string;
    defaultValue?: string;
};

type TextareaFieldConfig<T> = BaseFieldConfig<T> & {
    type: "textarea";
    placeholder?: string;
    defaultValue?: string;
    rows?: number;
};

type SelectFieldConfig<T> = BaseFieldConfig<T> & {
    type: "select";
    options: { value: string; label: string; color?: string; disabled?: boolean }[];
    placeholder?: string;
    defaultValue?: string;
    showColorIndicator?: boolean;
};

type CheckboxFieldConfig<T> = Omit<BaseFieldConfig<T>, "label"> & {
    type: "checkbox";
    label: string;
    defaultChecked?: boolean;
    info?: string;
};

export type FormFieldConfig<T> =
    | TextFieldConfig<T>
    | TextareaFieldConfig<T>
    | SelectFieldConfig<T>
    | CheckboxFieldConfig<T>;

/**
 * Polymorphic form field renderer - renders the appropriate input
 * component based on the field configuration type.
 */
export default function FormField<T>({
    config,
}: {
    config: FormFieldConfig<T>;
}) {
    const { name, disabled, required, className } = config;

    const renderLabel = () => {
        if (config.type === "checkbox" || !config.label) return null;
        return (
            <Label htmlFor={name} className="mb-1.5">
                {config.label}
                {required && <span className="text-destructive ml-1">*</span>}
            </Label>
        );
    };

    const renderInput = () => {
        switch (config.type) {
            case "text":
                return (
                    <Input
                        id={name}
                        name={name}
                        type="text"
                        placeholder={config.placeholder}
                        defaultValue={config.defaultValue}
                        disabled={disabled}
                        required={required}
                        className={className}
                    />
                );

            case "textarea":
                return (
                    <Textarea
                        id={name}
                        name={name}
                        placeholder={config.placeholder}
                        defaultValue={config.defaultValue}
                        rows={config.rows}
                        disabled={disabled}
                        required={required}
                        className={className}
                    />
                );

            case "select":
                return (
                    <Select
                        id={name}
                        name={name}
                        options={config.options}
                        placeholder={config.placeholder ?? "Select an option"}
                        defaultValue={config.defaultValue}
                        disabled={disabled}
                        required={required}
                        className={className}
                        showColorIndicator={config.showColorIndicator}
                    />
                );

            case "checkbox":
                return (
                    <CheckboxLabel
                        id={name}
                        name={name}
                        label={config.label}
                        info={config.info}
                        defaultChecked={config.defaultChecked}
                        disabled={disabled}
                        required={required}
                        className={className}
                    />
                );

            default:
                return null;
        }
    };

    return (
        <div className="flex flex-col">
            {renderLabel()}
            {renderInput()}
        </div>
    );
}
