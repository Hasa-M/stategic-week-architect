import { Input } from "../Inputs/ui-input/input";
import { Select } from "../Inputs/ui-select/select";
import { Textarea } from "../Inputs/ui-textarea/textarea";
import { Label } from "../Inputs/ui-label/label";
import CheckboxLabel from "../Inputs/CheckboxLabel/CheckboxLabel";

// no general props accepted here, add them in cases you need it

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
    options: { value: string; label: string }[];
    defaultValue?: string;
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

export default function FormField<T>({
    config,
}: {
    config: FormFieldConfig<T>;
}) {
    return (
        <div className="mt-3">
            {config.label && !(config.type == "checkbox") && (
                <Label htmlFor={config.name}>{config.label}</Label>
            )}
            {(() => {
                switch (config.type) {
                    case "text":
                        return <Input id={config.name} {...config} />;

                    case "select":
                        return <Select {...config} />;

                    case "textarea":
                        return <Textarea id={config.name} {...config} />;

                    case "checkbox": {
                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                        const { type, label, info, name, ...dynamicProps } =
                            config;
                        return (
                            <CheckboxLabel
                                id={name}
                                name={name}
                                label={label}
                                info={info}
                                {...dynamicProps}
                            />
                        );
                    }
                    default:
                        return null;
                }
            })()}
        </div>
    );
}
