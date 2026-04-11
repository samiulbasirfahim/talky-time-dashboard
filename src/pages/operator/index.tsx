import { UserPlus } from "lucide-react";
import { HeaderSection } from "../../components/header-section";
import { OperatorCards } from "./operator-cards";
import { OperatorsTable } from "./operataor-table";

export function Operator() {
    return (
        <>
            <HeaderSection
                title="Operator"
                description={`Manage, monitor, and optimize your global workforce.`}
                buttons={[
                    {
                        label: "Add New Operator",
                        icon: UserPlus,
                        onClick: () => {
                            console.log("Pressed Add New Operator!");
                        },
                    },
                ]}
            />
            <OperatorCards />
            <OperatorsTable />
        </>
    );
}
