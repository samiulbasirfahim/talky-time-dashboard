import { useMemo } from "react";
import { AppTable, type TableColumn } from "../../components/table";
import { AppText } from "../../components/text";
import { PAYOUTS_PAGE_SIZE, usePayoutBreakdown } from "../../lib/queries";
import type { PayoutBreakdownItem } from "../../type";

interface PayoutRow {
    id: string;
    operatorName: string;
    totalBonusesCop: number;
    bonus21Cop: number;
    bonus25Cop: number;
    grossCop: number;
    deductionsCop: number;
    finalPayCop: number;
}

type PayoutsTableProps = {
    selectedYear: number;
    selectedMonth: number;
    selectedPeriodLabel: string;
    currentPage: number;
    onPageChange: (page: number) => void;
};

const toNumber = (value: string | number): number => {
    const numericValue = typeof value === "number" ? value : Number(value);
    return Number.isFinite(numericValue) ? numericValue : 0;
};

const formatCop = (value: number): string => {
    return value.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
};

const toPayoutRow = (item: PayoutBreakdownItem): PayoutRow => {
    return {
        id: item.operator_id,
        operatorName: item.operator_name,
        totalBonusesCop: toNumber(item.total_bonus_cop),
        bonus21Cop: toNumber(item.bonus_21_cop),
        bonus25Cop: toNumber(item.bonus_25_cop),
        grossCop: toNumber(item.gross_bonus_cop),
        deductionsCop: toNumber(item.total_deduction_cop),
        finalPayCop: toNumber(item.final_pay_cop),
    };
};

const PAYOUT_COLUMNS: TableColumn<PayoutRow>[] = [
    {
        key: "operatorName",
        header: "Operator Name",
        render: (row) => (
            <AppText variant="body" className="font-semibold">
                {row.operatorName}
            </AppText>
        ),
    },
    {
        key: "totalBonusesCop",
        header: "Total Bonuses",
        align: "right",
        render: (row) => <AppText variant="description">{formatCop(row.totalBonusesCop)}</AppText>,
    },
    {
        key: "bonus21Cop",
        header: "21% Bonus",
        align: "right",
        render: (row) => <AppText variant="description">{formatCop(row.bonus21Cop)}</AppText>,
    },
    {
        key: "bonus25Cop",
        header: "25% Bonus",
        align: "right",
        render: (row) => <AppText variant="description">{formatCop(row.bonus25Cop)}</AppText>,
    },
    {
        key: "grossCop",
        header: "Gross COP",
        align: "right",
        render: (row) => (
            <AppText variant="body" className="font-semibold">
                {formatCop(row.grossCop)}
            </AppText>
        ),
    },
    {
        key: "deductionsCop",
        header: "Deductions COP",
        align: "right",
        render: (row) => (
            <AppText variant="description" className="text-red">
                {formatCop(row.deductionsCop)}
            </AppText>
        ),
    },
    {
        key: "finalPayCop",
        header: "Final Pay (COP)",
        align: "right",
        render: (row) => (
            <AppText
                variant="body"
                className={`font-semibold ${row.finalPayCop < 0 ? "text-red" : "text-text-focus"}`}
            >
                {formatCop(row.finalPayCop)}
            </AppText>
        ),
    },
];

export function PayoutsTable({
    selectedYear,
    selectedMonth,
    selectedPeriodLabel,
    currentPage,
    onPageChange,
}: PayoutsTableProps) {
    const { data, isLoading, isError } = usePayoutBreakdown({
        year: selectedYear,
        month: selectedMonth,
        page: currentPage,
    });

    const rows = useMemo(() => {
        return (data?.results ?? []).map(toPayoutRow);
    }, [data]);

    const emptyText = isLoading
        ? "Loading payout data..."
        : isError
            ? "Failed to load payout data."
            : `No payout data found for ${selectedPeriodLabel}.`;

    return (
        <AppTable
            columns={PAYOUT_COLUMNS}
            data={rows}
            rowKey={(row) => row.id}
            emptyText={emptyText}
            tableAdditionalHeader={
                <div className="px-6 py-5">
                    <AppText variant="header" className="text-3xl font-semibold">
                        Operator Payout Breakdown
                    </AppText>
                    <AppText variant="description" className="mt-1">
                        Detailed performance and compensation metrics for {selectedPeriodLabel}.
                    </AppText>
                </div>
            }
            pagination={{
                currentPage,
                totalItems: data?.count ?? 0,
                pageSize: PAYOUTS_PAGE_SIZE,
                onPageChange,
                itemLabel: "operators",
            }}
        />
    );
}
