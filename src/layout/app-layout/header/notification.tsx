import { Bell, BellDot } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { AppButton } from "../../../components/button";
import { useState } from "react";

export function Notification() {
    const hasUnreadNotifications = true;
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="relative">
            <AppButton variant="ghost" onClick={() => setIsOpen((prev) => !prev)}>
                {hasUnreadNotifications ? (
                    <BellDot onClick={() => { }} className="w-6 h-6" />
                ) : (
                    <Bell className="w-6 h-6" />
                )}
            </AppButton>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.button
                            type="button"
                            aria-label="Close notifications"
                            onClick={() => setIsOpen(false)}
                            key={"notification-backdrop"}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="fixed inset-0 z-40 cursor-default"
                        />

                        <motion.div
                            key={"notification-panel"}
                            initial={{ opacity: 0, y: -6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -6 }}
                            transition={{ duration: 0.2 }}
                            className="absolute right-0 top-full mt-2 z-50 w-2xl h-96 min-h-48 bg-bg border-border border rounded-md p-4 shadow-lg"
                            onClick={(e) => e.stopPropagation()}
                        ></motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
