// screens/SupervisorsScreen.tsx
import { useMemo, useState, useEffect } from "react";
import {
    AppTable,
    TableActions,
    TableBadge,
    TableGroupLabel,
    TableIdentity,
    type TableColumn,
} from "../../components/table";
import { CompactSearchableDropdown } from "../../components/searchable-dropdown";
import { AppText } from "../../components/text";
import { useDebounce } from "../../lib/hooks/debounce";
import { SUPERVISORS_PAGE_LIMIT, usePaginatedSupervisors, useSearchGroups } from "../../lib/queries";
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
    const [selectedGroupId, setSelectedGroupId] = useState("");
    const [groupSearch, setGroupSearch] = useState("");
    const debouncedGroupSearch = useDebounce(groupSearch, 500);
    const { data: groupsData } = useSearchGroups(debouncedGroupSearch);
    const {
        data: paginatedData,
        isPending,
        isError,
    } = usePaginatedSupervisors(currentPage, selectedGroupId ? selectedGroupId : undefined);

    useEffect(() => {
        setCurrentPage(1);
    }, [selectedGroupId]);

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

    const groupOptions = useMemo(() => {
        const fetchedOptions = (groupsData?.results ?? []).map((group) => ({
            value: String(group.id),
            label: group.name,
            subtitle: `Operators: ${group.operator_count ?? 0} | Supervisors: ${group.supervisor_count ?? 0}`,
            keywords: [
                `Total: ${group.operators_summary?.total ?? 0}`,
                `Day: ${group.operators_summary?.day_shift ?? 0}`,
                `Night: ${group.operators_summary?.night_shift ?? 0}`,
                ...(group.supervisors ?? []).map(
                    (supervisor) => supervisor.supervisor_name || supervisor.name,
                ),
            ],
        }));

        return [{ label: "All Groups", value: "" }, ...fetchedOptions];
    }, [groupsData]);

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
                tableAdditionalHeader={
                    <div className="flex items-center justify-between px-6 py-5 gap-4">
                        <AppText variant="smallHeader" className="text-base font-bold">
                            Supervisors
                        </AppText>
                        <div className="w-48">
                            <CompactSearchableDropdown
                                options={groupOptions}
                                value={selectedGroupId}
                                onChange={setSelectedGroupId}
                                onSearchChange={setGroupSearch}
                                placeholder="Filter by group..."
                            />
                        </div>
                    </div>
                }
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
