// screens/OperatorsTable.tsx
import { useMemo, useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import {
    AppTable,
    TableActions,
    TableAvatarStack,
    TableGroupBadge,
    TableIdentity,
    TableNumericCell,
    TableStatus,
    type TableColumn,
} from "../../components/table";
import { AppText } from "../../components/text";
import { CompactSearchableDropdown } from "../../components/searchable-dropdown";
import { useDebounce } from "../../lib/hooks/debounce";
import {
    OPERATORS_PAGE_LIMIT,
    usePaginatedOperators,
    useSearchGroups,
} from "../../lib/queries";
import type {
    OperatorProfileSummary,
    OperatorResponse,
} from "../../type";

export type ShiftType = "day" | "night";

interface ActiveProfile {
    initials: string;
    name: string;
    color?: string;
}

type OperatorStatus = "active" | "inactive" | "pending";

export interface OperatorRow {
    id: number;
    operatorCode: string;
    name: string;
    group: string;
    groupColor: "blue" | "blue-light" | "gray";
    shift: ShiftType;
    activeProfiles: ActiveProfile[];
    totalBonuses: number;
    status: OperatorStatus;
    operator: OperatorResponse;
}

function mapGroupColor(groupName: string): OperatorRow["groupColor"] {
    const normalized = groupName.toLowerCase();
    if (normalized.includes("medellin")) {
        return "blue";
    }
    if (normalized.includes("bogota")) {
        return "blue-light";
    }
    return "gray";
}

function mapStatus(status: string): OperatorStatus {
    if (status === "active" || status === "inactive" || status === "pending") {
        return status;
    }
    return "inactive";
}

function extractProfileInitials(profile: OperatorProfileSummary): string {
    const profileName = profile.profile_name?.trim();
    if (!profileName) {
        return "P";
    }

    const firstToken = profileName.split(",")[0]?.trim() || profileName;
    const words = firstToken.split(/\s+/).filter(Boolean);
    if (words.length === 0) {
        return "P";
    }

    if (words.length === 1) {
        return words[0].slice(0, 2).toUpperCase();
    }

    return `${words[0][0] ?? ""}${words[1][0] ?? ""}`.toUpperCase();
}

const PROFILE_COLORS = ["#3b5bdb", "#f59f00", "#2f9e44", "#c2255c", "#9c36b5", "#0ea5e9"];

const buildColumns = (
    onEdit: (row: OperatorRow) => void,
    onDelete: (id: number) => void | Promise<void>,
): TableColumn<OperatorRow>[] => [
        {
            key: "name",
            header: "Operator",
            render: (row) => <TableIdentity name={row.name} sub={`ID: ${row.operatorCode}`} />,
        },
        {
            key: "group",
            header: "Group",
            render: (row) => (
                <TableGroupBadge label={row.group} color={row.groupColor} />
            ),
        },
        {
            key: "shift",
            header: "Shift",
            render: (row) => (
                <div className="flex items-center gap-1.5">
                    <span className="text-base leading-none">
                        {row.shift === "day" ? (
                            <Sun fill="#F59E0B" color="#F59E0B" size={18} />
                        ) : (
                            <Moon fill="#818CF8" color="#818CF8" size={18} />
                        )}
                    </span>
                    <AppText variant="description" className="capitalize">
                        {row.shift}
                    </AppText>
                </div>
            ),
        },
        {
            key: "activeProfiles",
            header: "Active Profiles",
            render: (row) => <TableAvatarStack avatars={row.activeProfiles} max={2} />,
        },
        {
            key: "totalBonuses",
            header: "Total Bonuses",
            render: (row) => (
                <TableNumericCell
                    value={row.totalBonuses}
                    format={(v) =>
                        Number(v).toLocaleString("en-US", {
                            style: "currency",
                            currency: "USD",
                            minimumFractionDigits: 2,
                        })
                    }
                />
            ),
        },
        {
            key: "status",
            header: "Status",
            render: (row) => <TableStatus status={row.status} />,
        },
        {
            key: "actions",
            header: "Action",
            align: "right",
            render: (row) => (
                <TableActions
                    onEdit={() => onEdit(row)}
                    onDelete={() => onDelete(row.id)}
                />
            ),
        },
    ];

interface OperatorsTableProps {
    onEditOperator?: (operator: OperatorResponse) => void;
    onDeleteOperator?: (id: number) => Promise<void> | void;
}

export const OperatorsTable = ({
    onEditOperator,
    onDeleteOperator,
}: OperatorsTableProps) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedGroupId, setSelectedGroupId] = useState("");
    const [groupSearch, setGroupSearch] = useState("");
    const debouncedGroupSearch = useDebounce(groupSearch, 500);
    const { data: groupsData } = useSearchGroups(debouncedGroupSearch);
    const {
        data: paginatedData,
        isPending,
        isError,
    } = usePaginatedOperators(currentPage, selectedGroupId ? selectedGroupId : undefined);

    useEffect(() => {
        setCurrentPage(1);
    }, [selectedGroupId]);

    const operators = useMemo<OperatorRow[]>(() => {
        return (paginatedData?.results ?? []).map((operator: OperatorResponse) => ({
            id: operator.id,
            operatorCode: operator.operator_id,
            name: operator.full_name || operator.operator_name,
            group: operator.group_name,
            groupColor: mapGroupColor(operator.group_name),
            shift: operator.shift === "NIGHT" ? "night" : "day",
            activeProfiles: (operator.current_profiles ?? []).map((profile, index) => ({
                initials: extractProfileInitials(profile),
                name: profile.profile_name || "Unknown Profile",
                color: PROFILE_COLORS[index % PROFILE_COLORS.length],
            })),
            totalBonuses: Number(operator.total_bonus_usd ?? 0),
            status: mapStatus(operator.status),
            operator,
        }));
    }, [paginatedData]);

    const handleEdit = (row: OperatorRow) => onEditOperator?.(row.operator);

    const handleDelete = async (id: number) => {
        await onDeleteOperator?.(id);
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
        ? "Loading operators..."
        : isError
            ? "Failed to load operators."
            : "No operators found.";

    return (
        <div className="p-4">
            <AppTable
                columns={columns}
                data={operators}
                rowKey={(r) => String(r.id)}
                tableAdditionalHeader={
                    <div className="flex items-center justify-between px-6 py-5 gap-4">
                        <AppText variant="smallHeader" className="text-base font-bold">
                            Operators
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
                    totalItems: paginatedData?.total_operator_count ?? paginatedData?.count ?? 0,
                    pageSize: OPERATORS_PAGE_LIMIT,
                    onPageChange: setCurrentPage,
                    itemLabel: "operators",
                }}
            />
        </div>
    );
};
