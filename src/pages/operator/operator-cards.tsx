import { ArrowUp, Network, UserRound, Users, ArrowDown } from "lucide-react";
import { StatCard, type StatCardProps } from "../../components/stat-card";

const OPERATOR_CARDS: StatCardProps[] = [
    {
        title: "66",
        description: "TOTAL OPERATOR",
        badge: "+4.2%",
        badgeBackground: "bg-[#FFFFFB]",
        badgeTextColor: "text-[#F59E0B]",
        cardBackground: "bg-[#F3B2001A]",
        icon: Users,
        iconBackground: "bg-[#FFFBEB]",
        iconColor: "text-[#F3B200]",
        badgePrefixIcon: ArrowUp,
    },
    {
        title: "36",
        description: "ACTIVE OPERATOR",
        badge: "-1.2%",
        badgeBackground: "bg-[#2C61E51A]",
        badgeTextColor: "text-[#2C61E5]",
        cardBackground: "bg-[#234EB71A]",
        icon: UserRound,
        iconBackground: "bg-[#98B9F233]",
        iconColor: "text-[#2C61E5]",
        badgePrefixIcon: ArrowDown,
    },
    {
        title: "124",
        description: "TOTAL ACTIVE PROFILE",
        badge: "+8",
        badgeBackground: "bg-[#FFFFFF]",
        badgeTextColor: "text-[#10B981]",
        cardBackground: "bg-[#0596691A]",
        icon: Network,
        iconBackground: "bg-[#13F93D33]",
        iconColor: "text-[#059669]",
        badgePrefixIcon: ArrowUp,
    },
];

export function OperatorCards() {
    return (
        <div className="grid grid-cols-1 gap-3 px-4 md:grid-cols-2 xl:grid-cols-3">
            {OPERATOR_CARDS.map((card) => (
                <StatCard key={card.description} {...card} />
            ))}
        </div>
    );
}
