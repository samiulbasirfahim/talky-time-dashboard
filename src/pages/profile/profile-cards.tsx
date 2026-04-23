import { CircleCheck, LayoutGrid, TriangleAlert, UserRound } from "lucide-react";
import { StatCard, type StatCardProps } from "../../components/stat-card";
import { usePaginatedProfiles } from "../../lib/queries";



export function ProfileCards() {

        const {
            data: profileData,
            isPending: isProfilesPending,
            isError: isProfilesError,
        } = usePaginatedProfiles(1);




        const PROFILE_CARDS: StatCardProps[] = [

    {
        title: String(profileData?.total_profiles ?? 0),
        description: "TOTAL PROFILES",
        cardBackground: "bg-[#7744B31A]",
        icon: UserRound,
        iconBackground: "bg-[#EEDBFF]",
        iconColor: "text-[#7744B3]",
    },
    {
        title: String(profileData?.assigned_profiles ?? 0),
        description: "ASSIGNED PROFILES",
        cardBackground: "bg-[#16A34A1A]",
        icon: CircleCheck,
        iconBackground: "bg-[#DCFCE7]",
        iconColor: "text-[#16A34A]",
    },
    {
        title: String(profileData?.unassigned_profiles ?? 0),
        description: "UNASSIGNED PROFILES",
        cardBackground: "bg-[#DC26261A]",
        icon: TriangleAlert,
        iconBackground: "bg-[#FEE2E2]",
        iconColor: "text-[#DC2626]",
    },
];


    return (
        <div className="grid grid-cols-1 gap-3 px-4 md:grid-cols-2 xl:grid-cols-3">
            {PROFILE_CARDS.map((card) => (
                <StatCard key={card.description} {...card} />
            ))}
        </div>
    );
}
