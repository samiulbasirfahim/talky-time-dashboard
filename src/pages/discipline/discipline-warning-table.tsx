import { useState } from "react";
import { AppButton } from "../../components/button";
import { DeleteConfirmModal } from "../../components/delete-confirm-modal";
import { AppTable, type TableColumn } from "../../components/table";
import { AppText } from "../../components/text";

interface DisciplineWarningRow {
    id: string;
    operator: string;
    day: string;
    reason: string;
    warningCount: number;
}

const PAGE_SIZE = 3;

const MOCK_WARNING_ROWS: DisciplineWarningRow[] = [
    {
        id: "#001",
        operator: "Sofia_P",
        day: "3 April",
        reason: "Late Response (5min+)",
        warningCount: 1,
    },
    {
        id: "#002",
        operator: "Luna_",
        day: "5 April",
        reason: "Disconnected During Live Shift",
        warningCount: 2,
    },
    {
        id: "#003",
        operator: "Aria 35",
        day: "7 April",
        reason: "Unauthorized Break Extension",
        warningCount: 1,
    },
    {
        id: "#004",
        operator: "Mira_9",
        day: "9 April",
        reason: "Unapproved Shift Swap",
        warningCount: 3,
    },
    {
        id: "#005",
        operator: "Nico_2",
        day: "10 April",
        reason: "Late Login (10min)",
        warningCount: 2,
    },
    {
        id: "#006",
        operator: "Reza_1",
        day: "12 April",
        reason: "Missed Mandatory Check-in",
        warningCount: 1,
    },
];

function WarningCountCell({ value }: { value: number }) {
    const max = 3;
    const clamped = Math.min(Math.max(value, 0), max);

    return (
        <div className="flex items-center gap-2 justify-end">
            <div className="flex items-center gap-1">
                {Array.from({ length: max }).map((_, index) => (
                    <span
                        key={index}
                        className={`h-2.5 w-2.5 rounded-full ${
                            index < clamped ? "bg-red" : "bg-bg-secondary"
                        }`}
                    />
                ))}
            </div>
            <AppText
                variant="description"
                className={`text-sm font-semibold ${
                    clamped >= 2 ? "text-red" : "text-text-secondary"
                }`}
            >
                {clamped}/{max}
            </AppText>
        </div>
    );
}

const buildWarningColumns = (
    onRequestRevoke: (warningId: string) => void,
): TableColumn<DisciplineWarningRow>[] => [
    {
        key: "id",
        header: "ID",
        render: (row) => <AppText variant="description">{row.id}</AppText>,
    },
    {
        key: "operator",
        header: "Operator",
        render: (row) => (
            <AppText variant="body" className="font-semibold">
                {row.operator}
            </AppText>
        ),
    },
    {
        key: "day",
        header: "Day",
        render: (row) => <AppText variant="description">{row.day}</AppText>,
    },
    {
        key: "reason",
        header: "Reason",
        render: (row) => <AppText variant="description">{row.reason}</AppText>,
    },
    {
        key: "warningCount",
        header: "Warning Count",
        align: "right",
        render: (row) => <WarningCountCell value={row.warningCount} />,
    },
    {
        key: "action",
        header: "Action",
        align: "right",
        render: (row) => (
            <AppButton
                variant="link"
                size="sm"
                className="p-0 text-sm font-semibold"
                onClick={() => onRequestRevoke(row.id)}
            >
                Revoke
            </AppButton>
        ),
    },
];

export function DisciplineWarningTable() {
    const [warnings, setWarnings] = useState<DisciplineWarningRow[]>(MOCK_WARNING_ROWS);
    const [currentPage, setCurrentPage] = useState(1);
    const [warningIdToRevoke, setWarningIdToRevoke] = useState<string | null>(null);

    const warningToRevoke = warnings.find((row) => row.id === warningIdToRevoke);

    const handleRequestRevoke = (warningId: string) => {
        setWarningIdToRevoke(warningId);
    };

    const handleCloseRevokeModal = () => {
        setWarningIdToRevoke(null);
    };

    const handleConfirmRevoke = () => {
        if (!warningIdToRevoke) {
            return;
        }

        setWarnings((prev) => {
            const updated = prev.filter((row) => row.id !== warningIdToRevoke);
            const totalPages = Math.max(1, Math.ceil(updated.length / PAGE_SIZE));
            if (currentPage > totalPages) {
                setCurrentPage(totalPages);
            }
            return updated;
        });

        setWarningIdToRevoke(null);
    };

    const columns = buildWarningColumns(handleRequestRevoke);

    const paginatedData = warnings.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE,
    );

    return (
        <>
            <AppTable
                columns={columns}
                data={paginatedData}
                rowKey={(row) => row.id}
                emptyText="No warnings found."
                tableAdditionalHeader={
                    <div className="flex items-center gap-3 px-6 py-5">
                        <AppText variant="smallHeader" className="text-3xl font-semibold">
                            Warning Log
                        </AppText>
                        <AppText variant="description" className="text-text-muted">
                            (April 2026)
                        </AppText>
                    </div>
                }
                pagination={{
                    currentPage,
                    totalItems: warnings.length,
                    pageSize: PAGE_SIZE,
                    onPageChange: setCurrentPage,
                    itemLabel: "warnings",
                }}
            />

            <DeleteConfirmModal
                open={Boolean(warningIdToRevoke)}
                onCancel={handleCloseRevokeModal}
                onConfirm={handleConfirmRevoke}
                title={warningToRevoke ? `Revoke warning ${warningToRevoke.id}?` : "Revoke warning?"}
                description="This warning entry will be revoked and removed from the warning log."
                confirmText="Revoke"
                cancelText="Cancel"
                ariaLabel="Confirm revoke warning"
            />
        </>
    );
}
