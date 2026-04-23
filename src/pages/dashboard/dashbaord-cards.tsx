import {
    ArrowUp,
    ChartNoAxesCombined,
    CircleDollarSign,
    CircleUser,
    User,
} from "lucide-react";
import { StatCardContainer } from "../../components/stat-card-container";
import { useDashboardStats } from "../../lib/queries";

export function DashboardCards() {
    const { data: stats, isPending } = useDashboardStats();

    return (
        <StatCardContainer
            cards={[
                {
                    title: isPending ? "..." : `$${stats?.total_bonus_today?.toLocaleString() ?? 0}`,
                    description: "Total Bonuses Today",

                    badgeBackground: "bg-[#D8E3F6]",
                    badgeTextColor: "text-[#2C61E5]",
                    cardBackground: "bg-[#6388E31A]",
                    icon: CircleDollarSign,
                    iconBackground: "bg-[#98B9F233]",
                    iconColor: "text-[#2C61E5]",
                    badgePrefixIcon: ArrowUp,
                },
                {
                    title: isPending ? "..." : String(stats?.active_operators ?? 0),
                    description: "Active Operators",

                    badgeBackground: "bg-[#D6E1F5]",
                    badgeTextColor: "text-[#1A3B5F]",
                    cardBackground: "bg-[#EAF1FC]",
                    icon: User,
                    iconBackground: "bg-[#234EB71A]",
                    iconColor: "text-[#2C61E5]",
                    badgePrefixIcon: ArrowUp,
                },
                {
                    title: isPending ? "..." : String(stats?.active_profiles ?? 0),
                    description: "Active Profiles",
                    cardBackground: "bg-[#AA6DEC1A]",
                    icon: CircleUser,
                    iconBackground: "bg-[#AA6DEC33]",
                    iconColor: "text-[#AA6DEC]",
                },
                {
                    title: isPending ? "..." : `$${stats?.payout_till_now?.toLocaleString() ?? 0}`,
                    description: "Estimated Payout",

                    badgeBackground: "bg-[#FFFFFF]",
                    badgeTextColor: "text-[#16A34A]",
                    cardBackground: "bg-[#16A34A1A]",
                    icon: ChartNoAxesCombined,
                    iconBackground: "bg-[#16A34A33]",
                    iconColor: "text-[#059669]",
                    badgePrefixIcon: ArrowUp,
                },
            ]}
        />
    );
}
