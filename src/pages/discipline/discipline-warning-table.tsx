import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { AppButton } from "../../components/button";
import { DeleteConfirmModal } from "../../components/delete-confirm-modal";
import {
    DISCIPLINE_WARNING_LOG_PAGE_SIZE,
    usePaginatedDisciplinaryWarningLog,
    useRevokeDisciplinaryWarning,
} from "../../lib/queries";
import { AppTable, type TableColumn } from "../../components/table";
import { AppText } from "../../components/text";
import type { DisciplinaryWarningLogItem } from "../../type";

interface DisciplineWarningRow {
    id: number;
    operatorId: string;
    operator: string;
    day: string;
    reason: string;
    warningCount: number;
    action: string;
}

function formatWarningDate(dateText: string): string {
    const date = new Date(dateText);

    if (Number.isNaN(date.getTime())) {
        return dateText;
    }

    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

function toWarningRow(item: DisciplinaryWarningLogItem): DisciplineWarningRow {
    return {
        id: item.id,
        operatorId: item.operator_id,
        operator: item.operator_name,
        day: formatWarningDate(item.date),
        reason: item.reason,
        warningCount: item.warning_count,
        action: item.action,
    };
}

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
    onRequestRevoke: (warningId: number) => void,
    isRevoking: boolean,
): TableColumn<DisciplineWarningRow>[] => [
    {
        key: "id",
        header: "ID",
        render: (row) => <AppText variant="description">#{row.id}</AppText>,
    },
    {
        key: "operator",
        header: "Operator",
        render: (row) => (
            <div className="flex flex-col">
                <AppText variant="body" className="font-semibold">
                    {row.operator}
                </AppText>
                <AppText variant="description" className="text-xs text-text-muted">
                    {row.operatorId}
                </AppText>
            </div>
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
                disabled={isRevoking || row.action !== "revoke_warning"}
                onClick={() => onRequestRevoke(row.id)}
            >
                Revoke
            </AppButton>
        ),
    },
];

export function DisciplineWarningTable() {
    const [currentPage, setCurrentPage] = useState(1);
    const [warningIdToRevoke, setWarningIdToRevoke] = useState<number | null>(null);
    const {
        data: warningLogData,
        isLoading: isWarningLogLoading,
        isError: isWarningLogError,
    } = usePaginatedDisciplinaryWarningLog(currentPage);
    const {
        mutateAsync: revokeWarning,
        isPending: isRevokingWarning,
    } = useRevokeDisciplinaryWarning();

    const warnings = useMemo<DisciplineWarningRow[]>(() => {
        return (warningLogData?.results ?? []).map(toWarningRow);
    }, [warningLogData]);

    const warningToRevoke = warnings.find((row) => row.id === warningIdToRevoke);

    const handleRequestRevoke = (warningId: number) => {
        setWarningIdToRevoke(warningId);
    };

    const handleCloseRevokeModal = () => {
        setWarningIdToRevoke(null);
    };

    const handleConfirmRevoke = async () => {
        if (!warningIdToRevoke) {
            return;
        }

        try {
            await revokeWarning(warningIdToRevoke);
            toast.success("Warning revoked successfully.");
            setWarningIdToRevoke(null);
        } catch {
            toast.error("Failed to revoke warning. Please try again.");
        }
    };

    const columns = buildWarningColumns(handleRequestRevoke, isRevokingWarning);

    const emptyText = isWarningLogLoading
        ? "Loading warnings..."
        : isWarningLogError
            ? "Failed to load warnings."
            : "No warnings found.";

    return (
        <>
            <AppTable
                columns={columns}
                data={warnings}
                rowKey={(row) => row.id}
                emptyText={emptyText}
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
                    totalItems: warningLogData?.count ?? 0,
                    pageSize: DISCIPLINE_WARNING_LOG_PAGE_SIZE,
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
                isConfirming={isRevokingWarning}
                confirmLoadingText="Revoking..."
            />
        </>
    );
}
