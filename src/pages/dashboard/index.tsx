import { GitBranch, Upload } from "lucide-react";
import { HeaderSection } from "../../components/header-section";
import { DashboardCards } from "./dashbaord-cards";
import { PaymentTrends_TotalGroups } from "./payment-trends-total-groups";
import { RecentActivity_SystemEvents } from "./recent-activity-system-events";

export function Dashboard() {
    const date = new Date();

    const formattedDate = date.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
    });

    const currentHour = date.getHours();
    const shift =
        currentHour >= 7 && currentHour < 19 ? "Day Shift" : "Night Shift";

    return (
        <div>
            <HeaderSection
                title="Dashboard"
                description={`${formattedDate} - ${shift}`}
                buttons={[
                    {
                        label: "Upload CSV",
                        icon: Upload,
                        onClick: () => {
                            console.log("Uploading CSV!");
                        },
                    },
                    {
                        label: "Assign Profiles",
                        icon: GitBranch,
                        onClick: () => {
                            console.log("Assigning Profiles!");
                        },
                    },
                ]}
            />
            <DashboardCards />
            <PaymentTrends_TotalGroups />
            <RecentActivity_SystemEvents />
        </div>
    );
}
