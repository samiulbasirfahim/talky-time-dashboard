import { GitBranch, Upload } from "lucide-react";
import { HeaderSection } from "../../components/header-section";
import { DashboardCards } from "./dashbaord-cards";
import { PaymentTrends_TotalGroups } from "./payment-trends-total-groups";
import { RecentActivity_SystemEvents } from "./recent-activity-system-events";
import { useNavigate } from "react-router";
import { useShiftStatus } from "../../hooks/use-shift-status";

export function Dashboard() {
    const navigate = useNavigate();
    const { isDayShift, now } = useShiftStatus();

    const formattedDate = now.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
    });

    const shift = isDayShift ? "Day Shift" : "Night Shift";

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
                            navigate("/csv-upload");
                        },
                    },
                    {
                        label: "Assign Profiles",
                        icon: GitBranch,
                        onClick: () => {
                            console.log("Assigning Profiles!");
                            navigate("/profile");
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
