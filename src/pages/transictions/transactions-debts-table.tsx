import { useEffect, useMemo, useState } from "react";
import { isAxiosError } from "axios";
import { Plus } from "lucide-react";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router";
import { AppButton } from "../../components/button";
import {
    AppTable,
    TableActions,
    TableIdentity,
    type TableColumn,
} from "../../components/table";
import { AppText } from "../../components/text";
import {
    useCreateCashAdvance,
    useCreateDiscount,
    DISCIPLINE_REPRIMAND_PAGE_SIZE,
    useDeleteCashAdvance,
    useDeleteDiscount,
    useCreateDebt,
    useDeleteDebt,
    usePaginatedDiscounts,
    usePaginatedCashAdvances,
    usePaginatedDebts,
    usePaginatedDisciplinaryReprimands,
    useUpdateDiscount,
    useUpdateCashAdvance,
    useUpdateDebt,
} from "../../lib/queries";
import {
    CashAdvanceModal,
    type CashAdvanceFormValues,
} from "./cash-advance-modal";
import {
    DiscountModal,
    type DiscountFormValues,
} from "./discount-modal";
import {
    DebtFormModal,
    type DebtFormValues,
} from "./debt-form-modal";
import type { CashAdvanceItem, DebtItem, DiscountItem, DisciplinaryReprimandItem } from "../../type";

type DebtTab = "debts" | "cash-advances" | "reprimands" | "discount";

interface DebtRow {
    id: string;
    operatorDbId?: string;
    operatorName: string;
    operatorId: string;
    groupName?: string;
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

type DiscountValidationErrors = {
    amount_cop?: string[];
    operator_id?: string[];
    adjustment_date?: string[];
    description?: string[];
    detail?: string | string[];
    non_field_errors?: string[];
    [key: string]: string[] | string | undefined;
};

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

const VALID_TABS = new Set<DebtTab>(["debts", "cash-advances", "reprimands", "discount"]);

const parseTabFromHash = (hash: string): DebtTab | null => {
    const normalized = hash.replace("#", "").trim() as DebtTab;

    if (VALID_TABS.has(normalized)) {
        return normalized;
    }

    return null;
};

const toDisplayDateSafe = (value?: string) => {
    if (!value) return "-";

    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return value;

    return parsed.toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
    });
};

const parseCopAmount = (item: DisciplinaryReprimandItem) => {
    const raw = item.total_deduction ?? item.amount_cop ?? item.deduction_amount;
    const numeric = typeof raw === "number" ? raw : Number(raw);

    if (!Number.isFinite(numeric)) return "0";

    return numeric.toLocaleString("en-US", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    });
};

const parseDebtCopAmount = (item: DebtItem) => {
    const raw = item.amount_cop ?? item.amount;
    const numeric = typeof raw === "number" ? raw : Number(raw);

    if (!Number.isFinite(numeric)) return "0";

    return numeric.toLocaleString("en-US", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    });
};

const parseCashAdvanceCopAmount = (item: CashAdvanceItem) => {
    const raw = item.amount_cop ?? item.amount;
    const numeric = typeof raw === "number" ? raw : Number(raw);

    if (!Number.isFinite(numeric)) return "0";

    return numeric.toLocaleString("en-US", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    });
};

const parseDiscountCopAmount = (item: DiscountItem) => {
    const raw = item.amount_cop ?? item.amount;
    const numeric = typeof raw === "number" ? raw : Number(raw);

    if (!Number.isFinite(numeric)) return "0";

    return numeric.toLocaleString("en-US", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    });
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

const toApiAmountCop = (amount: string) => {
    const numeric = Number(parseAmount(amount));

    if (!Number.isFinite(numeric) || numeric <= 0) {
        return "";
    }

    return numeric.toFixed(2);
};

const getFirstErrorMessage = (value: unknown): string | undefined => {
    if (Array.isArray(value) && value.length > 0 && typeof value[0] === "string") {
        return value[0];
    }

    if (typeof value === "string") {
        return value;
    }

    return undefined;
};

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
        buildActionColumn(onEdit, onDelete),
    ];

const buildReprimandColumns = (): TableColumn<DebtRow>[] => [
        {
            key: "operator",
            header: "Operator Name",
            render: (row) => (
                <AppText variant="body" className="font-semibold">
                    {row.operatorName}
                </AppText>
            ),
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
            header: "Reprimands Count",
            render: (row) => {
                const warningCount = row.warningCount ?? 0;

                return (
                    <AppText variant="body" className="font-semibold text-red">
                        {warningCount}
                    </AppText>
                );
            },
        },
        {
            key: "date",
            header: "Date",
            render: (row) => <AppText variant="description">{row.date}</AppText>,
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
    const location = useLocation();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<DebtTab>(() => parseTabFromHash(location.hash) ?? "debts");
    const [currentPage, setCurrentPage] = useState(1);
    const [rows, setRows] = useState<DebtRow[]>(MOCK_DEBT_ROWS);
    const [showDebtModal, setShowDebtModal] = useState(false);
    const [showCashAdvanceModal, setShowCashAdvanceModal] = useState(false);
    const [showDiscountModal, setShowDiscountModal] = useState(false);
    const [editingRow, setEditingRow] = useState<DebtRow | null>(null);
    const {
        data: reprimandsData,
        isLoading: isReprimandsLoading,
        isError: isReprimandsError,
    } = usePaginatedDisciplinaryReprimands(currentPage, activeTab === "reprimands");
    const {
        data: debtsData,
        isLoading: isDebtsLoading,
        isError: isDebtsError,
    } = usePaginatedDebts(currentPage, activeTab === "debts");
    const {
        data: cashAdvancesData,
        isLoading: isCashAdvancesLoading,
        isError: isCashAdvancesError,
    } = usePaginatedCashAdvances(currentPage, activeTab === "cash-advances");
    const {
        data: discountsData,
        isLoading: isDiscountsLoading,
        isError: isDiscountsError,
    } = usePaginatedDiscounts(currentPage, activeTab === "discount");
    const { mutateAsync: createDebt } = useCreateDebt();
    const { mutateAsync: updateDebt } = useUpdateDebt();
    const { mutateAsync: deleteDebt } = useDeleteDebt();
    const { mutateAsync: createCashAdvance } = useCreateCashAdvance();
    const { mutateAsync: updateCashAdvance } = useUpdateCashAdvance();
    const { mutateAsync: deleteCashAdvance } = useDeleteCashAdvance();
    const { mutateAsync: createDiscount } = useCreateDiscount();
    const { mutateAsync: updateDiscount } = useUpdateDiscount();
    const { mutateAsync: deleteDiscount } = useDeleteDiscount();

    const activeTabConfig = TAB_CONFIG[activeTab];

    useEffect(() => {
        const tabFromHash = parseTabFromHash(location.hash);

        if (!tabFromHash) {
            return;
        }

        setActiveTab(tabFromHash);
        setCurrentPage(1);
    }, [location.hash]);

    const filteredData = useMemo(
        () => rows.filter((row) => row.category === activeTab),
        [rows, activeTab],
    );

    const paginatedData = filteredData.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE,
    );

    const reprimandRows = useMemo<DebtRow[]>(() => {
        return (reprimandsData?.results ?? []).map((item) => ({
            id: String(item.operator_id ?? item.operator),
            operatorName: item.operator_name,
            operatorId: String(item.operator_id ?? item.operator),
            amount: parseCopAmount(item),
            date: toDisplayDateSafe(item.latest_reprimand_date),
            category: "reprimands",
            warningCount: item.reprimand_count ?? 0,
            warningLimit: undefined,
        }));
    }, [reprimandsData]);

    const debtRows = useMemo<DebtRow[]>(() => {
        return (debtsData?.results ?? []).map((item) => ({
            id: String(item.id),
            operatorDbId: String(item.operator_db_id ?? item.operator),
            operatorName: item.operator_name,
            operatorId: item.operator_id,
            groupName: item.group,
            amount: parseDebtCopAmount(item),
            date: toDisplayDateSafe(item.adjustment_date ?? item.issue_date ?? item.date),
            category: "debts",
            reason: item.reason || item.description,
        }));
    }, [debtsData]);

    const cashAdvanceRows = useMemo<DebtRow[]>(() => {
        return (cashAdvancesData?.results ?? []).map((item) => ({
            id: String(item.id),
            operatorDbId: String(item.operator_db_id ?? item.operator),
            operatorName: item.operator_name,
            operatorId: item.operator_id,
            groupName: item.group_name,
            amount: parseCashAdvanceCopAmount(item),
            date: toDisplayDateSafe(item.adjustment_date ?? item.issue_date ?? item.date),
            category: "cash-advances",
            reason: item.reason || item.description,
            status: "pending",
        }));
    }, [cashAdvancesData]);

    const discountRows = useMemo<DebtRow[]>(() => {
        return (discountsData?.results ?? []).map((item) => ({
            id: String(item.id),
            operatorDbId: String(item.operator_db_id ?? item.operator),
            operatorName: item.operator_name,
            operatorId: item.operator_id,
            groupName: item.group,
            amount: parseDiscountCopAmount(item),
            date: toDisplayDateSafe(item.adjustment_date ?? item.issue_date ?? item.date),
            category: "discount",
            reason: item.reason || item.description,
        }));
    }, [discountsData]);

    const handleChangeTab = (tab: DebtTab) => {
        setActiveTab(tab);
        setCurrentPage(1);
        navigate({ hash: tab }, { replace: true });
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

    const handleDeleteDebt = async (row: DebtRow) => {
        if (row.category === "debts") {
            const debtId = Number(row.id);

            if (!Number.isFinite(debtId)) {
                toast.error("Invalid debt id.");
                return;
            }

            try {
                await deleteDebt(debtId);
                toast.success("Debt deleted successfully.");
            } catch {
                toast.error("Failed to delete debt. Please try again.");
            }

            return;
        }

        if (row.category === "cash-advances") {
            const cashAdvanceId = Number(row.id);

            if (!Number.isFinite(cashAdvanceId)) {
                toast.error("Invalid cash advance id.");
                return;
            }

            try {
                await deleteCashAdvance(cashAdvanceId);
                toast.success("Cash advance deleted successfully.");
            } catch {
                toast.error("Failed to delete cash advance. Please try again.");
            }
            return;
        }

        if (row.category === "discount") {
            const discountId = Number(row.id);

            if (!Number.isFinite(discountId)) {
                toast.error("Invalid discount id.");
                return;
            }

            try {
                await deleteDiscount(discountId);
                toast.success("Discount deleted successfully.");
            } catch {
                toast.error("Failed to delete discount. Please try again.");
            }

            return;
        }

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
        reprimands: buildReprimandColumns(),
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

    const handleSubmitDebt = async (values: DebtFormValues) => {
        const operatorDbId = Number(values.operatorDbId);
        const amountCop = toApiAmountCop(values.amount);

        if (!Number.isFinite(operatorDbId) || operatorDbId <= 0) {
            toast.error("Please select a valid operator.");
            return;
        }

        if (!amountCop) {
            toast.error("Please provide a valid amount.");
            return;
        }

        if (!values.issueDate) {
            toast.error("Please provide a valid issue date.");
            return;
        }

        if (!values.reason.trim()) {
            toast.error("Reason is required.");
            return;
        }

        if (editingRow && editingRow.category === "debts") {
            const debtId = Number(editingRow.id);

            if (!Number.isFinite(debtId)) {
                toast.error("Invalid debt id.");
                return;
            }

            try {
                await updateDebt({
                    id: debtId,
                    payload: {
                        operator_id: operatorDbId,
                        amount_cop: amountCop,
                        adjustment_date: values.issueDate,
                        description: values.reason.trim(),
                    },
                });

                toast.success("Debt updated successfully.");
                handleCloseDebtModal();
            } catch {
                toast.error("Failed to update debt. Please try again.");
            }

            return;
        }

        if (activeTab === "debts") {
            try {
                await createDebt({
                    operator_id: operatorDbId,
                    amount_cop: amountCop,
                    adjustment_date: values.issueDate,
                    description: values.reason.trim(),
                });

                toast.success("Debt created successfully.");
                setCurrentPage(1);
                handleCloseDebtModal();
            } catch {
                toast.error("Failed to create debt. Please try again.");
            }

            return;
        }

        const payload: Omit<DebtRow, "id" | "category"> = {
            operatorDbId: values.operatorDbId,
            operatorName: values.operatorName,
            operatorId: values.operatorId,
            groupName: values.groupName,
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

    const handleSubmitCashAdvance = async (values: CashAdvanceFormValues) => {
        const operatorDbId = Number(values.operatorDbId);
        const amountCop = toApiAmountCop(values.advancedAmount);

        if (!Number.isFinite(operatorDbId) || operatorDbId <= 0) {
            toast.error("Please select a valid operator.");
            return;
        }

        if (!amountCop) {
            toast.error("Please provide a valid amount.");
            return;
        }

        if (!values.issueDate) {
            toast.error("Please provide a valid issue date.");
            return;
        }

        if (!values.reason.trim()) {
            toast.error("Reason is required.");
            return;
        }

        if (editingRow && editingRow.category === "cash-advances") {
            const cashAdvanceId = Number(editingRow.id);

            if (!Number.isFinite(cashAdvanceId)) {
                toast.error("Invalid cash advance id.");
                return;
            }

            try {
                await updateCashAdvance({
                    id: cashAdvanceId,
                    payload: {
                        operator_id: operatorDbId,
                        amount_cop: amountCop,
                        adjustment_date: values.issueDate,
                        description: values.reason.trim(),
                    },
                });

                toast.success("Cash advance updated successfully.");
                handleCloseCashAdvanceModal();
            } catch {
                toast.error("Failed to update cash advance. Please try again.");
            }

            return;
        }

        if (activeTab === "cash-advances") {
            try {
                await createCashAdvance({
                    operator_id: operatorDbId,
                    amount_cop: amountCop,
                    adjustment_date: values.issueDate,
                    description: values.reason.trim(),
                });

                toast.success("Cash advance created successfully.");
                setCurrentPage(1);
                handleCloseCashAdvanceModal();
            } catch {
                toast.error("Failed to create cash advance. Please try again.");
            }

            return;
        }

        const payload: Omit<DebtRow, "id" | "category"> = {
            operatorDbId: values.operatorDbId,
            operatorName: values.operatorName,
            operatorId: values.operatorId,
            groupName: values.groupName,
            amount: normalizeAmount(values.advancedAmount),
            date: toDisplayDate(values.issueDate),
            reason: values.reason,
            status: "pending",
            warningCount: undefined,
            warningLimit: undefined,
            expiryDate: undefined,
            interestRate: undefined,
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

    const handleSubmitDiscount = async (values: DiscountFormValues) => {
        const operatorDbId = Number(values.operatorDbId);
        const amountCop = toApiAmountCop(values.amount);

        if (editingRow && editingRow.category === "discount") {
            const discountId = Number(editingRow.id);

            if (!Number.isFinite(discountId)) {
                toast.error("Invalid discount id.");
                return;
            }

            try {
                await updateDiscount({
                    id: discountId,
                    payload: {
                        operator_id: operatorDbId,
                        amount_cop: amountCop,
                        adjustment_date: values.issueDate,
                        description: values.reason.trim(),
                    },
                });

                toast.success("Discount updated successfully.");
                handleCloseDiscountModal();
            } catch (error) {
                if (isAxiosError<DiscountValidationErrors>(error)) {
                    const apiMessage =
                        getFirstErrorMessage(error.response?.data?.amount_cop) ??
                        getFirstErrorMessage(error.response?.data?.detail) ??
                        getFirstErrorMessage(error.response?.data?.non_field_errors);

                    if (apiMessage) {
                        toast.error(apiMessage);
                        return;
                    }
                }

                toast.error("Failed to update discount. Please try again.");
            }

            return;
        }

        if (activeTab === "discount") {
            try {
                await createDiscount({
                    operator_id: operatorDbId,
                    amount_cop: amountCop,
                    adjustment_date: values.issueDate,
                    description: values.reason.trim(),
                });

                toast.success("Discount created successfully.");
                setCurrentPage(1);
                handleCloseDiscountModal();
            } catch (error) {
                if (isAxiosError<DiscountValidationErrors>(error)) {
                    const apiMessage =
                        getFirstErrorMessage(error.response?.data?.amount_cop) ??
                        getFirstErrorMessage(error.response?.data?.detail) ??
                        getFirstErrorMessage(error.response?.data?.non_field_errors);

                    if (apiMessage) {
                        toast.error(apiMessage);
                        return;
                    }
                }

                toast.error("Failed to create discount. Please try again.");
            }

            return;
        }

        const payload: Omit<DebtRow, "id" | "category"> = {
            operatorDbId: values.operatorDbId,
            operatorName: values.operatorName,
            operatorId: values.operatorId,
            groupName: values.groupName,
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
            operatorDbId: editingRow.operatorDbId ?? "",
            operatorName: editingRow.operatorName,
            operatorId: editingRow.operatorId,
            groupName: editingRow.groupName ?? "",
            reason: editingRow.reason ?? "",
            amount: parseAmount(editingRow.amount),
            issueDate: toInputDate(editingRow.date),
        }
        : undefined;

    const cashAdvanceDefaultValues: Partial<CashAdvanceFormValues> | undefined = editingRow
        ? {
            operatorDbId: editingRow.operatorDbId ?? "",
            operatorName: editingRow.operatorName,
            operatorId: editingRow.operatorId,
            groupName: editingRow.groupName ?? "",
            reason: editingRow.reason ?? "",
            advancedAmount: parseAmount(editingRow.amount),
            paidAmount: "",
            issueDate: toInputDate(editingRow.date),
        }
        : undefined;

    const discountDefaultValues: Partial<DiscountFormValues> | undefined = editingRow
        ? {
            operatorDbId: editingRow.operatorDbId ?? "",
            operatorName: editingRow.operatorName,
            operatorId: editingRow.operatorId,
            groupName: editingRow.groupName ?? "",
            reason: editingRow.reason ?? "",
            amount: parseAmount(editingRow.amount),
            issueDate: toInputDate(editingRow.date),
        }
        : undefined;

    const tableData = activeTab === "reprimands"
        ? reprimandRows
        : activeTab === "debts"
            ? debtRows
            : activeTab === "cash-advances"
                ? cashAdvanceRows
                : activeTab === "discount"
                    ? discountRows
            : paginatedData;
    const totalItems = activeTab === "reprimands"
        ? (reprimandsData?.count ?? 0)
        : activeTab === "debts"
            ? (debtsData?.count ?? 0)
            : activeTab === "cash-advances"
                ? (cashAdvancesData?.count ?? 0)
                : activeTab === "discount"
                    ? (discountsData?.count ?? 0)
            : filteredData.length;
    const pageSize = activeTab === "reprimands"
        ? DISCIPLINE_REPRIMAND_PAGE_SIZE
        : activeTab === "debts"
            ? PAGE_SIZE
            : PAGE_SIZE;
    const emptyText = activeTab === "reprimands"
        ? isReprimandsLoading
            ? "Loading reprimands..."
            : isReprimandsError
                ? "Failed to load reprimands."
                : activeTabConfig.emptyText
        : activeTab === "debts"
            ? isDebtsLoading
                ? "Loading debt records..."
                : isDebtsError
                    ? "Failed to load debt records."
                    : activeTabConfig.emptyText
            : activeTab === "cash-advances"
                ? isCashAdvancesLoading
                    ? "Loading cash advance records..."
                    : isCashAdvancesError
                        ? "Failed to load cash advance records."
                        : activeTabConfig.emptyText
                : activeTab === "discount"
                    ? isDiscountsLoading
                        ? "Loading discount records..."
                        : isDiscountsError
                            ? "Failed to load discount records."
                            : activeTabConfig.emptyText
            : activeTabConfig.emptyText;

    return (
        <>
            <AppTable
                columns={columnsByTab[activeTab]}
                data={tableData}
                rowKey={(row) => row.id}
                emptyText={emptyText}
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
                    totalItems,
                    pageSize,
                    onPageChange: setCurrentPage,
                    itemLabel: activeTabConfig.itemLabel,
                }}
            />

            <DebtFormModal
                open={showDebtModal}
                onClose={handleCloseDebtModal}
                onSubmit={handleSubmitDebt}
                defaultValues={defaultValues}
            />

            <CashAdvanceModal
                open={showCashAdvanceModal}
                onClose={handleCloseCashAdvanceModal}
                onSubmit={handleSubmitCashAdvance}
                defaultValues={cashAdvanceDefaultValues}
            />

            <DiscountModal
                open={showDiscountModal}
                onClose={handleCloseDiscountModal}
                onSubmit={handleSubmitDiscount}
                defaultValues={discountDefaultValues}
            />
        </>
    );
}
