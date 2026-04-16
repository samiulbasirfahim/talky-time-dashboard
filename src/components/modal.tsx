import React from "react";
import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";

interface ApModalProps {
    open: boolean;
    onClose: () => void;
    children: React.ReactNode;
    ariaLabel?: string;
    overlayClassName?: string;
    contentClassName?: string;
    closeOnOverlayClick?: boolean;
    closeOnEscape?: boolean;
    showRadialBackdrop?: boolean;
    showX?: boolean;
    xAriaLabel?: string;
    xClassName?: string;
}

export const AppModal = ({
    open,
    onClose,
    children,
    ariaLabel = "Modal",
    overlayClassName = "",
    contentClassName = "",
    closeOnOverlayClick = true,
    closeOnEscape = true,
    showRadialBackdrop = true,
    showX = false,
    xAriaLabel = "Close modal",
    xClassName = "",
}: ApModalProps) => {
    React.useEffect(() => {
        if (!open || !closeOnEscape) return;

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                event.preventDefault();
                onClose();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [open, closeOnEscape, onClose]);

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`fixed inset-0 z-50 flex items-center justify-center bg-text/30 backdrop-blur-sm ${overlayClassName}`}
                    onClick={() => {
                        if (closeOnOverlayClick) onClose();
                    }}
                >
                    {showRadialBackdrop && (
                        <div
                            className="absolute inset-0 z-0 pointer-events-none"
                            style={{
                                backgroundImage:
                                    "radial-gradient(circle, var(--color-bg) 1px, transparent 1px)",
                                backgroundSize: "8px 8px",
                                maskImage:
                                    "radial-gradient(ellipse at center, white, transparent 70%)",
                                WebkitMaskImage:
                                    "radial-gradient(ellipse at center, white, transparent 70%)",
                            }}
                        />
                    )}

                    <motion.div
                        role="dialog"
                        aria-modal="true"
                        aria-label={ariaLabel}
                        initial={{ opacity: 0, scale: 0.97, y: 8 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.97, y: 8 }}
                        transition={{ duration: 0.2 }}
                        className={`relative z-10 w-full max-w-lg rounded-xl border border-border bg-bg shadow-lg ${contentClassName}`}
                        onClick={(event) => event.stopPropagation()}
                    >
                        {showX && (
                            <button
                                type="button"
                                onClick={onClose}
                                aria-label={xAriaLabel}
                                className={`absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-md text-text-muted transition-colors hover:bg-bg-secondary hover:text-text ${xClassName}`}
                            >
                                <X size={22} />
                            </button>
                        )}

                        {children}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
