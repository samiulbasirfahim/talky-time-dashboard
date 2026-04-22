import { AppText } from "../../components/text"
import { useAllGroupsWithLimit, useReportsLeaderboard } from "../../lib/queries"
import {
    GROUP_CHIP_CLASS,
} from "./report-info-data"

export function ReportInfoRightSection() {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;

    const {
        data: leaderboardData,
        isLoading: isLeaderboardLoading,
        isError: isLeaderboardError,
    } = useReportsLeaderboard({
        period: "monthly",
        year: currentYear,
        month: currentMonth,
        limit: 3,
    });

    const {
        data: groupsData,
        isLoading: isGroupsLoading,
        isError: isGroupsError,
    } = useAllGroupsWithLimit(4);

    const leaderboardItems = leaderboardData?.top_operators ?? [];

    const getGroupChipClass = (groupName: string): string => {
        const normalized = groupName.toLowerCase();

        if (normalized.includes("medellin")) {
            return GROUP_CHIP_CLASS.Medellin;
        }

        if (normalized.includes("bogota")) {
            return GROUP_CHIP_CLASS.Bogota;
        }

        return GROUP_CHIP_CLASS.Remote;
    };

    const formatCopAmount = (value: number): string => {
        return `CO$ ${value.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })}`;
    };

    const monthlyComparisonGroups = groupsData?.results ?? [];

    return (
        <div className="space-y-4">
            <section className="rounded-[28px] border border-border bg-bg px-8 py-7 shadow-xs">
                <AppText variant="smallHeader" className="text-4xl font-semibold text-text">
                    Top Operators
                </AppText>

                <div className="mt-7 space-y-6">
                    {isLeaderboardLoading ? (
                        <AppText variant="description" className="text-text-muted">
                            Loading leaderboard...
                        </AppText>
                    ) : isLeaderboardError ? (
                        <AppText variant="description" className="text-red">
                            Failed to load leaderboard.
                        </AppText>
                    ) : leaderboardItems.length === 0 ? (
                        <AppText variant="description" className="text-text-muted">
                            No leaderboard items found.
                        </AppText>
                    ) : (
                        leaderboardItems.map((operator) => (
                            <div key={operator.operator_db_id} className="flex items-start justify-between gap-3">
                                <div>
                                    <AppText variant="body" className="font-semibold text-text">
                                        {operator.rank}. {operator.operator_name}
                                    </AppText>
                                    <span
                                        className={`mt-1 inline-flex rounded-md px-2 py-0.5 text-sm font-semibold ${getGroupChipClass(operator.group_name)}`}
                                    >
                                        {operator.group_name}
                                    </span>
                                </div>

                                <div className="text-right flex items-center">
                                    <AppText variant="body" className="font-semibold text-text">
                                        {formatCopAmount(operator.total_bonus)}
                                    </AppText>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* <AppButton
                    variant="bg"
                    fullWidth
                    className="mt-6"
                    onClick={() => { }}
                >
                    View All Performance
                </AppButton> */}
            </section>

            <section className="rounded-[28px] bg-[#2F68AB] px-8 py-8 text-white shadow-[0_18px_28px_rgba(47,104,171,0.22)]">
                <AppText variant="smallHeader" className="text-4xl font-semibold text-white">
                    Monthly Group Comparison
                </AppText>

                <div className="mt-8 space-y-6">
                    {isGroupsLoading ? (
                        <AppText variant="description" className="text-white/80">
                            Loading group comparison...
                        </AppText>
                    ) : isGroupsError ? (
                        <AppText variant="description" className="text-white/80">
                            Failed to load group comparison.
                        </AppText>
                    ) : monthlyComparisonGroups.length === 0 ? (
                        <AppText variant="description" className="text-white/80">
                            No groups found.
                        </AppText>
                    ) : (
                        monthlyComparisonGroups.map((group) => (
                            <div key={group.id} className="flex items-center justify-between">
                                <AppText variant="body" className="text-white/95">
                                    {group.name}
                                </AppText>
                                <AppText variant="body" className="text-white">
                                    {formatCopAmount(group.total_bonus ?? 0)}
                                </AppText>
                            </div>
                        ))
                    )}
                </div>
            </section>
        </div>
    )
}