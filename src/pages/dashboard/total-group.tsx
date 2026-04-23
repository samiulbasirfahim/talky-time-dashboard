import { useMemo } from "react";
import { useNavigate } from "react-router";
import { AppButton } from "../../components/button";
import { HorizontalStatCard } from "../../components/horizontal-stat-card";
import { AppText } from "../../components/text";
import { useAllGroupsWithLimit } from "../../lib/queries";

const DASHBOARD_GROUP_LIMIT = 4;

function formatUsd(value: number): string {
    return value.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
}

export function TotalGroup() {
    const navigate = useNavigate();
    const {
        data: groupsData,
        isPending: isGroupsPending,
        isError: isGroupsError,
    } = useAllGroupsWithLimit(DASHBOARD_GROUP_LIMIT);

    const groups = useMemo(() => {
        return groupsData?.results ?? [];
    }, [groupsData]);

    const handleShowMore = () => {
        navigate("/supervisor#total-groups");
    };

    return (
        <div className="p-4 shadow-border shadow-xs rounded-md w-full space-y-4 border border-border">
            <AppText variant="header">Total Group</AppText>

            {isGroupsPending ? (
                <div className="rounded-lg border border-border bg-bg-secondary p-4 text-center">
                    <AppText variant="description">Loading groups...</AppText>
                </div>
            ) : isGroupsError ? (
                <div className="rounded-lg border border-border bg-bg-secondary p-4 text-center">
                    <AppText variant="description">Failed to load groups.</AppText>
                </div>
            ) : groups.length === 0 ? (
                <div className="rounded-lg border border-border bg-bg-secondary p-4 text-center">
                    <AppText variant="description">No groups available.</AppText>
                </div>
            ) : (
                groups.map((group, index) => (
                    <HorizontalStatCard
                        key={group.id}
                        title={group.name}
                        description={`${group.operator_count} Operator${group.operator_count === 1 ? "" : "s"}`}
                        value={formatUsd(group.total_bonus)}
                        lightColor={index % 2 === 1}
                    />
                ))
            )}

            <AppButton variant="outline" fullWidth onClick={handleShowMore}>
                Show More
            </AppButton>
        </div>
    );
}
