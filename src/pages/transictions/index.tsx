
import { HeaderSection } from "../../components/header-section";
import { TransactionsDebtsTable } from "./transactions-debts-table";

export function Transactions() {
    return (
        <>
            <HeaderSection
                title="Transactions"
                description={`Performance analytics and group comparison`}
                buttons={[

                ]}
            />
            {/* <TransactionsCards /> */}
            <div className="p-4">
                <TransactionsDebtsTable />
            </div>
        </>
    );
}
