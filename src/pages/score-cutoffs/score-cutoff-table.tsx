import { useMemo, useState } from "react";
import { AppText } from "../../components/text";
import {
    AppTable,
    type TableColumn,
} from "../../components/table";
import {
    SCORE_CUTOFFS_PAGE_SIZE,
    usePaginatedScoreCutoffs,
} from "../../lib/queries";
import type { ScoreCutoffResponse } from "../../type";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ScoreCutoffRow {
    id: number;
    operatorName: string;
    shiftBonuses: number;
    dailyTotal: number;
    monthlyTotal: number;
}

const toNumber = (value: string | number): number => {
    const normalized = typeof value === "number" ? value : Number(value);
    return Number.isFinite(normalized) ? normalized : 0;
};

const toRow = (item: ScoreCutoffResponse): ScoreCutoffRow => {
    return {
        id: item.id,
        operatorName: item.operator_name,
        shiftBonuses: item.total_group_bonus,
        dailyTotal: toNumber(item.daily_total),
        monthlyTotal: item.monthly_total,
    };
};

// ─── Column Definitions ───────────────────────────────────────────────────────

const columns: TableColumn<ScoreCutoffRow>[] = [
    {
        key: "operatorName",
        header: "Operator Name",
        render: (row) => (
            <AppText variant="description" className="text-sm font-medium text-text">
                {row.operatorName}
            </AppText>
        ),
    },
    {
        key: "shiftBonuses",
        header: "Shift Bonuses",
        align: "center",
        render: (row) => (
            <AppText variant="body" className="text-sm font-bold text-text-focus">
                {row.shiftBonuses}
            </AppText>
        ),
    },
    {
        key: "dailyTotal",
        header: "Daily Total",
        align: "center",
        render: (row) => (
            <AppText variant="body" className="text-sm font-semibold">
                {row.dailyTotal.toLocaleString()}
            </AppText>
        ),
    },
    {
        key: "monthlyTotal",
        header: "Monthly Total",
        align: "right",
        render: (row) => (
            <AppText variant="body" className="text-sm font-semibold">
                {row.monthlyTotal.toLocaleString()}
            </AppText>
        ),
    },
];

// ─── Component ────────────────────────────────────────────────────────────────

export const ScoreCutoffTable = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const { data, isLoading, isError } = usePaginatedScoreCutoffs(currentPage);

    const rows = useMemo<ScoreCutoffRow[]>(() => {
        return (data?.results ?? []).map(toRow);
    }, [data]);

    const emptyText = isLoading
        ? "Loading score cutoff data..."
        : isError
            ? "Failed to load score cutoff data."
            : "No score cutoff data available.";

    return (
        <div className="p-4">
            <AppTable
                columns={columns}
                data={rows}
                rowKey={(r) => r.id}
                emptyText={emptyText}
                pagination={{
                    currentPage,
                    totalItems: data?.count ?? 0,
                    pageSize: SCORE_CUTOFFS_PAGE_SIZE,
                    onPageChange: setCurrentPage,
                    itemLabel: "operators",
                }}
            />
        </div>
    );
};
