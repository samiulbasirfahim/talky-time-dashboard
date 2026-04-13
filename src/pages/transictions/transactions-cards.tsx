import { TrendingUp, Workflow, AlertCircle, Users } from "lucide-react";
import { StatCard, type StatCardProps } from "../../components/stat-card";

const TRANSACTIONS_CARDS: StatCardProps[] = [
    {
        title: "COL.$42,850.00",
        description: "Total Bonuses Paid",
        cardBackground: "bg-[#234EB71A]",
        icon: TrendingUp,
        iconBackground: "bg-[#98B9F233]",
        iconColor: "text-[#2C61E5]",
    },
    {
        title: "Medellín",
        description: "Top Group",
        cardBackground: "bg-[#AA6DEC1A]",
        icon: Workflow,
        iconBackground: "bg-[#AA6DEC1A]",
        iconColor: "text-[#AA6DEC]",
    },
    {
        title: "58K",
        description: "Total Payout USD/COP",
        cardBackground: "bg-[#FDA2A21A]",
        icon: AlertCircle,
        iconBackground: "bg-[#FF000033]",
        iconColor: "text-[#FF0000]",
    },
    {
        title: "72",
        description: "Active Operators",
        cardBackground: "bg-[#0596691A]",
        icon: Users,
        iconBackground: "bg-[#16A34A33]",
        iconColor: "text-[#059669]",
    },
];

export function TransactionsCards() {
    return (
        <div className="grid grid-cols-1 gap-3 px-4 md:grid-cols-2 xl:grid-cols-4">
            {TRANSACTIONS_CARDS.map((card) => (
                <StatCard key={card.description} {...card} />
            ))}
        </div>
    );
}
