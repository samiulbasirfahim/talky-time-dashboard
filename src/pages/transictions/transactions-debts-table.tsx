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
import {
    CashAdvanceModal,
    type CashAdvanceFormValues,
    type CashAdvanceOperatorOption,
} from "./cash-advance-modal";
import {
    DiscountModal,
    type DiscountFormValues,
    type DiscountOperatorOption,
} from "./discount-modal";
import {
    DebtFormModal,
    type DebtFormValues,
    type DebtOperatorOption,
} from "./debt-form-modal";

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
    expiryDate?: string;
    interestRate?: string;
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

const TAB_CONFIG: Record<DebtTab, {
    emptyText: string;
    addLabel: string | null;
    itemLabel: string;
}> = {
    debts: {
        emptyText: "No debt records found.",
        addLabel: "Add Debt",
        itemLabel: "records",
    },
    "cash-advances": {
        emptyText: "No cash advance records found.",
        addLabel: "Add Cash Advances",
        itemLabel: "transactions",
    },
    reprimands: {
        emptyText: "No reprimands found.",
        addLabel: null,
        itemLabel: "operators with reprimands",
    },
    discount: {
        emptyText: "No discount records found.",
        addLabel: "Add Discounts",
        itemLabel: "operators",
    },
};

const CATEGORY_ID_PREFIX: Record<DebtTab, string> = {
    debts: "D",
    "cash-advances": "C",
    reprimands: "R",
    discount: "DS",
};

const toInputDate = (displayDate: string) => {
    const parsed = new Date(displayDate);
    if (Number.isNaN(parsed.getTime())) return "";
    return parsed.toISOString().slice(0, 10);
};

const toDisplayDate = (inputDate: string) => {
    const parsed = new Date(`${inputDate}T00:00:00`);
    if (Number.isNaN(parsed.getTime())) return "";
    return parsed.toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
    });
};

const normalizeAmount = (amount: string) => {
    const numeric = Number(amount);
    if (!Number.isFinite(numeric)) return "$0.00";

    return numeric.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
    });
};

const parseAmount = (amount: string) => amount.replace(/[^0-9.]/g, "");

const buildActionColumn = (
    onEdit: (row: DebtRow) => void,
    onDelete: (row: DebtRow) => void,
): TableColumn<DebtRow> => ({
    key: "actions",
    header: "Actions",
    align: "right",
    render: (row) => (
        <TableActions
            onEdit={() => onEdit(row)}
            onDelete={() => onDelete(row)}
        />
    ),
});

const buildDebtColumns = (
    onEdit: (row: DebtRow) => void,
    onDelete: (row: DebtRow) => void,
): TableColumn<DebtRow>[] => [
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
        buildActionColumn(onEdit, onDelete),
    ];

const buildCashAdvanceColumns = (
    onEdit: (row: DebtRow) => void,
    onDelete: (row: DebtRow) => void,
): TableColumn<DebtRow>[] => [
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
        buildActionColumn(onEdit, onDelete),
    ];

const buildReprimandColumns = (
    onEdit: (row: DebtRow) => void,
    onDelete: (row: DebtRow) => void,
): TableColumn<DebtRow>[] => [
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

                        <AppText
                            variant="description"
                            className="font-semibold text-red"
                            style={{ color: "var(--color-text-red)" }}
                        >
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
            ...buildActionColumn(onEdit, onDelete),
            header: "Action",
        },
    ];

const buildDiscountColumns = (
    onEdit: (row: DebtRow) => void,
    onDelete: (row: DebtRow) => void,
): TableColumn<DebtRow>[] => [
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
            ...buildActionColumn(onEdit, onDelete),
            header: "Action",
        },
    ];

export function TransactionsDebtsTable() {
    const [activeTab, setActiveTab] = useState<DebtTab>("debts");
    const [currentPage, setCurrentPage] = useState(1);
    const [rows, setRows] = useState<DebtRow[]>(MOCK_DEBT_ROWS);
    const [showDebtModal, setShowDebtModal] = useState(false);
    const [showCashAdvanceModal, setShowCashAdvanceModal] = useState(false);
    const [showDiscountModal, setShowDiscountModal] = useState(false);
    const [editingRow, setEditingRow] = useState<DebtRow | null>(null);

    const activeTabConfig = TAB_CONFIG[activeTab];

    const filteredData = useMemo(
        () => rows.filter((row) => row.category === activeTab),
        [rows, activeTab],
    );

    const paginatedData = filteredData.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE,
    );

    const operatorOptions = useMemo<DebtOperatorOption[]>(() => {
        const optionMap = new Map<string, DebtOperatorOption>();

        rows.forEach((row) => {
            if (optionMap.has(row.operatorId)) return;

            optionMap.set(row.operatorId, {
                value: row.operatorId,
                label: row.operatorId,
                subtitle: row.operatorName,
                operatorName: row.operatorName,
                groupName: "",
                keywords: [row.operatorName, row.operatorId],
            });
        });

        return Array.from(optionMap.values());
    }, [rows]);

    const cashAdvanceOperatorOptions = useMemo<CashAdvanceOperatorOption[]>(
        () => operatorOptions,
        [operatorOptions],
    );

    const discountOperatorOptions = useMemo<DiscountOperatorOption[]>(
        () => operatorOptions,
        [operatorOptions],
    );

    const handleChangeTab = (tab: DebtTab) => {
        setActiveTab(tab);
        setCurrentPage(1);
    };

    const handleCreateEntry = () => {
        setEditingRow(null);

        if (activeTab === "cash-advances") {
            setShowCashAdvanceModal(true);
            return;
        }

        if (activeTab === "discount") {
            setShowDiscountModal(true);
            return;
        }

        setShowDebtModal(true);
    };

    const handleEditEntry = (row: DebtRow) => {
        setEditingRow(row);

        if (row.category === "cash-advances") {
            setShowCashAdvanceModal(true);
            return;
        }

        if (row.category === "discount") {
            setShowDiscountModal(true);
            return;
        }

        setShowDebtModal(true);
    };

    const handleDeleteDebt = (row: DebtRow) => {
        setRows((prev) => {
            const nextRows = prev.filter((item) => item.id !== row.id);
            const filteredRemaining = nextRows.filter((item) => item.category === activeTab);
            const totalPages = Math.max(1, Math.ceil(filteredRemaining.length / PAGE_SIZE));
            if (currentPage > totalPages) setCurrentPage(totalPages);
            return nextRows;
        });
    };

    const columnsByTab: Record<DebtTab, TableColumn<DebtRow>[]> = {
        debts: buildDebtColumns(handleEditEntry, handleDeleteDebt),
        "cash-advances": buildCashAdvanceColumns(handleEditEntry, handleDeleteDebt),
        reprimands: buildReprimandColumns(handleEditEntry, handleDeleteDebt),
        discount: buildDiscountColumns(handleEditEntry, handleDeleteDebt),
    };

    const handleCloseDebtModal = () => {
        setShowDebtModal(false);
        setEditingRow(null);
    };

    const handleCloseCashAdvanceModal = () => {
        setShowCashAdvanceModal(false);
        setEditingRow(null);
    };

    const handleCloseDiscountModal = () => {
        setShowDiscountModal(false);
        setEditingRow(null);
    };

    const handleSubmitDebt = (values: DebtFormValues) => {
        const payload: Omit<DebtRow, "id" | "category"> = {
            operatorName: values.operatorName,
            operatorId: values.operatorId,
            amount: normalizeAmount(values.amount),
            date: toDisplayDate(values.issueDate),
            reason: values.reason,
            status: undefined,
            warningCount: activeTab === "reprimands" ? 1 : undefined,
            warningLimit: activeTab === "reprimands" ? 3 : undefined,
            expiryDate: undefined,
            interestRate: undefined,
        };

        if (editingRow) {
            setRows((prev) =>
                prev.map((row) => (row.id === editingRow.id ? { ...row, ...payload } : row)),
            );
            handleCloseDebtModal();
            return;
        }

        const prefix = CATEGORY_ID_PREFIX[activeTab];
        const existingCount = rows.filter((row) => row.category === activeTab).length;
        const nextId = `${prefix}-${String(existingCount + 1).padStart(3, "0")}`;

        setRows((prev) => [
            {
                id: nextId,
                category: activeTab,
                ...payload,
            },
            ...prev,
        ]);

        setCurrentPage(1);
        handleCloseDebtModal();
    };

    const handleSubmitCashAdvance = (values: CashAdvanceFormValues) => {
        const payload: Omit<DebtRow, "id" | "category"> = {
            operatorName: values.operatorName,
            operatorId: values.operatorId,
            amount: normalizeAmount(values.amount),
            date: toDisplayDate(values.issueDate),
            reason: values.reason,
            status: "pending",
            warningCount: undefined,
            warningLimit: undefined,
            expiryDate: toDisplayDate(values.expiryDate),
            interestRate: values.interestRate,
        };

        if (editingRow) {
            setRows((prev) =>
                prev.map((row) => (row.id === editingRow.id ? { ...row, ...payload } : row)),
            );
            handleCloseCashAdvanceModal();
            return;
        }

        const prefix = CATEGORY_ID_PREFIX["cash-advances"];
        const existingCount = rows.filter((row) => row.category === "cash-advances").length;
        const nextId = `${prefix}-${String(existingCount + 1).padStart(3, "0")}`;

        setRows((prev) => [
            {
                id: nextId,
                category: "cash-advances",
                ...payload,
            },
            ...prev,
        ]);

        setCurrentPage(1);
        handleCloseCashAdvanceModal();
    };

    const handleSubmitDiscount = (values: DiscountFormValues) => {
        const payload: Omit<DebtRow, "id" | "category"> = {
            operatorName: values.operatorName,
            operatorId: values.operatorId,
            amount: normalizeAmount(values.amount),
            date: toDisplayDate(values.issueDate),
            reason: values.reason,
            status: undefined,
            warningCount: undefined,
            warningLimit: undefined,
            expiryDate: undefined,
            interestRate: undefined,
        };

        if (editingRow) {
            setRows((prev) =>
                prev.map((row) => (row.id === editingRow.id ? { ...row, ...payload } : row)),
            );
            handleCloseDiscountModal();
            return;
        }

        const prefix = CATEGORY_ID_PREFIX.discount;
        const existingCount = rows.filter((row) => row.category === "discount").length;
        const nextId = `${prefix}-${String(existingCount + 1).padStart(3, "0")}`;

        setRows((prev) => [
            {
                id: nextId,
                category: "discount",
                ...payload,
            },
            ...prev,
        ]);

        setCurrentPage(1);
        handleCloseDiscountModal();
    };

    const defaultValues: Partial<DebtFormValues> | undefined = editingRow
        ? {
            operatorName: editingRow.operatorName,
            operatorId: editingRow.operatorId,
            groupName: "",
            reason: editingRow.reason ?? "",
            amount: parseAmount(editingRow.amount),
            issueDate: toInputDate(editingRow.date),
        }
        : undefined;

    const cashAdvanceDefaultValues: Partial<CashAdvanceFormValues> | undefined = editingRow
        ? {
            operatorName: editingRow.operatorName,
            operatorId: editingRow.operatorId,
            groupName: "",
            reason: editingRow.reason ?? "",
            amount: parseAmount(editingRow.amount),
            issueDate: toInputDate(editingRow.date),
            expiryDate: toInputDate(editingRow.expiryDate ?? ""),
            interestRate: editingRow.interestRate ?? "21",
        }
        : undefined;

    const discountDefaultValues: Partial<DiscountFormValues> | undefined = editingRow
        ? {
            operatorName: editingRow.operatorName,
            operatorId: editingRow.operatorId,
            groupName: "",
            reason: editingRow.reason ?? "",
            amount: parseAmount(editingRow.amount),
            issueDate: toInputDate(editingRow.date),
        }
        : undefined;

    return (
        <>
            <AppTable
                columns={columnsByTab[activeTab]}
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
                                    className={`mb-1 border-b-2 pb-1 text-sm font-medium transition-colors cursor-pointer ${activeTab === tab.key
                                            ? "border-b-text-focus text-text-focus"
                                            : "border-b-transparent text-text-secondary"
                                        }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                            <div className="h-12">
                                     {
                            activeTabConfig.addLabel && (
                                <AppButton
                                    variant="focus"
                                    size="sm"
                                    prefixIcon={Plus}
                                    onClick={handleCreateEntry}
                                    className="mb-2"
                                >
                                    {activeTabConfig.addLabel}
                                </AppButton>
                            )
                        }
                            </div>
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

            <DebtFormModal
                open={showDebtModal}
                onClose={handleCloseDebtModal}
                onSubmit={handleSubmitDebt}
                defaultValues={defaultValues}
                operatorOptions={operatorOptions}
            />

            <CashAdvanceModal
                open={showCashAdvanceModal}
                onClose={handleCloseCashAdvanceModal}
                onSubmit={handleSubmitCashAdvance}
                defaultValues={cashAdvanceDefaultValues}
                operatorOptions={cashAdvanceOperatorOptions}
            />

            <DiscountModal
                open={showDiscountModal}
                onClose={handleCloseDiscountModal}
                onSubmit={handleSubmitDiscount}
                defaultValues={discountDefaultValues}
                operatorOptions={discountOperatorOptions}
            />
        </>
    );
}
