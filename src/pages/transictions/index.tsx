import { Plus } from "lucide-react";
import { HeaderSection } from "../../components/header-section";
import { TransactionsDebtsTable } from "./transactions-debts-table";

export function Transactions() {
    return (
        <>
            <HeaderSection
                title="Transactions"
                description={`Performance analytics and group comparison`}
                buttons={[
                    {
                        label: "Add Transactions",
                        icon: Plus,
                        onClick: () => {
                            console.log("Pressed Add Transactions!");
                        },
                    },
                ]}
            />

            <div className="p-4">
                <TransactionsDebtsTable />
            </div>
        </>
    );
}
