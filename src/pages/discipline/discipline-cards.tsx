import { AlertTriangle, FileCheck, AlertCircle, CalendarClock } from "lucide-react";
import { StatCard, type StatCardProps } from "../../components/stat-card";
import { useDisciplinaryOverview } from "../../lib/queries";

export function DisciplineCards() {
    const { data: overview, isPending } = useDisciplinaryOverview();

    const DISCIPLINE_CARDS: StatCardProps[] = [
        {
            title: isPending ? "..." : String(overview?.active_warnings ?? 0),
            description: "Active Warnings",
            cardBackground: "bg-[#FAE2A21A]",
            icon: AlertTriangle,
            iconBackground: "bg-[#F3B20033]",
            iconColor: "text-[#F3B200]",
        },
        {
            title: isPending ? "..." : String(overview?.reprimands ?? 0),
            description: "Reprimands (APR)",
            cardBackground: "bg-[#D8E4F91A]",
            icon: FileCheck,
            iconBackground: "bg-[#98B9F233]",
            iconColor: "text-[#2C61E5]",
        },
        {
            title: isPending ? "..." : String(overview?.at_risk ?? 0),
            description: "At Risk",
            cardBackground: "bg-[#FDA2A21A]",
            icon: AlertCircle,
            iconBackground: "bg-[#FF000033]",
            iconColor: "text-[#FF0000]",
        },
        {
            title: isPending ? "..." : `${overview?.monthly_reset_days_left ?? 0} days left`,
            description: "Monthly Reset",
            cardBackground: "bg-[#A9FCB81A]",
            icon: CalendarClock,
            iconBackground: "bg-[#13F93D33]",
            iconColor: "text-[#16A34A]",
        },
    ];

    return (
        <div className="grid grid-cols-1 gap-3 px-4 md:grid-cols-2 xl:grid-cols-4">
            {DISCIPLINE_CARDS.map((card) => (
                <StatCard key={card.description} {...card} />
            ))}
        </div>
    );
}
