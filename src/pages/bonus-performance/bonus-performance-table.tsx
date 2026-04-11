import { useState } from "react";
import { Download } from "lucide-react";
import { AppButton } from "../../components/button";
import { AppText } from "../../components/text";
import {
    AppTable,
    TableActions,
    TableGroupLabel,
    TableIdentity,
    type TableColumn,
} from "../../components/table";

// ─── Types ────────────────────────────────────────────────────────────────────

interface BonusPerformanceRow {
    id: string;
    name: string;
    group: string;
    groupColor: string;
    currentBonus: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const GROUP_COLORS: Record<string, string> = {
    Medellin: "var(--color-purple)",
    Bogota: "#3b82f6",
    Cali: "var(--color-green)",
};

const MOCK_DATA: BonusPerformanceRow[] = [
    { id: "#0001", name: "Rasel Jr.", group: "Medellin", groupColor: GROUP_COLORS.Medellin, currentBonus: "COL$ 450.00" },
    { id: "#0002", name: "Saruf Sr.", group: "Bogota", groupColor: GROUP_COLORS.Bogota, currentBonus: "COL$ 250.00" },
    { id: "#0003", name: "Saruf Sr.", group: "Bogota", groupColor: GROUP_COLORS.Bogota, currentBonus: "COL$ 850.00" },
    { id: "#0004", name: "Saruf Sr.", group: "Bogota", groupColor: GROUP_COLORS.Bogota, currentBonus: "COL$ 450.00" },
    { id: "#0005", name: "Elena R.", group: "Medellin", groupColor: GROUP_COLORS.Medellin, currentBonus: "COL$ 320.00" },
    { id: "#0006", name: "Marco B.", group: "Cali", groupColor: GROUP_COLORS.Cali, currentBonus: "COL$ 510.00" },
    { id: "#0007", name: "Sofia J.", group: "Bogota", groupColor: GROUP_COLORS.Bogota, currentBonus: "COL$ 680.00" },
    { id: "#0008", name: "Lucas V.", group: "Medellin", groupColor: GROUP_COLORS.Medellin, currentBonus: "COL$ 290.00" },
    { id: "#0009", name: "Ana T.", group: "Cali", groupColor: GROUP_COLORS.Cali, currentBonus: "COL$ 420.00" },
    { id: "#0010", name: "Jorge M.", group: "Bogota", groupColor: GROUP_COLORS.Bogota, currentBonus: "COL$ 560.00" },
    { id: "#0011", name: "Diana C.", group: "Medellin", groupColor: GROUP_COLORS.Medellin, currentBonus: "COL$ 740.00" },
    { id: "#0012", name: "Pablo S.", group: "Cali", groupColor: GROUP_COLORS.Cali, currentBonus: "COL$ 380.00" },
];

const PAGE_SIZE = 4;

// ─── Column Builder ───────────────────────────────────────────────────────────

const buildColumns = (
    onEdit: (row: BonusPerformanceRow) => void,
    onDelete: (id: string) => void,
): TableColumn<BonusPerformanceRow>[] => [
        {
            key: "operator",
            header: "Operator",
            render: (row) => <TableIdentity name={row.name} sub={`ID: ${row.id}`} />,
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
                    {row.currentBonus}
                </AppText>
            ),
        },
        {
            key: "actions",
            header: "Actions",
            align: "right",
            render: (row) => (
                <TableActions
                    onEdit={() => onEdit(row)}
                    onDelete={() => onDelete(row.id)}
                />
            ),
        },
    ];

// ─── Component ────────────────────────────────────────────────────────────────

export const BonusPerformanceTable = () => {
    const [data, setData] = useState<BonusPerformanceRow[]>(MOCK_DATA);
    const [currentPage, setCurrentPage] = useState(1);

    const handleEdit = (row: BonusPerformanceRow) => {
        console.log("edit", row);
    };

    const handleDelete = (id: string) => {
        setData((prev) => {
            const updated = prev.filter((r) => r.id !== id);
            const newTotalPages = Math.max(1, Math.ceil(updated.length / PAGE_SIZE));
            if (currentPage > newTotalPages) setCurrentPage(newTotalPages);
            return updated;
        });
    };

    const handleExportCsv = () => {
        console.log("Export CSV clicked");
    };

    const paginatedData = data.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE,
    );

    const columns = buildColumns(handleEdit, handleDelete);

    return (
        <div className="p-4">
            <AppTable
                columns={columns}
                data={paginatedData}
                rowKey={(r) => r.id}
                emptyText="No bonus data found."
                tableAdditionalHeader={
                    <div className="flex items-center justify-between px-6 py-5">
                        <AppText variant="smallHeader" className="text-base font-bold">
                            Operator Bonus Feed
                        </AppText>
                        <AppButton
                            variant="outline"
                            size="sm"
                            prefixIcon={Download}
                            onClick={handleExportCsv}
                        >
                            Export CSV
                        </AppButton>
                    </div>
                }
                pagination={{
                    currentPage,
                    totalItems: data.length,
                    pageSize: PAGE_SIZE,
                    onPageChange: setCurrentPage,
                    itemLabel: "operators",
                }}
            />
        </div>
    );
};
