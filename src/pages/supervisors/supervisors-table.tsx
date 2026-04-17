// screens/SupervisorsScreen.tsx
import { useMemo, useState } from "react";
import {
    AppTable,
    TableActions,
    TableBadge,
    TableGroupLabel,
    TableIdentity,
    type TableColumn,
} from "../../components/table";
import { SUPERVISORS_PAGE_LIMIT, usePaginatedSupervisors } from "../../lib/queries";
import type { SupervisorResponse } from "../../type";

interface SupervisorRow {
    id: number;
    supervisorId: string;
    name: string;
    group: string;
    groupColor: string;
    operators: number;
    supervisor: SupervisorResponse;
}

interface SupervisorsTableProps {
    onEditSupervisor?: (supervisor: SupervisorResponse) => void;
    onDeleteSupervisor?: (id: number) => void;
}

function mapGroupColor(groupName: string): string {
    const normalized = groupName.toLowerCase();
    if (normalized.includes("medellin")) {
        return "var(--color-purple)";
    }
    if (normalized.includes("bogota")) {
        return "#3b82f6";
    }
    if (normalized.includes("cali")) {
        return "var(--color-green)";
    }
    return "var(--color-text-muted)";
}

// ─── Column Definitions ───────────────────────────────────────────────────────

const buildColumns = (
    onEdit: (row: SupervisorRow) => void,
    onDelete: (id: number) => void,
): TableColumn<SupervisorRow>[] => [
        {
            key: "name",
            header: "Supervisor",
            render: (row) => <TableIdentity name={row.name} sub={`ID: ${row.supervisorId}`} />,
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

export const SupervisorsTable = ({ onEditSupervisor, onDeleteSupervisor }: SupervisorsTableProps) => {
    const [currentPage, setCurrentPage] = useState(1);
    const {
        data: paginatedData,
        isPending,
        isError,
    } = usePaginatedSupervisors(currentPage);

    const supervisors = useMemo<SupervisorRow[]>(() => {
        return (paginatedData?.results ?? []).map((supervisor: SupervisorResponse) => ({
            id: supervisor.id,
            supervisorId: supervisor.supervisor_id,
            name: supervisor.supervisor_name || supervisor.name,
            group: supervisor.group_name,
            groupColor: mapGroupColor(supervisor.group_name),
            operators: supervisor.operators_count,
            supervisor,
        }));
    }, [paginatedData]);

    const handleEdit = (row: SupervisorRow) => {
        onEditSupervisor?.(row.supervisor);
    };

    const handleDelete = (id: number) => {
        onDeleteSupervisor?.(id);
    };

    const columns = buildColumns(handleEdit, handleDelete);
    const emptyText = isPending
        ? "Loading supervisors..."
        : isError
            ? "Failed to load supervisors."
            : "No supervisors found.";

    return (
        <div className="p-4">
            <AppTable
                columns={columns}
                data={supervisors}
                rowKey={(r) => String(r.id)}
                emptyText={emptyText}
                pagination={{
                    currentPage,
                    totalItems: paginatedData?.total_supervisors ?? paginatedData?.count ?? 0,
                    pageSize: SUPERVISORS_PAGE_LIMIT,
                    onPageChange: setCurrentPage,
                    itemLabel: "supervisors",
                }}
            />
        </div>
    );
};
