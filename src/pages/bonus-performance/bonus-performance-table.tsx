import { useMemo, useState } from "react";
import { AppText } from "../../components/text";
import {
    AppTable,
    TableGroupLabel,
    TableIdentity,
    type TableColumn,
} from "../../components/table";
import {
    OPERATORS_PAGE_LIMIT,
    usePaginatedOperators,
} from "../../lib/queries";
import type { OperatorResponse } from "../../type";

// ─── Types ────────────────────────────────────────────────────────────────────

interface BonusPerformanceRow {
    id: number;
    operatorCode: string;
    name: string;
    group: string;
    groupColor: string;
    currentBonus: number;
}

const GROUP_COLORS: Record<string, string> = {
    Medellin: "#7C3AED",
    Bogota: "#3b82f6",
    Cali: "#059669",
};

const getGroupColor = (groupName: string) => {
    if (groupName.toLowerCase().includes("medellin")) {
        return GROUP_COLORS.Medellin;
    }
    if (groupName.toLowerCase().includes("bogota")) {
        return GROUP_COLORS.Bogota;
    }
    if (groupName.toLowerCase().includes("cali")) {
        return GROUP_COLORS.Cali;
    }

    return "#94A3B8";
};

// ─── Column Builder ───────────────────────────────────────────────────────────

const columns: TableColumn<BonusPerformanceRow>[] = [
        {
            key: "operator",
            header: "Operator",
            render: (row) => <TableIdentity name={row.name} sub={`ID: ${row.operatorCode}`} />,
        },
        {
            key: "group",
            header: "Group",
            render: (row) => (
                <TableGroupLabel label={row.group} dotColor={row.groupColor} />
            ),
        },
        {
            key: "currentBonus",
            header: "Current Bonus",
            render: (row) => (
                <AppText variant="body" className="text-sm font-semibold">
                    {Number(row.currentBonus).toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                        minimumFractionDigits: 2,
                    })}
                </AppText>
            ),
        },
    ];

// ─── Component ────────────────────────────────────────────────────────────────

export const BonusPerformanceTable = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const {
        data: paginatedData,
        isPending,
        isError,
    } = usePaginatedOperators(currentPage);

    const rows = useMemo<BonusPerformanceRow[]>(() => {
        return (paginatedData?.results ?? []).map((operator: OperatorResponse) => ({
            id: operator.id,
            operatorCode: operator.operator_id,
            name: operator.full_name || operator.operator_name,
            group: operator.group_name,
            groupColor: getGroupColor(operator.group_name),
            currentBonus: Number(operator.total_bonus_usd ?? 0),
        }));
    }, [paginatedData]);

    const emptyText = isPending
        ? "Loading bonus performance data..."
        : isError
            ? "Failed to load bonus performance data."
            : "No bonus performance data found.";

    return (
        <div className="p-4">
            <AppTable
                columns={columns}
                data={rows}
                rowKey={(r) => String(r.id)}
                emptyText={emptyText}
                tableAdditionalHeader={
                    <div className="px-6 py-5">
                        <AppText variant="smallHeader" className="text-base font-bold">
                            Operator Bonus Feed
                        </AppText>
                    </div>
                }
                pagination={{
                    currentPage,
                    totalItems: paginatedData?.total_operator_count ?? paginatedData?.count ?? 0,
                    pageSize: OPERATORS_PAGE_LIMIT,
                    onPageChange: setCurrentPage,
                    itemLabel: "operators",
                }}
            />
        </div>
    );
};
