import { type LucideIcon } from "lucide-react";

type SegmentedTabOption<T extends string> = {
    value: T;
    label: string;
    icon?: LucideIcon;
};

type SegmentedTabBarProps<T extends string> = {
    value: T;
    options: Array<SegmentedTabOption<T>>;
    onChange: (value: T) => void;
    wrapperClassName?: string;
    className?: string;
    tabClassName?: string;
    activeTabClassName?: string;
    inactiveTabClassName?: string;
};

export function SegmentedTabBar<T extends string>({
    value,
    options,
    onChange,
    wrapperClassName = "mx-auto w-full max-w-70",
    className = "",
    tabClassName = "",
    activeTabClassName = "bg-tab-focus-bg",
    inactiveTabClassName = "hover:bg-white/60",
}: SegmentedTabBarProps<T>) {
    return (
        <div className={wrapperClassName}>
            <div className={`flex w-full rounded-lg border border-border bg-tab-bg p-1 ${className}`}>
                {options.map((option) => {
                    const Icon = option.icon;
                    const isActive = value === option.value;

                    return (
                        <button
                            key={option.value}
                            type="button"
                            onClick={() => onChange(option.value)}
                            className={`flex flex-1 items-center justify-center gap-2 rounded-md px-4 py-1.5 text-base font-semibold text-text-secondary transition ${isActive ? activeTabClassName : inactiveTabClassName} ${tabClassName}`}
                            aria-pressed={isActive}
                        >
                            {Icon && <Icon size={16} />}
                            <span>{option.label}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

export type { SegmentedTabOption };
