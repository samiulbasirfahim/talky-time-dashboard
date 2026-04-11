import { HorizontalStatCard } from "../../components/horizontal-stat-card";
import { AppText } from "../../components/text";

export function TotalGroup() {
    return (
        <div className="p-4 shadow-border shadow-xs rounded-md w-full space-y-4">
            <AppText variant="header">Total Group</AppText>
            <HorizontalStatCard
                title="Medellin Hub"
                description="18 Operator"
                value={"$112,400"}
                lightColor={false}
            />

            <HorizontalStatCard
                title="Medellin Hub"
                description="18 Operator"
                value={"$112,400"}
                lightColor={false}
            />
            <HorizontalStatCard
                title="Medellin Hub"
                description="18 Operator"
                value={"$112,400"}
                lightColor={true}
            />
        </div>
    );
}
