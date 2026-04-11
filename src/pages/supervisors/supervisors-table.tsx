// screens/SupervisorsScreen.tsx
import { useState } from "react";
import {
    AppTable,
    TableActions,
    TableBadge,
    TableGroupLabel,
    TableIdentity,
    type TableColumn,
} from "../../components/table";

interface Supervisor {
    id: string;
    name: string;
    group: string;
    groupColor: string;
    operators: number;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const GROUP_COLORS: Record<string, string> = {
    Medellin: "var(--color-purple)",
    Bogota: "#3b82f6",
    Cali: "var(--color-green)",
};

const INITIAL_DATA: Supervisor[] = [
    {
        id: "#0001",
        name: "Rasel Jr.",
        group: "Medellin",
        groupColor: GROUP_COLORS.Medellin,
        operators: 12,
    },
    {
        id: "#0002",
        name: "Saruf Sr.",
        group: "Bogota",
        groupColor: GROUP_COLORS.Bogota,
        operators: 24,
    },
    {
        id: "#0003",
        name: "Saruf Sr.",
        group: "Bogota",
        groupColor: GROUP_COLORS.Bogota,
        operators: 6,
    },
    {
        id: "#0004",
        name: "Saruf Sr.",
        group: "Bogota",
        groupColor: GROUP_COLORS.Bogota,
        operators: 14,
    },
    {
        id: "#0005",
        name: "Rasel Jr.",
        group: "Cali",
        groupColor: GROUP_COLORS.Cali,
        operators: 9,
    },
    {
        id: "#0006",
        name: "Saruf Sr.",
        group: "Medellin",
        groupColor: GROUP_COLORS.Medellin,
        operators: 18,
    },
    {
        id: "#0007",
        name: "Rasel Jr.",
        group: "Bogota",
        groupColor: GROUP_COLORS.Bogota,
        operators: 31,
    },
    {
        id: "#0008",
        name: "Saruf Sr.",
        group: "Cali",
        groupColor: GROUP_COLORS.Cali,
        operators: 7,
    },
];

const PAGE_SIZE = 4;

// ─── Column Definitions ───────────────────────────────────────────────────────

const buildColumns = (
    onEdit: (row: Supervisor) => void,
    onDelete: (id: string) => void,
): TableColumn<Supervisor>[] => [
        {
            key: "name",
            header: "Supervisor",
            render: (row) => <TableIdentity name={row.name} sub={`ID: ${row.id}`} />,
        },
        {
            key: "group",
            header: "Assigned Group",
            render: (row) => (
                <TableGroupLabel label={row.group} dotColor={row.groupColor} />
            ),
        },
        {
            key: "operators",
            header: "Operators",
            render: (row) => <TableBadge label={`${row.operators} Active`} />,
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

export const SupervisorsTable = () => {
    const [supervisors, setSupervisors] = useState<Supervisor[]>(INITIAL_DATA);
    const [currentPage, setCurrentPage] = useState(1);

    const handleEdit = (row: Supervisor) => {
        console.log("edit", row);
    };

    const handleDelete = (id: string) => {
        setSupervisors((prev) => {
            const updated = prev.filter((s) => s.id !== id);
            // If deleting the last item on the current page, step back one page
            const newTotalPages = Math.max(1, Math.ceil(updated.length / PAGE_SIZE));
            if (currentPage > newTotalPages) setCurrentPage(newTotalPages);
            return updated;
        });
    };

    const paginatedData = supervisors.slice(
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
                emptyText="No supervisors found."
                pagination={{
                    currentPage,
                    totalItems: supervisors.length,
                    pageSize: PAGE_SIZE,
                    onPageChange: setCurrentPage,
                    itemLabel: "supervisors",
                }}
            />
        </div>
    );
};
