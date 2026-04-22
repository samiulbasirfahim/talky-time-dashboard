import React, { useCallback, useRef } from "react";
import { AnimatePresence, motion, type Transition, type Variants } from "framer-motion";
import { AppText } from "./text";

export interface LargeSearchableDropdownOption {
    value: string;
    label: string;
    subtitle?: string;
    keywords?: string[];
}

interface LargeSearchableDropdownProps {
    label: string;
    value: string;
    options: LargeSearchableDropdownOption[];
    onChange: (value: string) => void;
    onSearchChange?: (query: string) => void;
    placeholder?: string;
    emptyText?: string;
    className?: string;
}

const easeSpring: Transition = {
    duration: 0.2,
    ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
};

const dropdownVariants: Variants = {
    hidden: { opacity: 0, y: -6, scale: 0.98 },
    visible: { opacity: 1, y: 0, scale: 1, transition: easeSpring },
    exit: { opacity: 0, y: -4, scale: 0.98, transition: { duration: 0.15 } },
};

const itemVariants: Variants = {
    hidden: { opacity: 0, x: -5 },
    visible: (i: number) => ({
        opacity: 1,
        x: 0,
        transition: { delay: i * 0.02, duration: 0.18 },
    }),
};

const ChevronIcon = ({ open }: { open: boolean }) => (
    <motion.svg
        animate={{ rotate: open ? 180 : 0 }}
        className="text-text-secondary"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
    >
        <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </motion.svg>
);

export function LargeSearchableDropdown({
    label,
    value,
    options,
    onChange,
    onSearchChange,
    placeholder = "Search...",
    emptyText = "No results found.",
    className = "",
}: LargeSearchableDropdownProps) {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const [open, setOpen] = React.useState(false);
    const [query, setQuery] = React.useState("");
    const [isFocused, setIsFocused] = React.useState(false);

    const selectedOption = options.find((o) => o.value === value);

    // Sync query with selected label when closed
    React.useEffect(() => {
        if (!open) setQuery(selectedOption?.label ?? "");
    }, [selectedOption, open]);

    const closeDropdown = useCallback(() => {
        setOpen(false);
        setIsFocused(false);
        setQuery(selectedOption?.label ?? "");
    }, [selectedOption]);

    // Handle clicking outside the component
    React.useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (!wrapperRef.current?.contains(e.target as Node)) closeDropdown();
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [closeDropdown]);

    const filteredOptions = options.filter((option) => {
        if (!query.trim() || query === selectedOption?.label) return true;
        const needle = query.toLowerCase();
        return [option.label, option.subtitle ?? ""].some(s => s.toLowerCase().includes(needle));
    });

    const handleSelect = (option: LargeSearchableDropdownOption) => {
        onChange(option.value);
        setQuery(option.label);
        setOpen(false);
        setIsFocused(false);
    };

    return (
        <div ref={wrapperRef} className={`relative space-y-2 ${className}`}>
            {/* The Trigger Card */}
            <div
                onClick={() => {
                    setOpen(true);
                    inputRef.current?.focus();
                }}
                className={`
                    relative flex h-18 w-full cursor-pointer flex-col justify-center rounded-2xl border transition-all px-4 py-3
                    ${isFocused 
                        ? "bg-bg-primary border-btn-primary" 
                        : "border-border bg-bg-secondary hover:border-text-muted"}
                `}
            >
                <div className="flex items-center justify-between">
                    <div className="min-w-0 flex-1">
                        <input
                            ref={inputRef}
                            type="text"
                            aria-label={label}
                            value={query}
                            placeholder={placeholder}
                            onFocus={() => {
                                setIsFocused(true);
                                setOpen(true);
                                if (query === selectedOption?.label) setQuery("");
                            }}
                            onChange={(e) => {
                                setQuery(e.target.value);
                                onSearchChange?.(e.target.value);
                            }}
                            onKeyDown={(e) => {
                                if (e.key === "Escape") closeDropdown();
                                if (e.key === "Enter" && filteredOptions.length > 0) handleSelect(filteredOptions[0]);
                            }}
                            className="block w-full border-none bg-transparent p-0 text-base font-semibold text-text outline-none placeholder:text-text-muted/50"
                        />
                        {!open && selectedOption?.subtitle && (
                            <AppText variant="description" className="truncate text-xs text-text-muted">
                                {selectedOption.subtitle}
                            </AppText>
                        )}
                    </div>

                    <div className="ml-4 shrink-0">
                        <ChevronIcon open={open} />
                    </div>
                </div>
            </div>

            {/* Dropdown Menu */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        variants={dropdownVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="absolute left-0 right-0 z-50 mt-2 max-h-80 overflow-y-auto rounded-2xl border border-border bg-bg p-2 shadow-2xl"
                    >
                        {filteredOptions.length === 0 ? (
                            <div className="p-8 text-center">
                                <AppText variant="description">
                                    {emptyText}
                                </AppText>
                            </div>
                        ) : (
                            filteredOptions.map((option, i) => (
                                <motion.button
                                    key={option.value}
                                    custom={i}
                                    variants={itemVariants}
                                    onClick={() => handleSelect(option)}
                                    className={`
                                        group flex w-full flex-col rounded-xl px-4 py-3 text-left transition-all
                                        ${option.value === value ? "bg-primary/10" : "hover:bg-bg-secondary"}
                                    `}
                                >
                                    <AppText variant="description" className={`text-sm font-bold ${option.value === value ? "text-primary" : "text-text"}`}>
                                        {option.label}
                                    </AppText>
                                    {option.subtitle && (
                                        <AppText variant="description">
                                            {option.subtitle}
                                        </AppText>
                                    )}
                                </motion.button>
                            ))
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}