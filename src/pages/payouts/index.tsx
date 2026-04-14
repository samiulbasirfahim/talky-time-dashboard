import { Plus } from "lucide-react";
import { HeaderSection } from "../../components/header-section";
import { PayoutsCards } from "./payouts-cards";
import { PayoutsTable } from "./payouts-table";

export function Payouts() {
    return (
        <>
            <HeaderSection
                title="Payouts"
                description={`Performance analytics and group comparison`}
                buttons={[
                    {
                        label: "Add Payments",
                        icon: Plus,
                        onClick: () => {
                            console.log("Pressed Add Payments!");
                        },
                    },
                ]}
            />

            <PayoutsCards />

            <div className="p-4">
                <PayoutsTable />
            </div>
        </>
    );
}
