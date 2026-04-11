import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { AppButton } from "../../components/button";
import {
    AppTable,
    TableActions,
    TableIdentity,
    type TableColumn,
} from "../../components/table";
import { AppText } from "../../components/text";

type DebtTab = "debts" | "cash-advances" | "reprimands" | "discount";

interface DebtRow {
    id: string;
    operatorName: string;
    operatorId: string;
    amount: string;
    reason: string;
    date: string;
    category: DebtTab;
}

const PAGE_SIZE = 4;

const TAB_ITEMS: Array<{ key: DebtTab; label: string }> = [
    { key: "debts", label: "Debts" },
    { key: "cash-advances", label: "Cash Advances" },
    { key: "reprimands", label: "Reprimands" },
    { key: "discount", label: "Discount" },
];

const MOCK_DEBT_ROWS: DebtRow[] = [
    { id: "D-001", operatorName: "Alex Martinez", operatorId: "#0001", amount: "$1,200.00", reason: "Equipment Damage", date: "Oct 12, 2023", category: "debts" },
    { id: "D-002", operatorName: "Sarah Chen", operatorId: "#0002", amount: "$450.00", reason: "Uniform Replacement", date: "Oct 10, 2023", category: "debts" },
    { id: "D-003", operatorName: "James Wilson", operatorId: "#0003", amount: "$2,800.00", reason: "Training Fee", date: "Oct 05, 2023", category: "debts" },
    { id: "D-004", operatorName: "Rosa Rodriguez", operatorId: "#0004", amount: "$150.00", reason: "Unreturned Tool", date: "Oct 02, 2023", category: "debts" },
    { id: "C-001", operatorName: "Nina Clarke", operatorId: "#0012", amount: "$300.00", reason: "Advance for medical", date: "Sep 29, 2023", category: "cash-advances" },
    { id: "C-002", operatorName: "Mina Arif", operatorId: "#0018", amount: "$220.00", reason: "Travel support", date: "Sep 27, 2023", category: "cash-advances" },
    { id: "R-001", operatorName: "Liam Noor", operatorId: "#0025", amount: "$50.00", reason: "Late shift handover", date: "Sep 25, 2023", category: "reprimands" },
    { id: "R-002", operatorName: "Ivy Rahman", operatorId: "#0028", amount: "$75.00", reason: "Repeated SLA miss", date: "Sep 21, 2023", category: "reprimands" },
    { id: "DS-001", operatorName: "Khalid Omar", operatorId: "#0031", amount: "$120.00", reason: "Attendance discount", date: "Sep 20, 2023", category: "discount" },
    { id: "DS-002", operatorName: "Ava Roy", operatorId: "#0034", amount: "$90.00", reason: "Policy-based deduction", date: "Sep 18, 2023", category: "discount" },
];

const DEBT_COLUMNS: TableColumn<DebtRow>[] = [
    {
        key: "operator",
        header: "Operator Name",
        render: (row) => <TableIdentity name={row.operatorName} sub={`ID: ${row.operatorId}`} />,
    },
    {
        key: "amount",
        header: "Amount",
        render: (row) => (
            <AppText variant="body" className="font-semibold">
                {row.amount}
            </AppText>
        ),
    },
    {
        key: "reason",
        header: "Reason",
        render: (row) => (
            <span className="inline-flex rounded-full bg-bg-secondary px-3 py-1 text-xs font-semibold text-text-secondary">
                {row.reason}
            </span>
        ),
    },
    {
        key: "date",
        header: "Date",
        render: (row) => <AppText variant="description">{row.date}</AppText>,
    },
    {
        key: "actions",
        header: "Actions",
        align: "right",
        render: (row) => (
            <TableActions
                onEdit={() => {
                    console.log("edit debt", row.id);
                }}
                onDelete={() => {
                    console.log("delete debt", row.id);
                }}
            />
        ),
    },
];

export function DisciplineDebtsTable() {
    const [activeTab, setActiveTab] = useState<DebtTab>("debts");
    const [currentPage, setCurrentPage] = useState(1);

    const filteredData = useMemo(
        () => MOCK_DEBT_ROWS.filter((row) => row.category === activeTab),
        [activeTab],
    );

    const paginatedData = filteredData.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE,
    );

    const handleChangeTab = (tab: DebtTab) => {
        setActiveTab(tab);
        setCurrentPage(1);
    };

    return (
        <AppTable
            columns={DEBT_COLUMNS}
            data={paginatedData}
            rowKey={(row) => row.id}
            emptyText="No debt records found."
            tableAdditionalHeader={
                <div className="flex items-center justify-between border-b border-border px-4 pt-3">
                    <div className="flex items-center gap-6">
                        {TAB_ITEMS.map((tab) => (
                            <button
                                key={tab.key}
                                type="button"
                                onClick={() => handleChangeTab(tab.key)}
                                className={`pb-1 mb-1 text-sm font-medium transition-colors cursor-pointer ${
                                    activeTab === tab.key
                                        ? "text-text-focus border-b-2 border-b-text-focus"
                                        : "text-text-secondary border-b-2 border-b-transparent"
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <AppButton
                        variant="focus"
                        size="sm"
                        prefixIcon={Plus}
                        onClick={() => {
                            console.log("Add Debt");
                        }}
                        className="mb-2"
                    >
                        Add Debt
                    </AppButton>
                </div>
            }
            pagination={{
                currentPage,
                totalItems: filteredData.length,
                pageSize: PAGE_SIZE,
                onPageChange: setCurrentPage,
                itemLabel: "records",
            }}
        />
    );
}
