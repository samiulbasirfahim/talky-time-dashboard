import { CircleCheck, LayoutGrid, TriangleAlert, UserRound } from "lucide-react";
import { StatCard, type StatCardProps } from "../../components/stat-card";

const PROFILE_CARDS: StatCardProps[] = [
    {
        title: "6",
        description: "TOTAL DASHBOARD",
        cardBackground: "bg-[#234EB71A]",
        icon: LayoutGrid,
        iconBackground: "bg-[#98B9F233]",
        iconColor: "text-[#2C61E5]",
    },
    {
        title: "66",
        description: "TOTAL PROFILES",
        cardBackground: "bg-[#7744B31A]",
        icon: UserRound,
        iconBackground: "bg-[#EEDBFF]",
        iconColor: "text-[#7744B3]",
    },
    {
        title: "20",
        description: "ASSIGNED PROFILES",
        cardBackground: "bg-[#16A34A1A]",
        icon: CircleCheck,
        iconBackground: "bg-[#DCFCE7]",
        iconColor: "text-[#16A34A]",
    },
    {
        title: "12",
        description: "UNASSIGNED PROFILES",
        cardBackground: "bg-[#DC26261A]",
        icon: TriangleAlert,
        iconBackground: "bg-[#FEE2E2]",
        iconColor: "text-[#DC2626]",
    },
];

export function ProfileCards() {
    return (
        <div className="grid grid-cols-1 gap-3 px-4 md:grid-cols-2 xl:grid-cols-4">
            {PROFILE_CARDS.map((card) => (
                <StatCard key={card.description} {...card} />
            ))}
        </div>
    );
}
