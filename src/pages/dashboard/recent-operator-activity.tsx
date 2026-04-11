import { History } from "lucide-react";
import { AppText } from "../../components/text";
import { OperatorHistoryCard } from "./operator-history-card";

export function RecentOperatorActivity() {
    return (
        <div className="p-4 w-full rounded-md shadow-border shadow-xs">
            <AppText
                variant="header"
                className="flex flex-row items-center gap-2 mb-4"
            >
                <History className="text-purple" />
                Recent Operator Activity
            </AppText>
            <OperatorHistoryCard
                title="Operator 1"
                description="ID #26125"
                activeStatus="active"
                activeText="Just Now"
            />

            <OperatorHistoryCard
                title="Operator 2"
                description="ID #26125"
                activeStatus="inactive"
                activeText="5 minutes ago"
            />

            <OperatorHistoryCard
                title="Operator 3"
                description="ID #26125"
                activeStatus="partial"
                activeText="10 minutes ago"
            />
            <OperatorHistoryCard
                title="Operator 4"
                description="ID #26125"
                activeStatus="active"
                activeText="15 minutes ago"
            />
            <OperatorHistoryCard
                title="Operator 5"
                description="ID #26125"
                activeStatus="inactive"
                activeText="20 minutes ago"
            />
        </div>
    );
}
