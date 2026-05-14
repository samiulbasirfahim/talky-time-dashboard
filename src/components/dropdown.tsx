import { ChevronDown } from "lucide-react";

type DropdownOption = {
    value: string;
    label: string;
};

type AppDropdownProps = {
    value: string;
    options: DropdownOption[];
    onChange: (value: string) => void;
    className?: string;
    disabled?: boolean;
};

export function AppDropdown({
    value,
    options,
    onChange,
    className = "",
    disabled = false,
}: AppDropdownProps) {
    return (
        <div className="relative">
            <select
                value={value}
                onChange={(event) => onChange(event.target.value)}
                disabled={disabled}
                className={`h-10 w-full appearance-none rounded-lg border border-border bg-tab-bg px-3 pr-8 text-base text-text outline-none focus:border-text-focus focus:bg-white disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            <ChevronDown
                size={16}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-text-muted"
            />
        </div>
    );
}

export type { DropdownOption };
