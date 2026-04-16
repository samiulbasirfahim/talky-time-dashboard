import { Download } from "lucide-react";
import { HeaderSection } from "../../components/header-section";
import { PayoutsCards } from "./payouts-cards";
import { PayoutSecondaryCard } from "./payoutsecondarycard";
import { PayoutsTable } from "./payouts-table";

export function Payouts() {
    return (
        <>
            <HeaderSection
                title="Payouts"
                description={`Performance analytics and group comparison`}
                buttons={[
                    {
                        label: "Download Payout Report",
                        icon: Download,
                        onClick: () => {
                            console.log("Pressed Download Payout Report!");
                        },
                    },
                ]}
            />

            <PayoutsCards />
            <PayoutSecondaryCard />

            <div className="p-4">
                <PayoutsTable />
            </div>
        </>
    );
}
