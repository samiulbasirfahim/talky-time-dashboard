import { type LucideIcon } from "lucide-react";
import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "focus" | "outline" | "ghost" | "danger" | "link" | "bg";
    size?: "sm" | "md" | "lg"; // Added size prop
    fullWidth?: boolean;
    prefixIcon?: LucideIcon;
    suffixIcon?: LucideIcon;
    iconColor?: string;
    iconBg?: string;
    isLoading?: boolean;
    loadingLabel?: string;
}

const LoadingSpinner = ({ size }: { size: "sm" | "md" | "lg" }) => {
    const spinnerSizes: Record<"sm" | "md" | "lg", string> = {
        sm: "h-3 w-3",
        md: "h-4 w-4",
        lg: "h-5 w-5",
    };

    return (
        <span
            className={`inline-block animate-spin rounded-full border-2 border-current border-t-transparent ${spinnerSizes[size]}`}
            aria-hidden="true"
        />
    );
};

export const AppButton = ({
    children,
    variant = "focus",
    size = "md", // Default to medium
    fullWidth = false,
    prefixIcon: Prefix,
    suffixIcon: Suffix,
    iconColor,
    iconBg,
    isLoading = false,
    loadingLabel,
    className = "",
    disabled,
    ...props
}: ButtonProps) => {
    // Base alignment and transition styles
    const baseStyles =
        "inline-flex items-center justify-center rounded-md font-medium transition-all focus:outline-none disabled:opacity-50 cursor-pointer";

    // Mapping to your @theme variables
    const variants = {
        focus: "border border-btn-primary bg-btn-primary text-btn-primary-text hover:opacity-70",
        outline:
            "border border-border bg-transparent text-text-secondary hover:bg-bg-focus hover:text-text-focus hover:border-text-focus",
        ghost: "bg-transparent text-text-secondary hover:text-text-focus",
        danger:
            "bg-bg-danger text-text-danger hover:brightness-95 border border-transparent hover:border-text-danger/20",
        link: "bg-transparent border border-transparent text-text-focus hover:opacity-70",
        bg: "text-text bg-bg-secondary border border-transparent",
    };

    // Size mapping for button padding and text
    const sizes = {
        sm: "px-3 py-1.5 text-xs",
        md: "px-4 py-2 text-sm",
        lg: "px-6 py-3 text-base",
    };

    // Size mapping for Lucide icons
    const iconSizes = {
        sm: 14,
        md: 18,
        lg: 22,
    };

    const iconStyle: React.CSSProperties = {
        color: iconColor,
        backgroundColor: iconBg,
        padding: iconBg ? "4px" : "0",
        borderRadius: iconBg ? "4px" : "2px",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${fullWidth ? "w-full" : ""} ${className}`}
            disabled={disabled || isLoading}
            {...props}
        >
            {!isLoading && Prefix && (
                <Prefix
                    size={iconSizes[size]}
                    className={children ? "mr-2" : ""}
                    style={iconStyle}
                />
            )}

            {isLoading && (
                <span className="mr-2 inline-flex">
                    <LoadingSpinner size={size} />
                </span>
            )}

            {(children || isLoading) && <span>{isLoading ? (loadingLabel ?? children) : children}</span>}

            {!isLoading && Suffix && (
                <Suffix
                    size={iconSizes[size]}
                    className={children ? "ml-2" : ""}
                    style={iconStyle}
                />
            )}
        </button>
    );
};
