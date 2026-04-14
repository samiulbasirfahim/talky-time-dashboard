import {
    ArrowUp,
    ChartNoAxesCombined,
    CircleDollarSign,
    FileCheck,
} from "lucide-react";
import { StatCard, type StatCardProps } from "../../components/stat-card";

const PAYOUT_CARDS: StatCardProps[] = [
    {
        title: "$11,050",
        description: "Gross Bonuses (USD)",
        badge: "+12.4%",
        badgeBackground: "bg-[#FFFBEB]",
        badgeTextColor: "text-[#F59E0B]",
        cardBackground:
            "bg-[#F3B2001A] border border-white/40 shadow-[0_1px_2px_rgba(0,0,0,0.05)] backdrop-blur-sm",
        icon: CircleDollarSign,
        iconBackground: "bg-[#F3B20026]",
        iconColor: "text-[#F3B200]",
        badgePrefixIcon: ArrowUp,
    },
    {
        title: "23.50%",
        description: "Average Bonus Rate",
        badge: "+10.2%",
        badgeBackground: "bg-[#2C61E51A]",
        badgeTextColor: "text-[#2C61E5]",
        cardBackground:
            "bg-[#234EB71A] border border-white/40 shadow-[0_1px_2px_rgba(0,0,0,0.05)] backdrop-blur-sm",
        icon: ChartNoAxesCombined,
        iconBackground: "bg-[#98B9F233]",
        iconColor: "text-[#2C61E5]",
        badgePrefixIcon: ArrowUp,
    },
    {
        title: "39,432,560",
        description: "Estimated Final Pay (COP)",
        badge: "+8.8%",
        badgeBackground: "bg-[#DCFCE7]",
        badgeTextColor: "text-[#059669]",
        cardBackground:
            "bg-[#0596691A] border border-white/40 shadow-[0_1px_2px_rgba(0,0,0,0.05)] backdrop-blur-sm",
        icon: FileCheck,
        iconBackground: "bg-[#13F93D33]",
        iconColor: "text-[#059669]",
        badgePrefixIcon: ArrowUp,
    },
];

export function PayoutsCards() {
    return (
        <div className="grid grid-cols-1 gap-3 px-4 md:grid-cols-2 xl:grid-cols-3">
            {PAYOUT_CARDS.map((card) => (
                <StatCard key={card.description} {...card} />
            ))}
        </div>
    );
}
