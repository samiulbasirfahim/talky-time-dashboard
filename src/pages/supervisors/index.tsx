import { UserPlus } from "lucide-react";
import { HeaderSection } from "../../components/header-section";
import { SuperVisorsCard } from "./supervisors-card";
import { SupervisorsTable } from "./supervisors-table";
import { TotalGroup } from "./total-group";

export function Supervisors() {
    return (
        <div>
            <HeaderSection
                title="Supervisors"
                description={`Orchestrate your operator teams and leadership hierarchy.`}
                buttons={[
                    {
                        label: "Add New Supervisor",
                        icon: UserPlus,
                        onClick: () => {
                            console.log("Pressed Add New Supervisor!");
                        },
                    },
                ]}
            />
            <SuperVisorsCard />
            <SupervisorsTable />
            <TotalGroup />
        </div>
    );
}
