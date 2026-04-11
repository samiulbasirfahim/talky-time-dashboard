import { useState } from "react";
import { AppTable, type TableColumn } from "../../components/table";
import { AppText } from "../../components/text";

interface PayoutRow {
    id: string;
    operatorName: string;
    totalBonuses: string;
    bonus21: string;
    bonus25: string;
    grossCop: string;
    deductionsCop: string;
    netUsd: string;
    finalPayCop: string;
}

const PAGE_SIZE = 4;

const PAYOUT_ROWS: PayoutRow[] = [
    {
        id: "OP-001",
        operatorName: "Mariana Lopez",
        totalBonuses: "$1,250.00",
        bonus21: "$262.50",
        bonus25: "$312.50",
        grossCop: "$1,825.00",
        deductionsCop: "250,000",
        netUsd: "$1,754.58",
        finalPayCop: "6,228,750",
    },
    {
        id: "OP-002",
        operatorName: "Julian Ramirez",
        totalBonuses: "$980.00",
        bonus21: "$205.80",
        bonus25: "$245.00",
        grossCop: "$1,430.80",
        deductionsCop: "0",
        netUsd: "$1,430.80",
        finalPayCop: "5,079,340",
    },
    {
        id: "OP-003",
        operatorName: "Sofia Gomez",
        totalBonuses: "$2,100.00",
        bonus21: "$441.00",
        bonus25: "$525.00",
        grossCop: "$3,066.00",
        deductionsCop: "120,000",
        netUsd: "$3,032.20",
        finalPayCop: "10,764,300",
    },
    {
        id: "OP-004",
        operatorName: "Andres Morales",
        totalBonuses: "$1,450.00",
        bonus21: "$304.50",
        bonus25: "$362.50",
        grossCop: "$2,117.00",
        deductionsCop: "45,000",
        netUsd: "$2,104.32",
        finalPayCop: "7,470,350",
    },
    {
        id: "OP-005",
        operatorName: "Elena Rodriguez",
        totalBonuses: "$1,120.00",
        bonus21: "$235.20",
        bonus25: "$280.00",
        grossCop: "$1,635.20",
        deductionsCop: "30,000",
        netUsd: "$1,622.90",
        finalPayCop: "5,756,000",
    },
    {
        id: "OP-006",
        operatorName: "Marco Beltran",
        totalBonuses: "$1,010.00",
        bonus21: "$212.10",
        bonus25: "$252.50",
        grossCop: "$1,474.60",
        deductionsCop: "20,000",
        netUsd: "$1,468.20",
        finalPayCop: "5,205,120",
    },
    {
        id: "OP-007",
        operatorName: "Lucas Viana",
        totalBonuses: "$1,360.00",
        bonus21: "$285.60",
        bonus25: "$340.00",
        grossCop: "$1,985.60",
        deductionsCop: "90,000",
        netUsd: "$1,963.70",
        finalPayCop: "6,961,300",
    },
    {
        id: "OP-008",
        operatorName: "Ana Torres",
        totalBonuses: "$1,780.00",
        bonus21: "$373.80",
        bonus25: "$445.00",
        grossCop: "$2,598.80",
        deductionsCop: "110,000",
        netUsd: "$2,564.10",
        finalPayCop: "9,084,500",
    },
];

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
        key: "totalBonuses",
        header: "Total Bonuses",
        align: "right",
        render: (row) => <AppText variant="description">{row.totalBonuses}</AppText>,
    },
    {
        key: "bonus21",
        header: "21% Bonus",
        align: "right",
        render: (row) => <AppText variant="description">{row.bonus21}</AppText>,
    },
    {
        key: "bonus25",
        header: "25% Bonus",
        align: "right",
        render: (row) => <AppText variant="description">{row.bonus25}</AppText>,
    },
    {
        key: "grossCop",
        header: "Gross COP",
        align: "right",
        render: (row) => (
            <AppText variant="body" className="font-semibold">
                {row.grossCop}
            </AppText>
        ),
    },
    {
        key: "deductionsCop",
        header: "Deductions COP",
        align: "right",
        render: (row) => (
            <AppText variant="description" className="text-red">
                {row.deductionsCop}
            </AppText>
        ),
    },
    {
        key: "netUsd",
        header: "Net USD",
        align: "right",
        render: (row) => (
            <AppText variant="body" className="font-semibold">
                {row.netUsd}
            </AppText>
        ),
    },
    {
        key: "finalPayCop",
        header: "Final Pay (COP)",
        align: "right",
        // className: "bg-text-focus/10",
        // headerClassName: "bg-text-focus/10 text-text-focus",
        render: (row) => (
            <AppText variant="body" className="font-semibold text-text-focus">
                {row.finalPayCop}
            </AppText>
        ),
    },
];

export function PayoutsTable() {
    const [currentPage, setCurrentPage] = useState(1);

    const paginatedData = PAYOUT_ROWS.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE,
    );

    return (
        <AppTable
            columns={PAYOUT_COLUMNS}
            data={paginatedData}
            rowKey={(row) => row.id}
            emptyText="No payout data found."
            tableAdditionalHeader={
                <div className="px-6 py-5">
                    <AppText variant="header" className="text-3xl font-semibold">
                        Operator Payout Breakdown
                    </AppText>
                    <AppText variant="description" className="mt-1">
                        Detailed performance and compensation metrics for the current billing cycle.
                    </AppText>
                </div>
            }
            pagination={{
                currentPage,
                totalItems: PAYOUT_ROWS.length,
                pageSize: PAGE_SIZE,
                onPageChange: setCurrentPage,
                itemLabel: "operators",
            }}
        />
    );
}
