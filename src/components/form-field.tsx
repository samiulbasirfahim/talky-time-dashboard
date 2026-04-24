import React from "react";
import { AppDropdown, type DropdownOption } from "./dropdown";
import { AppText } from "./text";

type BaseFieldProps = {
    label?: string;
    description?: string;
    containerClassName?: string;
    labelClassName?: string;
    descriptionClassName?: string;
};

type AppInputFieldProps = BaseFieldProps &
    Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "prefix" | "suffix"> & {
        value: string | number;
        onChange?: (value: string) => void;
        fullWidth?: boolean;
        inputClassName?: string;
        inputWrapperClassName?: string;
        prefix?: React.ReactNode;
        suffix?: React.ReactNode;
    };

export function AppInputField({
    label,
    description,
    containerClassName = "",
    labelClassName = "",
    descriptionClassName = "",
    value,
    onChange,
    type = "text",
    fullWidth = true,
    inputClassName = "",
    inputWrapperClassName = "",
    prefix,
    suffix,
    ...props
}: AppInputFieldProps) {
    return (
        <div className={`space-y-2 ${containerClassName}`}>
            <AppText variant="description" className={`font-semibold text-text ${labelClassName}`}>
                {label}
            </AppText>

            <div className={`relative flex items-center gap-2 ${inputWrapperClassName}`}>
                {prefix}
                <input
                    type={type}
                    value={value}
                    onChange={(event) => onChange?.(event.target.value)}
                    className={`h-10 ${fullWidth ? "w-full" : "w-auto"} rounded-lg border border-border bg-tab-bg px-3 text-base text-text-secondary outline-none focus:border-text-focus focus:bg-white ${inputClassName}`}
                    {...props}
                />
                {suffix}
            </div>

            {description && (
                <AppText variant="description" className={`text-xs text-text-muted ${descriptionClassName}`}>
                    {description}
                </AppText>
            )}
        </div>
    );
}

type AppDropdownFieldProps = BaseFieldProps & {
    value: string;
    options: DropdownOption[];
    onChange: (value: string) => void;
    dropdownClassName?: string;
};

export function AppDropdownField({
    label,
    description,
    containerClassName = "",
    labelClassName = "",
    descriptionClassName = "",
    value,
    options,
    onChange,
    dropdownClassName = "",
}: AppDropdownFieldProps) {
    return (
        <div className={`space-y-2 ${containerClassName}`}>
            <AppText variant="description" className={`font-semibold text-text ${labelClassName}`}>
                {label}
            </AppText>

            <AppDropdown
                value={value}
                options={options}
                onChange={onChange}
                className={`text-text-secondary ${dropdownClassName}`}
            />

            {description && (
                <AppText variant="description" className={`text-xs text-text-muted ${descriptionClassName}`}>
                    {description}
                </AppText>
            )}
        </div>
    );
}
