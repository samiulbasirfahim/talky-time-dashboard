import React, { useRef, useCallback } from "react";
import { motion, AnimatePresence, type Variants, type Transition } from "framer-motion";
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
    onSearchChange?: (query: string) => void;
    placeholder?: string;
    maxResults?: number;
    emptyText?: string;
    className?: string;
    description?: string;
    descriptionClassName?: string;
}

// ── animation variants ──────────────────────────────────────────────────────

const easeSpring: Transition = {
    duration: 0.2,
    ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
};

const dropdownVariants: Variants = {
    hidden: {
        opacity: 0,
        y: -6,
        scale: 0.97,
        transition: { duration: 0.15, ease: "easeIn" } as Transition,
    },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: easeSpring,
    },
    exit: {
        opacity: 0,
        y: -4,
        scale: 0.97,
        transition: { duration: 0.15, ease: "easeIn" } as Transition,
    },
};

// Function-based variants must be typed explicitly so TS accepts the resolver signature
const itemVariants: Variants = {
    hidden: { opacity: 0, x: -6 },
    visible: (i: number) => ({
        opacity: 1,
        x: 0,
        transition: {
            delay: i * 0.03,
            duration: 0.18,
            ease: "easeOut",
        } as Transition,
    }),
};

const emptyVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.2 } },
};

// ── icons ───────────────────────────────────────────────────────────────────

const SearchIcon = () => (
    <svg
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
        width="15"
        height="15"
        viewBox="0 0 15 15"
        fill="none"
    >
        <circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.4" />
        <line x1="10.5" y1="10.5" x2="14" y2="14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
);

const ChevronIcon = ({ open }: { open: boolean }) => (
    <motion.svg
        animate={{ rotate: open ? 180 : 0 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-text-muted"
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
    >
        <path d="M2.5 5L7 9.5L11.5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </motion.svg>
);

const ClearIcon = () => (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
        <line x1="1" y1="1" x2="11" y2="11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="11" y1="1" x2="1" y2="11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
);

const CheckIcon = () => (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
        <path d="M2 6.5L5.5 10L11 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

// ── component ────────────────────────────────────────────────────────────────

export function SearchableDropdown({
    label,
    value,
    options,
    onChange,
    onSearchChange,
    placeholder = "Search...",
    emptyText = "No results found.",
    className = "",
    description,
    descriptionClassName,
}: SearchableDropdownProps) {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const blurTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const [open, setOpen] = React.useState(false);
    const [query, setQuery] = React.useState("");
    const [isFocused, setIsFocused] = React.useState(false);

    const selectedOption = options.find((o) => o.value === value);

    // Sync query with selected option when value changes externally
    React.useEffect(() => {
        if (!open) setQuery(selectedOption?.label ?? "");
    }, [selectedOption, open]);

    // Close on outside click
    React.useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (!wrapperRef.current?.contains(e.target as Node)) {
                closeDropdown();
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [selectedOption]);

    const closeDropdown = useCallback(() => {
        setOpen(false);
        setIsFocused(false);
        setQuery(selectedOption?.label ?? "");
    }, [selectedOption]);

    const filteredOptions = options.filter((option) => {
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
    });

    const handleSelect = (option: SearchableDropdownOption) => {
        if (blurTimeoutRef.current) clearTimeout(blurTimeoutRef.current);
        onChange(option.value);
        setQuery(option.label);
        setOpen(false);
        setIsFocused(false);
    };

    const handleClear = (e: React.MouseEvent) => {
        e.stopPropagation();
        onChange("");
        setQuery("");
        onSearchChange?.("");
        inputRef.current?.focus();
        setOpen(true);
    };

    const handleBlur = () => {
        blurTimeoutRef.current = setTimeout(() => {
            closeDropdown();
        }, 150);
    };

    const handleFocus = () => {
        if (blurTimeoutRef.current) clearTimeout(blurTimeoutRef.current);
        setIsFocused(true);
        setOpen(true);
        // Clear query so user can type fresh
        if (selectedOption && query === selectedOption.label) setQuery("");
    };

    const showClear = !!value && !open;

    return (
        <div className={`relative space-y-1.5 ${className}`} ref={wrapperRef}>
            {/* Label */}
            <AppText variant="description" className="font-semibold text-text">
                {label}
            </AppText>

            {/* Input wrapper */}
            <div className="relative">
                <SearchIcon />

                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    onChange={(e) => {
                        const next = e.target.value;
                        setQuery(next);
                        onSearchChange?.(next);
                        setOpen(true);
                    }}
                    onKeyDown={(e) => {
                        if (e.key === "Escape") closeDropdown();
                        if (e.key === "Enter" && filteredOptions.length === 1) {
                            handleSelect(filteredOptions[0]);
                        }
                    }}
                    placeholder={open ? placeholder : (selectedOption?.label ?? placeholder)}
                    className={[
                        "h-10 w-full rounded-lg border bg-tab-bg pl-9 pr-9 text-sm text-text-secondary outline-none",
                        "transition-all duration-150",
                        isFocused
                            ? "border-text-focus bg-white shadow-[0_0_0_3px_rgba(var(--color-focus-ring),0.15)]"
                            : "border-border hover:border-text-muted",
                    ].join(" ")}
                />

                {/* Clear button or Chevron */}
                <AnimatePresence mode="wait">
                    {showClear ? (
                        <motion.button
                            key="clear"
                            type="button"
                            onClick={handleClear}
                            initial={{ opacity: 0, scale: 0.7 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.7 }}
                            transition={{ duration: 0.12 }}
                            className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center rounded-full p-1 text-text-muted hover:bg-bg-secondary hover:text-text transition-colors"
                        >
                            <ClearIcon />
                        </motion.button>
                    ) : (
                        <motion.div
                            key="chevron"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.12 }}
                        >
                            <ChevronIcon open={open} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Dropdown */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        key="dropdown"
                        variants={dropdownVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="absolute left-0 right-0 z-50 mt-1 rounded-xl border border-border bg-bg shadow-xl ring-1 ring-black/5 overflow-hidden"
                    >
                        {filteredOptions.length === 0 ? (
                            <motion.div
                                variants={emptyVariants}
                                initial="hidden"
                                animate="visible"
                                className="flex flex-col items-center gap-1 px-4 py-6 text-center"
                            >
                                <span className="text-2xl">🔍</span>
                                <AppText variant="description" className="text-sm text-text-muted">
                                    {emptyText}
                                </AppText>
                            </motion.div>
                        ) : (
                            <div className="max-h-56 overflow-y-auto overscroll-contain py-1">
                                {filteredOptions.map((option, i) => {
                                    const isSelected = option.value === value;
                                    return (
                                        <motion.button
                                            key={option.value}
                                            type="button"
                                            custom={i}
                                            variants={itemVariants}
                                            initial="hidden"
                                            animate="visible"
                                            onClick={() => handleSelect(option)}
                                            className={[
                                                "flex w-full items-center justify-between gap-3 px-3 py-2 text-left transition-colors",
                                                isSelected
                                                    ? "bg-bg-secondary text-text"
                                                    : "hover:bg-bg-secondary",
                                            ].join(" ")}
                                        >
                                            <div className="min-w-0 flex-1">
                                                <AppText
                                                    variant="body"
                                                    className={`text-sm font-medium truncate ${isSelected ? "text-text" : ""}`}
                                                >
                                                    {option.label}
                                                </AppText>
                                                {option.subtitle && (
                                                    <AppText variant="description" className="text-xs truncate">
                                                        {option.subtitle}
                                                    </AppText>
                                                )}
                                            </div>

                                            <div className="flex items-center gap-2 shrink-0">
                                                <AppText variant="description" className="text-xs text-text-muted">
                                                    {option.value}
                                                </AppText>
                                                <AnimatePresence>
                                                    {isSelected && (
                                                        <motion.span
                                                            initial={{ opacity: 0, scale: 0.5 }}
                                                            animate={{ opacity: 1, scale: 1 }}
                                                            exit={{ opacity: 0, scale: 0.5 }}
                                                            transition={{ duration: 0.15 }}
                                                            className="text-text-focus"
                                                        >
                                                            <CheckIcon />
                                                        </motion.span>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        </motion.button>
                                    );
                                })}
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {description && (
                <AppText
                    variant="description"
                    className={descriptionClassName ?? "text-text-muted"}
                >
                    {description}
                </AppText>
            )}
        </div>
    );
}