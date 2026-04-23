import { Network, Users } from "lucide-react";
import { StatCardContainer } from "../../components/stat-card-container";
import { useAllGroups, usePaginatedSupervisors } from "../../lib/queries";
import { StatCard } from "../../components/stat-card";

export function SuperVisorsCard() {

    const {
        data: supervisors,
        isLoading
    } = usePaginatedSupervisors(1);
    const { data: groups } = useAllGroups();


    const cards = [
        {
            title: isLoading ? "..." : String(supervisors?.results?.length),
            description: "Total Supervisors",
            cardBackground: "bg-[#234EB71A]",
            icon: Users,
            iconBackground: "bg-[#98B9F233]",
            iconColor: "text-[#2C61E5]",
        },
        {
            title: isLoading ? "..." : String(groups?.results?.length),
            description: "Active Groups",
            cardBackground: "bg-[#AA6DEC1A]",
            icon: Network,
            iconBackground: "bg-[#AA6DEC1A]",
            iconColor: "text-[#AA6DEC]",
        }
    ]

    return (
        // <StatCardContainer
        //     cards={}
        // />
        <div className="grid w-full grid-cols-1 gap-3 px-4 md:grid-cols-2">
            {cards.map((card, index) => (
                <StatCard key={index} {...card} />
            ))}
        </div>
    );
}
