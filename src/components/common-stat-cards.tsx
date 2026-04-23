import { Award, Sun, Moon, CalendarDays } from "lucide-react";
import { useMemo } from "react";
import { useShiftStatus } from "../hooks/use-shift-status";
import { StatCard, type StatCardProps } from "./stat-card";

export function CommonStatCards() {
    const { isDayShift, now } = useShiftStatus();

    const formattedDateTime = useMemo(() => {
        const dateStr = now.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
        const timeStr = now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
        return `${dateStr} — ${timeStr}`;
    }, [now]);

    const CARDS: StatCardProps[] = [
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
            title: isDayShift ? "DAY" : "NIGHT",
            description: "SHIFT",
            badgeBackground: "bg-[#2C61E51A]",
            badgeTextColor: "text-[#2C61E5]",
            cardBackground: "bg-[#E8EEF4]",
            icon: isDayShift ? Sun : Moon,
            iconBackground: "bg-[#DDE0FA]",
            iconColor: "text-[#2C61E5]",
        },
        {
            title: formattedDateTime,
            description: "CURRENT WINDOW",
            cardBackground: "bg-[#ECFDF5]",
            icon: CalendarDays,
            iconBackground: "bg-[#D1FAE5]",
            iconColor: "text-[#059669]",
        },
    ];

    return (
        <div className="grid grid-cols-1 gap-3 px-4 md:grid-cols-2 xl:grid-cols-3">
            {CARDS.map((card) => (
                <StatCard key={card.description} {...card} />
            ))}
        </div>
    );
}
