import { useMemo } from "react";
import { ArrowDown, ArrowUp, Network, UserRound, Users } from "lucide-react";
import { StatCard, type StatCardProps } from "../../components/stat-card";
import { AppText } from "../../components/text";
import { usePaginatedOperators } from "../../lib/queries";

export function OperatorCards() {
    const {
        data: paginatedData,
        isPending,
        isError,
    } = usePaginatedOperators(1);

    const operatorStats = useMemo(() => {
        return {
            totalOperators:
                paginatedData?.total_operator_count ?? paginatedData?.count ?? 0,
            activeOperators:
                (paginatedData as { active_operator_count?: number } | undefined)?.active_operator_count ??
                paginatedData?.total_active_operator_count ??
                0,
            activeProfiles: paginatedData?.total_active_profile_count ?? 0,
        };
    }, [paginatedData]);

    const operatorCards: StatCardProps[] = useMemo(
        () => [
            {
                title: String(operatorStats.totalOperators),
                description: "TOTAL OPERATOR",
                badgeBackground: "bg-[#FFFFFB]",
                badgeTextColor: "text-[#F59E0B]",
                cardBackground: "bg-[#F3B2001A]",
                icon: Users,
                iconBackground: "bg-[#FFFBEB]",
                iconColor: "text-[#F3B200]",
                badgePrefixIcon: ArrowUp,
            },
            {
                title: String(operatorStats.activeOperators),
                description: "ACTIVE OPERATOR",
                badgeBackground: "bg-[#2C61E51A]",
                badgeTextColor: "text-[#2C61E5]",
                cardBackground: "bg-[#234EB71A]",
                icon: UserRound,
                iconBackground: "bg-[#98B9F233]",
                iconColor: "text-[#2C61E5]",
                badgePrefixIcon: ArrowDown,
            },
            {
                title: String(operatorStats.activeProfiles),
                description: "TOTAL ACTIVE PROFILE",
                badgeBackground: "bg-[#FFFFFF]",
                badgeTextColor: "text-[#10B981]",
                cardBackground: "bg-[#0596691A]",
                icon: Network,
                iconBackground: "bg-[#13F93D33]",
                iconColor: "text-[#059669]",
                badgePrefixIcon: ArrowUp,
            },
        ],
        [operatorStats],
    );

    return (
        <div className="space-y-3 px-4">
            {isError && (
                <AppText
                    variant="description"
                    className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
                >
                    Failed to load operator statistics. Showing default values.
                </AppText>
            )}

            {isPending && (
                <AppText variant="description" className="px-1 text-sm text-text-muted">
                    Loading operator statistics...
                </AppText>
            )}

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
                {operatorCards.map((card) => (
                    <StatCard key={card.description} {...card} />
                ))}
            </div>
        </div>
    );
}
