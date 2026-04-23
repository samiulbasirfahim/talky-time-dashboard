import {
    ChartNoAxesCombined,
    CircleDollarSign,
    FileCheck,
} from "lucide-react";
import { StatCard, type StatCardProps } from "../../components/stat-card";
import { useReportsSummary } from "../../lib/queries";

export function PayoutsCards() {
    const { data: summary, isPending } = useReportsSummary();

    const PAYOUT_CARDS: StatCardProps[] = [
        {
            title: isPending ? "..." : `$${summary?.total_bonus_paid?.toLocaleString() ?? 0}`,
            description: "Gross Bonuses (USD)",
            cardBackground:
                "bg-[#F3B2001A] border border-white/40 shadow-[0_1px_2px_rgba(0,0,0,0.05)] backdrop-blur-sm",
            icon: CircleDollarSign,
            iconBackground: "bg-[#F3B20026]",
            iconColor: "text-[#F3B200]",
        },
        {
            title: isPending ? "..." : `$${summary?.total_deduction?.toLocaleString() ?? 0}`,
            description: "Total Deductions",
            cardBackground:
                "bg-[#234EB71A] border border-white/40 shadow-[0_1px_2px_rgba(0,0,0,0.05)] backdrop-blur-sm",
            icon: ChartNoAxesCombined,
            iconBackground: "bg-[#98B9F233]",
            iconColor: "text-[#2C61E5]",
        },
        {
            title: isPending ? "..." : `$${summary?.total_payout?.toLocaleString() ?? 0}`,
            description: "Estimated Final Pay (COP)",
            cardBackground:
                "bg-[#0596691A] border border-white/40 shadow-[0_1px_2px_rgba(0,0,0,0.05)] backdrop-blur-sm",
            icon: FileCheck,
            iconBackground: "bg-[#13F93D33]",
            iconColor: "text-[#059669]",
        },
    ];

    return (
        <div className="grid grid-cols-1 gap-3 px-4 md:grid-cols-2 xl:grid-cols-3">
            {PAYOUT_CARDS.map((card) => (
                <StatCard key={card.description} {...card} />
            ))}
        </div>
    );
}
