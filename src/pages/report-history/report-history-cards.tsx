import { AlertTriangle, FileCheck, AlertCircle, CalendarClock } from "lucide-react";
import { StatCard, type StatCardProps } from "../../components/stat-card";

const REPORT_HISTORY_CARDS: StatCardProps[] = [
    {
        title: "09",
        description: "Active Warnings",
        cardBackground: "bg-[#FAE2A21A]",
        icon: AlertTriangle,
        iconBackground: "bg-[#F3B20033]",
        iconColor: "text-[#F3B200]",
    },
    {
        title: "2",
        description: "Reprimands (APR)",
        cardBackground: "bg-[#D8E4F91A]",
        icon: FileCheck,
        iconBackground: "bg-[#98B9F233]",
        iconColor: "text-[#2C61E5]",
    },
    {
        title: "02",
        description: "At Risk",
        cardBackground: "bg-[#FDA2A21A]",
        icon: AlertCircle,
        iconBackground: "bg-[#FF000033]",
        iconColor: "text-[#FF0000]",
    },
    {
        title: "18",
        description: "Monthly Reset",
        cardBackground: "bg-[#A9FCB81A]",
        icon: CalendarClock,
        iconBackground: "bg-[#13F93D33]",
        iconColor: "text-[#16A34A]",
    },
];

export function ReportHistoryCards() {
    return (
        <div className="grid grid-cols-1 gap-3 px-4 md:grid-cols-2 xl:grid-cols-4">
            {REPORT_HISTORY_CARDS.map((card) => (
                <StatCard key={card.description} {...card} />
            ))}
        </div>
    );
}
