import { History, Loader2 } from "lucide-react";
import { AppText } from "../../components/text";
import { OperatorHistoryCard } from "./operator-history-card";
import { useLatestOperatorStatusChanges } from "../../lib/queries/operator.query";

function getRelativeTime(dateString: string) {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "Just Now";
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
}

export function RecentOperatorActivity() {
    const { data: statusChanges, isLoading } = useLatestOperatorStatusChanges();

    return (
        <div className="p-4 w-full rounded-md shadow-border shadow-xs border border-border">
            <AppText
                variant="header"
                className="flex flex-row items-center gap-2 mb-4"
            >
                <History className="text-purple" />
                Recent Operator Activity
            </AppText>

            {isLoading && (
                <div className="flex justify-center py-8">
                    <Loader2 className="animate-spin text-text-focus" />
                </div>
            )}

            {!isLoading && (!statusChanges || statusChanges.length === 0) && (
                <div className="flex justify-center py-8">
                    <AppText variant="description">No recent activity found.</AppText>
                </div>
            )}

            {!isLoading && statusChanges?.map((change) => (
                <OperatorHistoryCard
                    key={change.id}
                    title={change.operator_name}
                    description={`ID ${change.operator_id}`}
                    activeStatus={change.status}
                    activeText={getRelativeTime(change.created_at)}
                />
            ))}
        </div>
    );
}
