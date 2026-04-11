import {
    ArrowUp,
    ChartNoAxesCombined,
    CircleDollarSign,
    CircleUser,
    User,
} from "lucide-react";
import { StatCardContainer } from "../../components/stat-card-container";

export function DashboardCards() {
    return (
        <StatCardContainer
            cards={[
                {
                    title: "$2,550",
                    description: "Total Bonuses Today",
                    badge: "+14%",
                    badgeBackground: "bg-[#D8E3F6]",
                    badgeTextColor: "text-[#2C61E5]",
                    cardBackground: "bg-[#6388E31A]",
                    icon: CircleDollarSign,
                    iconBackground: "bg-[#98B9F233]",
                    iconColor: "text-[#2C61E5]",
                    badgePrefixIcon: ArrowUp,
                },
                {
                    title: "5",
                    description: "Active Operators",
                    badge: "+1",
                    badgeBackground: "bg-[#D6E1F5]",
                    badgeTextColor: "text-[#1A3B5F]",
                    cardBackground: "bg-[#EAF1FC]",
                    icon: User,
                    iconBackground: "bg-[#234EB71A]",
                    iconColor: "text-[#2C61E5]",
                    badgePrefixIcon: ArrowUp,
                },
                {
                    title: "9",
                    description: "Active Profiles",
                    cardBackground: "bg-[#AA6DEC1A]",
                    icon: CircleUser,
                    iconBackground: "bg-[#AA6DEC33]",
                    iconColor: "text-[#AA6DEC]",
                },
                {
                    title: "$6,3456",
                    description: "Estimated Payout",
                    badge: "+8%",
                    badgeBackground: "bg-[#FFFFFF]",
                    badgeTextColor: "text-[#16A34A]",
                    cardBackground: "bg-[#16A34A1A]",
                    icon: ChartNoAxesCombined,
                    iconBackground: "bg-[#16A34A33]",
                    iconColor: "text-[#059669]",
                    badgePrefixIcon: ArrowUp,
                },
            ]}
        />
    );
}
