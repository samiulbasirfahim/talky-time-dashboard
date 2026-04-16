import React from "react";
import { AppText } from "./text";

export interface SearchableDropdownOption {
    value: string;
    label: string;
    subtitle?: string;
    keywords?: string[];
}

interface SearchableDropdownProps {
    label: string;
    value: string;
    options: SearchableDropdownOption[];
    onChange: (value: string) => void;
    placeholder?: string;
    maxResults?: number;
    emptyText?: string;
    className?: string;
}

export function SearchableDropdown({
    label,
    value,
    options,
    onChange,
    placeholder = "Search...",
    maxResults = 5,
    emptyText = "No results found.",
    className = "",
}: SearchableDropdownProps) {
    const wrapperRef = React.useRef<HTMLDivElement>(null);
    const [open, setOpen] = React.useState(false);
    const [query, setQuery] = React.useState("");

    const selectedOption = options.find((option) => option.value === value);

    React.useEffect(() => {
        setQuery(selectedOption?.label ?? "");
    }, [selectedOption]);

    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (!wrapperRef.current?.contains(event.target as Node)) {
                setOpen(false);
                setQuery(selectedOption?.label ?? "");
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [selectedOption]);

    const filteredOptions = options
        .filter((option) => {
            if (!query.trim()) return true;
            const needle = query.toLowerCase();
            const haystack = [
                option.label,
                option.value,
                option.subtitle ?? "",
                ...(option.keywords ?? []),
            ]
                .join(" ")
                .toLowerCase();

            return haystack.includes(needle);
        })
        .slice(0, maxResults);

    const handleSelect = (option: SearchableDropdownOption) => {
        onChange(option.value);
        setQuery(option.label);
        setOpen(false);
    };

    return (
        <div className={`space-y-2 ${className}`} ref={wrapperRef}>
            <AppText variant="description" className="font-semibold text-text">
                {label}
            </AppText>

            <div className="relative">
                <input
                    type="text"
                    value={query}
                    onFocus={() => setOpen(true)}
                    onChange={(event) => {
                        setQuery(event.target.value);
                        setOpen(true);
                    }}
                    placeholder={placeholder}
                    className="h-10 w-full rounded-lg border border-border bg-tab-bg px-3 text-base text-text-secondary outline-none focus:border-text-focus focus:bg-white"
                />

                {open && (
                    <div className="absolute left-0 right-0 z-30 mt-1 overflow-hidden rounded-lg border border-border bg-bg shadow-lg">
                        {filteredOptions.length === 0 ? (
                            <div className="px-3 py-2 text-sm text-text-muted">{emptyText}</div>
                        ) : (
                            filteredOptions.map((option) => (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => handleSelect(option)}
                                    className="flex w-full items-center justify-between gap-3 px-3 py-2 text-left transition-colors hover:bg-bg-secondary"
                                >
                                    <div>
                                        <AppText variant="body" className="text-sm font-medium">
                                            {option.label}
                                        </AppText>
                                        {option.subtitle && (
                                            <AppText variant="description" className="text-xs">
                                                {option.subtitle}
                                            </AppText>
                                        )}
                                    </div>
                                    <AppText variant="description" className="text-xs">
                                        {option.value}
                                    </AppText>
                                </button>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
