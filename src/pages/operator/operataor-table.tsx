// screens/OperatorsTable.tsx
import { useState } from "react";
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

type ShiftType = "day" | "night";
type StatusVariant = "active" | "inactive" | "pending";

interface ActiveProfile {
    initials: string;
    color?: string;
}

interface Operator {
    id: string;
    name: string;
    group: string;
    groupColor: "blue" | "blue-light" | "gray";
    shift: ShiftType;
    activeProfiles: ActiveProfile[];
    totalBonuses: number;
    status: StatusVariant;
}

const INITIAL_DATA: Operator[] = [
    {
        id: "OP-9421",
        name: "Elena Rodriguez",
        group: "Medellin",
        groupColor: "blue",
        shift: "day",
        activeProfiles: [
            { initials: "A", color: "#3b5bdb" },
            { initials: "B", color: "#f59f00" },
            { initials: "C", color: "#2f9e44" },
            { initials: "D", color: "#c2255c" },
        ],
        totalBonuses: 1240,
        status: "active",
    },
    {
        id: "OP-8812",
        name: "Marco Beltran",
        group: "Bogota",
        groupColor: "blue-light",
        shift: "night",
        activeProfiles: [{ initials: "1", color: "#adb5bd" }],
        totalBonuses: 850,
        status: "inactive",
    },
    {
        id: "OP-4402",
        name: "Sofia Jensen",
        group: "Remote",
        groupColor: "gray",
        shift: "day",
        activeProfiles: [
            { initials: "A", color: "#3b5bdb" },
            { initials: "F", color: "#e67700" },
        ],
        totalBonuses: 2100,
        status: "inactive",
    },
    {
        id: "OP-1129",
        name: "Lucas Viana",
        group: "Medellin",
        groupColor: "blue",
        shift: "night",
        activeProfiles: [{ initials: "C", color: "#3b5bdb" }],
        totalBonuses: 1100,
        status: "active",
    },
    {
        id: "OP-3301",
        name: "Ana Torres",
        group: "Bogota",
        groupColor: "blue-light",
        shift: "day",
        activeProfiles: [
            { initials: "A", color: "#3b5bdb" },
            { initials: "B", color: "#f59f00" },
            { initials: "X", color: "#9c36b5" },
        ],
        totalBonuses: 1750,
        status: "active",
    },
    {
        id: "OP-7720",
        name: "Jorge Medina",
        group: "Remote",
        groupColor: "gray",
        shift: "night",
        activeProfiles: [{ initials: "J", color: "#c2255c" }],
        totalBonuses: 640,
        status: "pending",
    },
];

const PAGE_SIZE = 4;

const buildColumns = (
    onEdit: (row: Operator) => void,
    onDelete: (id: string) => void,
): TableColumn<Operator>[] => [
        {
            key: "name",
            header: "Name",
            render: (row) => <TableIdentity name={row.name} sub={`ID: ${row.id}`} />,
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

export const OperatorsTable = () => {
    const [operators, setOperators] = useState<Operator[]>(INITIAL_DATA);
    const [currentPage, setCurrentPage] = useState(1);

    const handleEdit = (row: Operator) => {
        console.log("edit", row);
    };

    const handleDelete = (id: string) => {
        setOperators((prev) => {
            const updated = prev.filter((o) => o.id !== id);
            const newTotalPages = Math.max(1, Math.ceil(updated.length / PAGE_SIZE));
            if (currentPage > newTotalPages) setCurrentPage(newTotalPages);
            return updated;
        });
    };

    const paginatedData = operators.slice(
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
                emptyText="No operators found."
                pagination={{
                    currentPage,
                    totalItems: operators.length,
                    pageSize: PAGE_SIZE,
                    onPageChange: setCurrentPage,
                    itemLabel: "operators",
                }}
            />
        </div>
    );
};
