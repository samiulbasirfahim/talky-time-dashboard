import { useMemo } from "react";
import { AppText } from "../../components/text";
import { SystemEvent } from "./system-event-card";
import { useLatestSystemNotifications } from "../../lib/queries";

const METHOD_TO_EVENT_TYPE = (method: string) =>
    method === "POST" || method === "PATCH" || method === "PUT" ? "profile_assign" : "csv_upload";

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

export function SystemEvents() {
    const {
        data: notificationsData,
        isPending,
        isError,
    } = useLatestSystemNotifications();

    const notifications = useMemo(() => notificationsData?.results ?? [], [notificationsData]);

    return (
        <div className="p-4 w-full rounded-md shadow-border shadow-xs border border-border">
            <AppText variant="header" className="mb-4">
                System Events
            </AppText>

            {isPending ? (
                <AppText variant="description" className="text-text-muted">
                    Loading system events...
                </AppText>
            ) : isError ? (
                <AppText variant="description" className="text-red">
                    Failed to load system events.
                </AppText>
            ) : notifications.length === 0 ? (
                <AppText variant="description" className="text-text-muted">
                    No recent system events.
                </AppText>
            ) : (
                notifications.map((notification, index) => (
                    <SystemEvent
                        key={notification.id}
                        title={notification.message}
                        description={`${notification.actor_name} • ${notification.resource}`}
                        ago={formatAgo(notification.created_at)}
                        type={METHOD_TO_EVENT_TYPE(notification.method)}
                        isLast={index === notifications.length - 1}
                    />
                ))
            )}
        </div>
    );
}
