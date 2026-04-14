import { Bell, BellDot } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { AppButton } from "../../../components/button";
import { useState } from "react";
import { useNavigate } from "react-router";
import { AppText } from "../../../components/text";

type NotificationType = "danger" | "info" | "normal";

type AppNotification = {
    id: string;
    type: NotificationType;
    message: string;
    redirectUri: string;
    source?: string;
    time: string;
};

const NOTIFICATIONS: AppNotification[] = [
    {
        id: "n-1",
        type: "normal",
        message: "CSV Uploaded",
        redirectUri: "/csv-upload",
        source: "Dashboard A",
        time: "2m ago",
    },
    {
        id: "n-2",
        type: "danger",
        message: "Reassignment Required, Profiles 'Sofia_VIP', 'Luna_Premium', 'Aria_Elite'",
        redirectUri: "/profile",
        time: "11:03am",
    },
    {
        id: "n-3",
        type: "info",
        message: "Last Reassignments, Julian.m ID: prf4 -> Akash.65VIP",
        redirectUri: "/profile",
        time: "11:03am",
    },
    {
        id: "n-4",
        type: "normal",
        message: "Sofia_P Response Late (5min+) Warn Hlm",
        redirectUri: "/discipline",
        time: "11:03am",
    },
];

export function Notification() {
    const navigate = useNavigate();
    const hasUnreadNotifications = NOTIFICATIONS.length > 0;
    const [isOpen, setIsOpen] = useState(false);

    const getNotificationColor = (type: NotificationType) => {
        if (type === "danger") {
            return "var(--color-red)";
        }

        if (type === "info") {
            return "var(--color-text-focus)";
        }

        return "var(--color-text)";
    };

    const handleNotificationClick = (notification: AppNotification) => {
        navigate(notification.redirectUri);
        setIsOpen(false);
    };

    return (
        <div className="relative">
            <AppButton variant="ghost" onClick={() => setIsOpen((prev) => !prev)}>
                {hasUnreadNotifications ? (
                    <BellDot className="h-6 w-6" />
                ) : (
                    <Bell className="h-6 w-6" />
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
                            className="absolute right-0 top-full z-50 mt-2 h-96 min-h-48 w-2xl overflow-hidden rounded-md border border-border bg-bg shadow-lg"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="h-full overflow-y-auto p-4">
                                <div className="space-y-1.5">
                                    {NOTIFICATIONS.map((notification) => (
                                        <button
                                            key={notification.id}
                                            type="button"
                                            className="w-full rounded-lg p-3 text-left transition-colors hover:bg-bg-secondary"
                                            onClick={() => handleNotificationClick(notification)}
                                        >
                                            <div className="flex items-start justify-between gap-4">
                                                <AppText
                                                    variant="body"
                                                    className={`max-w-[80%] whitespace-normal font-medium leading-snug`}
                                                    style={{
                                                        color: getNotificationColor(notification.type),
                                                    }}
                                                >
                                                    {notification.message}
                                                </AppText>

                                                <AppText
                                                    variant="description"
                                                    className="shrink-0 text-right"
                                                    style={{ color: "var(--color-text)" }}
                                                >
                                                    {notification.source
                                                        ? `${notification.source} • ${notification.time}`
                                                        : notification.time}
                                                </AppText>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
