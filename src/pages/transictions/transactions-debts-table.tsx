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
    date: string;
    category: DebtTab;
    reason?: string;
    status?: "approved" | "pending" | "rejected";
    warningCount?: number;
    warningLimit?: number;
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
    { id: "C-001", operatorName: "Jameson Doherty", operatorId: "#0001", amount: "$1,200.00", date: "Oct 14, 2023", status: "approved", category: "cash-advances" },
    { id: "C-002", operatorName: "Sarah Rosales", operatorId: "#0001", amount: "$450.00", date: "Oct 12, 2023", status: "pending", category: "cash-advances" },
    { id: "C-003", operatorName: "Michael Kurosawa", operatorId: "#0001", amount: "$2,800.00", date: "Oct 10, 2023", status: "approved", category: "cash-advances" },
    { id: "C-004", operatorName: "Anita Varga", operatorId: "#0001", amount: "$750.00", date: "Oct 09, 2023", status: "rejected", category: "cash-advances" },
    { id: "R-001", operatorName: "Alejandro Morales", operatorId: "#0001", amount: "$100,000", date: "Aug 12, 2023", warningCount: 1, warningLimit: 3, category: "reprimands" },
    { id: "R-002", operatorName: "Beatriz Pena", operatorId: "#0001", amount: "$100,000", date: "Aug 11, 2023", warningCount: 3, warningLimit: 3, category: "reprimands" },
    { id: "R-003", operatorName: "Carlos Rodriguez", operatorId: "#0001", amount: "$100,000", date: "Aug 10, 2023", warningCount: 3, warningLimit: 3, category: "reprimands" },
    { id: "R-004", operatorName: "Diana Salazar", operatorId: "#0001", amount: "$100,000", date: "Aug 09, 2023", warningCount: 3, warningLimit: 3, category: "reprimands" },
    { id: "R-005", operatorName: "Eduardo Vargas", operatorId: "#0001", amount: "$100,000", date: "Aug 08, 2023", warningCount: 3, warningLimit: 3, category: "reprimands" },
    { id: "DS-001", operatorName: "Alejandro Morales", operatorId: "#0001", amount: "$45,000", reason: "House rent", date: "Aug 12, 2023", category: "discount" },
    { id: "DS-002", operatorName: "Beatriz Pena", operatorId: "#0001", amount: "$15,000", reason: "Advance Salary", date: "Aug 11, 2023", category: "discount" },
    { id: "DS-003", operatorName: "Carlos Rodriguez", operatorId: "#0001", amount: "$30,000", reason: "House rent", date: "Aug 10, 2023", category: "discount" },
    { id: "DS-004", operatorName: "Jameson Doherty", operatorId: "#0001", amount: "$60,000", reason: "House rent", date: "Aug 09, 2023", category: "discount" },
    { id: "DS-005", operatorName: "Diana Salazar", operatorId: "#0001", amount: "$15,000", reason: "House rent", date: "Aug 08, 2023", category: "discount" },
];

const SHARED_ACTION_COLUMN: TableColumn<DebtRow> = {
    key: "actions",
    header: "Actions",
    align: "right",
    render: (row) => (
        <TableActions
            onEdit={() => {
                console.log("edit row", row.id);
            }}
            onDelete={() => {
                console.log("delete row", row.id);
            }}
        />
    ),
};

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
        ...SHARED_ACTION_COLUMN,
    },
];

const CASH_ADVANCE_COLUMNS: TableColumn<DebtRow>[] = [
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
        key: "date",
        header: "Date",
        render: (row) => <AppText variant="description">{row.date}</AppText>,
    },
    {
        key: "status",
        header: "Status",
        render: (row) => {
            const statusMap: Record<NonNullable<DebtRow["status"]>, string> = {
                approved: "bg-bg-focus text-text-focus",
                pending: "bg-bg-secondary text-text-secondary",
                rejected: "bg-red-light text-red",
            };
            const status = row.status ?? "pending";

            return (
                <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusMap[status]}`}>
                    {status}
                </span>
            );
        },
    },
    {
        ...SHARED_ACTION_COLUMN,
    },
];

const REPRIMAND_COLUMNS: TableColumn<DebtRow>[] = [
    {
        key: "operator",
        header: "Operator Name",
        render: (row) => <TableIdentity name={row.operatorName} sub={`ID: ${row.operatorId}`} />,
    },
    {
        key: "amount",
        header: "Total Deduction (COP)",
        render: (row) => (
            <AppText variant="body" className="font-semibold">
                {row.amount}
            </AppText>
        ),
    },
    {
        key: "warnings",
        header: "Warning Count",
        render: (row) => {
            const warningCount = row.warningCount ?? 0;
            const warningLimit = row.warningLimit ?? 3;

            return (
                <div className="inline-flex items-center gap-2">
                    <div className="flex items-center gap-1">
                        {Array.from({ length: warningLimit }).map((_, index) => (
                            <span
                                key={`${row.id}-dot-${index}`}
                                className={`h-2 w-2 rounded-full ${index < warningCount ? "bg-red" : "bg-border"}`}
                            />
                        ))}
                    </div>

                    <AppText variant="description" className="font-semibold text-red" style={{
                        color: "var(--color-text-red)"
                    }}>
                        {warningCount}/{warningLimit}
                    </AppText>
                </div>
            );
        },
    },
    {
        key: "date",
        header: "Date",
        render: (row) => <AppText variant="description">{row.date}</AppText>,
    },
    {
        ...SHARED_ACTION_COLUMN,
        header: "Action",
    },
];

const DISCOUNT_COLUMNS: TableColumn<DebtRow>[] = [
    {
        key: "operator",
        header: "Operator Name",
        render: (row) => <TableIdentity name={row.operatorName} sub={`ID: ${row.operatorId}`} />,
    },
    {
        key: "amount",
        header: "Amount (COP)",
        render: (row) => (
            <AppText variant="body" className="font-semibold">
                {row.amount}
            </AppText>
        ),
    },
    {
        key: "date",
        header: "Date",
        render: (row) => <AppText variant="description">{row.date}</AppText>,
    },
    {
        key: "reason",
        header: "Reason",
        render: (row) => <AppText variant="description">{row.reason}</AppText>,
    },
    {
        ...SHARED_ACTION_COLUMN,
        header: "Action",
    },
];

const TAB_CONFIG: Record<DebtTab, {
    columns: TableColumn<DebtRow>[];
    emptyText: string;
    addLabel: string;
    itemLabel: string;
}> = {
    debts: {
        columns: DEBT_COLUMNS,
        emptyText: "No debt records found.",
        addLabel: "Add Debt",
        itemLabel: "records",
    },
    "cash-advances": {
        columns: CASH_ADVANCE_COLUMNS,
        emptyText: "No cash advance records found.",
        addLabel: "Add Cash Advances",
        itemLabel: "transactions",
    },
    reprimands: {
        columns: REPRIMAND_COLUMNS,
        emptyText: "No reprimands found.",
        addLabel: "Add Reprimands",
        itemLabel: "operators with reprimands",
    },
    discount: {
        columns: DISCOUNT_COLUMNS,
        emptyText: "No discount records found.",
        addLabel: "Add Discounts",
        itemLabel: "operators",
    },
};

export function TransactionsDebtsTable() {
    const [activeTab, setActiveTab] = useState<DebtTab>("debts");
    const [currentPage, setCurrentPage] = useState(1);
    const activeTabConfig = TAB_CONFIG[activeTab];

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
            columns={activeTabConfig.columns}
            data={paginatedData}
            rowKey={(row) => row.id}
            emptyText={activeTabConfig.emptyText}
            tableAdditionalHeader={
                <div className="flex items-center justify-between px-4 pt-3">
                    <div className="flex items-center gap-6">
                        {TAB_ITEMS.map((tab) => (
                            <button
                                key={tab.key}
                                type="button"
                                onClick={() => handleChangeTab(tab.key)}
                                className={`mb-1 border-b-2 pb-1 text-sm font-medium transition-colors cursor-pointer ${
                                    activeTab === tab.key
                                        ? "border-b-text-focus text-text-focus"
                                        : "border-b-transparent text-text-secondary"
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
                            console.log(activeTabConfig.addLabel);
                        }}
                        className="mb-2"
                    >
                        {activeTabConfig.addLabel}
                    </AppButton>
                </div>
            }
            pagination={{
                currentPage,
                totalItems: filteredData.length,
                pageSize: PAGE_SIZE,
                onPageChange: setCurrentPage,
                itemLabel: activeTabConfig.itemLabel,
            }}
        />
    );
}
