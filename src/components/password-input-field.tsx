import React from "react";
import { Eye, EyeOff } from "lucide-react";
import { AppInputField } from "./form-field";

type AppPasswordFieldProps = Omit<React.ComponentProps<typeof AppInputField>, "type" | "suffix"> & {
    toggleAriaLabel?: string;
};

export function AppPasswordField({
    inputClassName = "",
    toggleAriaLabel = "Toggle password visibility",
    ...props
}: AppPasswordFieldProps) {
    const [isPasswordVisible, setIsPasswordVisible] = React.useState(false);

    return (
        <AppInputField
            {...props}
            type={isPasswordVisible ? "text" : "password"}
            inputClassName={`pr-11 ${inputClassName}`.trim()}
            suffix={
                <button
                    type="button"
                    onClick={() => setIsPasswordVisible((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted"
                    aria-label={toggleAriaLabel}
                >
                    {isPasswordVisible ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
            }
        />
    );
}