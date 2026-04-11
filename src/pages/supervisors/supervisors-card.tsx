import { ChartNoAxesCombined, Network, Users } from "lucide-react";
import { StatCardContainer } from "../../components/stat-card-container";

export function SuperVisorsCard() {
    return (
        <StatCardContainer
            cards={[
                {
                    title: "4",
                    description: "Total Supervisors",
                    cardBackground: "bg-[#234EB71A]",
                    icon: Users,
                    iconBackground: "bg-[#98B9F233]",
                    iconColor: "text-[#2C61E5]",
                },
                {
                    title: "3",
                    description: "Active Groups",
                    cardBackground: "bg-[#AA6DEC1A]",
                    icon: Network,
                    iconBackground: "bg-[#AA6DEC1A]",
                    iconColor: "text-[#AA6DEC]",
                },
                {
                    title: "92%",
                    description: "Performance AVG",
                    cardBackground: "bg-[#0596691A]",
                    icon: ChartNoAxesCombined,
                    iconBackground: "bg-[#16A34A33]",
                    iconColor: "text-[#059669]",
                },
                {
                    title: "1",
                    description: "Pending Invites",
                    cardBackground: "bg-[#F59E0B1A]",
                    icon: ChartNoAxesCombined,
                    iconBackground: "bg-[#F3B20026]",
                    iconColor: "text-[#F59E0B]",
                },
            ]}
        />
    );
}
