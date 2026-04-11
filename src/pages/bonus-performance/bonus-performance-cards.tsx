import { Award, UserRound, Clock } from "lucide-react";
import { StatCard, type StatCardProps } from "../../components/stat-card";

const BONUS_PERFORMANCE_CARDS: StatCardProps[] = [
    {
        title: "1,025",
        description: "Total Bonuses",
        badge: "+4.2%",
        badgeBackground: "bg-[#FFFBEB]",
        badgeTextColor: "text-[#F59E0B]",
        cardBackground: "bg-[#F3B2001A]",
        icon: Award,
        iconBackground: "bg-[#F3B20026]",
        iconColor: "text-[#F3B200]",
    },
    {
        title: "8",
        description: "Active Operators",
        badge: "-1.2%",
        badgeBackground: "bg-[#2C61E51A]",
        badgeTextColor: "text-[#2C61E5]",
        cardBackground: "bg-[#234EB71A]",
        icon: UserRound,
        iconBackground: "bg-[#98B9F233]",
        iconColor: "text-[#2C61E5]",
    },
    {
        title: "Mar 28, 2026",
        description: "Last Cutoff Time",
        cardBackground: "bg-[#0596691A]",
        icon: Clock,
        iconBackground: "bg-[#13F93D33]",
        iconColor: "text-[#059669]",
    },
];

export function BonusPerformanceCards() {
    return (
        <div className="grid grid-cols-1 gap-3 px-4 md:grid-cols-2 xl:grid-cols-3">
            {BONUS_PERFORMANCE_CARDS.map((card) => (
                <StatCard key={card.description} {...card} />
            ))}
        </div>
    );
}
