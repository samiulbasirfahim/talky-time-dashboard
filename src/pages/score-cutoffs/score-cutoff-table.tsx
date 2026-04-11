import { useState } from "react";
import { AppText } from "../../components/text";
import {
    AppTable,
    type TableColumn,
} from "../../components/table";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ScoreCutoffRow {
    id: string;
    operatorName: string;
    shiftBonuses: number;
    dailyTotal: number;
    monthlyTotal: number;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_DATA: ScoreCutoffRow[] = [
    { id: "1", operatorName: "Maria G. (32)", shiftBonuses: 120, dailyTotal: 245, monthlyTotal: 1850 },
    { id: "2", operatorName: "Carlos R. (40)", shiftBonuses: 105, dailyTotal: 210, monthlyTotal: 1920 },
    { id: "3", operatorName: "Anna L. (28)", shiftBonuses: 145, dailyTotal: 280, monthlyTotal: 2100 },
    { id: "4", operatorName: "James K. (45)", shiftBonuses: 95, dailyTotal: 190, monthlyTotal: 1640 },
    { id: "5", operatorName: "Sofia V. (35)", shiftBonuses: 132, dailyTotal: 265, monthlyTotal: 2015 },
    { id: "6", operatorName: "Diego M. (29)", shiftBonuses: 110, dailyTotal: 225, monthlyTotal: 1780 },
    { id: "7", operatorName: "Elena P. (38)", shiftBonuses: 158, dailyTotal: 310, monthlyTotal: 2340 },
    { id: "8", operatorName: "Luis T. (42)", shiftBonuses: 88, dailyTotal: 175, monthlyTotal: 1520 },
    { id: "9", operatorName: "Rosa H. (31)", shiftBonuses: 140, dailyTotal: 270, monthlyTotal: 2080 },
    { id: "10", operatorName: "Miguel F. (36)", shiftBonuses: 125, dailyTotal: 250, monthlyTotal: 1950 },
    { id: "11", operatorName: "Carmen S. (27)", shiftBonuses: 115, dailyTotal: 230, monthlyTotal: 1820 },
    { id: "12", operatorName: "Pedro R. (44)", shiftBonuses: 98, dailyTotal: 195, monthlyTotal: 1580 },
];

const PAGE_SIZE = 5;

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

    const paginatedData = MOCK_DATA.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE,
    );

    return (
        <div className="p-4">
            <AppTable
                columns={columns}
                data={paginatedData}
                rowKey={(r) => r.id}
                emptyText="No score cutoff data available."
                pagination={{
                    currentPage,
                    totalItems: MOCK_DATA.length,
                    pageSize: PAGE_SIZE,
                    onPageChange: setCurrentPage,
                    itemLabel: "operators",
                }}
            />
        </div>
    );
};
