import { Bell, BellDot } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { AppButton } from "../../../components/button";
import { useState } from "react";
import { AppText } from "../../../components/text";
import { useLatestSystemNotifications } from "../../../lib/queries";

type NotificationType = "danger" | "info" | "normal";

const METHOD_TO_NOTIFICATION_TYPE = (method: string): NotificationType => {
    if (method === "DELETE") {
        return "danger";
    }

    if (method === "PATCH" || method === "PUT") {
        return "info";
    }

    return "normal";
};

const formatAgo = (createdAt: string) => {
    const date = new Date(createdAt);
    if (Number.isNaN(date.getTime())) {
        return createdAt;
    }

    const diffMs = Date.now() - date.getTime();
    const diffMinutes = Math.max(0, Math.floor(diffMs / 60000));
    if (diffMinutes < 1) return "just now";
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
};

export function Notification() {
    const [isOpen, setIsOpen] = useState(false);
    const { data: notificationsData } = useLatestSystemNotifications();

    const notifications = (notificationsData?.results ?? []).map((item) => ({
        id: item.id,
        type: METHOD_TO_NOTIFICATION_TYPE(item.method),
        message: item.message,
        source: item.actor_name,
        time: formatAgo(item.created_at),
    }));

    const hasUnreadNotifications = notifications.length > 0;

    const getNotificationColor = (type: NotificationType) => {
        if (type === "danger") {
            return "var(--color-red)";
        }

        if (type === "info") {
            return "var(--color-text-focus)";
        }

        return "var(--color-text)";
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
                                    {notifications.length === 0 ? (
                                        <div className="rounded-lg p-3 text-sm text-text-muted">
                                            No recent notifications.
                                        </div>
                                    ) : (
                                        notifications.map((notification) => (
                                            <div
                                                key={notification.id}
                                                className="w-full rounded-lg p-3 text-left"
                                            >
                                                <div className="flex items-start justify-between gap-4">
                                                    <AppText
                                                        variant="body"
                                                        className="max-w-[80%] whitespace-normal font-medium leading-snug"
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
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
