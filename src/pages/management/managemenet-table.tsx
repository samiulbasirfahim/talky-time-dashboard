
import { useMemo, useState } from "react";
import { AppTable, TableActions, type TableColumn } from "../../components/table";
import { AppText } from "../../components/text";
import { ADMINS_PAGE_LIMIT, usePaginatedAdmins } from "../../lib/queries";

export interface ManagementRow {
    id: number;
    name: string;
    email: string;
}

interface ManagementTableProps {
    onEditAdmin?: (row: ManagementRow) => void;
    onDeleteAdmin?: (row: ManagementRow) => void | Promise<void>;
}

const buildColumns = (
    onEditAdmin?: (row: ManagementRow) => void,
    onDeleteAdmin?: (row: ManagementRow) => void | Promise<void>,
): TableColumn<ManagementRow>[] => [
        {
            key: "name",
            header: "Name",
            render: (row) => (
                <AppText variant="body" className="font-semibold">
                    {row.name}
                </AppText>
            ),
        },
        {
            key: "email",
            header: "Email",
            render: (row) => <AppText variant="description">{row.email}</AppText>,
        },
        {
            key: "actions",
            header: "Actions",
            align: "right",
            render: (row) => (
                <TableActions
                    onEdit={onEditAdmin ? () => onEditAdmin(row) : undefined}
                    onDelete={onDeleteAdmin ? () => onDeleteAdmin(row) : undefined}
                />
            ),
        },
    ];

export function ManagementTable({ onEditAdmin, onDeleteAdmin }: ManagementTableProps) {
    const [currentPage, setCurrentPage] = useState(1);
    const {
        data: paginatedData,
        isPending,
        isError,
    } = usePaginatedAdmins(currentPage);

    const columns = useMemo(() => buildColumns(onEditAdmin, onDeleteAdmin), [onEditAdmin, onDeleteAdmin]);

    const rows = useMemo(() => {
        return (paginatedData?.results ?? []).map((admin) => ({
            id: admin.id,
            name: admin.full_name,
            email: admin.email,
        }));
    }, [paginatedData]);

    const emptyText = isPending
        ? "Loading administrators..."
        : isError
            ? "Failed to load administrators."
            : "No administrators found.";

    return (
        <AppTable
            columns={columns}
            data={rows}
            rowKey={(row) => String(row.id)}
            emptyText={emptyText}
            tableAdditionalHeader={
                
                    <AppText variant="smallHeader" className="p-3">
                        System Administrators
                    </AppText>
            }
            pagination={{
                currentPage,
                totalItems: paginatedData?.count ?? 0,
                pageSize: ADMINS_PAGE_LIMIT,
                onPageChange: setCurrentPage,
                itemLabel: "admins",
            }}
        />
    );
}