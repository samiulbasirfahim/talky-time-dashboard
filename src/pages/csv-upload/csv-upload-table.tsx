import { useEffect, useMemo, useState } from "react";
import { CheckCircle, XCircle, FileText, Clock } from "lucide-react";
import { AppText } from "../../components/text";
import {
    AppTable,
    type TableColumn,
} from "../../components/table";
import { useLatestCsvUploads } from "../../lib/queries";
import type { CsvLatestUploadItem } from "../../type";

// ─── Types ────────────────────────────────────────────────────────────────────

type UploadStatus = "success" | "error";

interface CsvUploadRow {
    id: number;
    filename: string;
    status: UploadStatus;
    records: number;
    uploadedBy: string;
    timestamp: string;
}

const PAGE_SIZE = 5;

const toRowStatus = (status: CsvLatestUploadItem["status"]): UploadStatus => {
    return status === "success" ? "success" : "error";
};

const toUploadedBy = (name: CsvLatestUploadItem["uploaded_by_name"]): string => {
    if (name === "supervisor") {
        return "Supervisor";
    }

    return "Admin";
};

const formatUploadedAt = (uploadedAt: string): string => {
    const date = new Date(uploadedAt);

    if (Number.isNaN(date.getTime())) {
        return uploadedAt;
    }

    return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    }).format(date);
};

// ─── Status Cell ──────────────────────────────────────────────────────────────

const StatusCell = ({ status }: { status: UploadStatus }) => {
    if (status === "success") {
        return (
            <div className="flex items-center gap-1.5">
                <CheckCircle size={14} className="text-green" />
                <AppText variant="description" className="text-sm font-medium text-green">
                    Success
                </AppText>
            </div>
        );
    }
    return (
        <div className="flex items-center gap-1.5">
            <XCircle size={14} className="text-red" />
            <AppText variant="description" className="text-sm font-medium text-red">
                Error
            </AppText>
        </div>
    );
};

// ─── Column Definitions ───────────────────────────────────────────────────────

const columns: TableColumn<CsvUploadRow>[] = [
    {
        key: "filename",
        header: "Filename",
        render: (row) => (
            <div className="flex items-center gap-2">
                <FileText size={16} className="text-text-muted shrink-0" />
                <AppText variant="description" className="text-sm text-text">
                    {row.filename}
                </AppText>
            </div>
        ),
    },
    {
        key: "status",
        header: "Status",
        render: (row) => <StatusCell status={row.status} />,
    },
    {
        key: "records",
        header: "Records",
        render: (row) => (
            <AppText variant="body" className="text-sm font-semibold">
                {row.records}
            </AppText>
        ),
    },
    {
        key: "uploadedBy",
        header: "Uploaded By",
        render: (row) => (
            <AppText variant="description" className="text-sm text-text-secondary">
                {row.uploadedBy}
            </AppText>
        ),
    },
    {
        key: "timestamp",
        header: "Timestamp",
        align: "right",
        render: (row) => (
            <div className="flex items-center gap-1.5 justify-end">
                <Clock size={14} className="text-text-muted" />
                <AppText variant="description" className="text-sm text-text-secondary">
                    {row.timestamp}
                </AppText>
            </div>
        ),
    },
];

export const CsvUploadTable = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const { data, isLoading, isError } = useLatestCsvUploads();

    const rows = useMemo<CsvUploadRow[]>(() => {
        return (data?.results ?? []).map((item) => ({
            id: item.id,
            filename: item.filename,
            status: toRowStatus(item.status),
            records: item.record_count,
            uploadedBy: toUploadedBy(item.uploaded_by_name),
            timestamp: formatUploadedAt(item.uploaded_at),
        }));
    }, [data]);

    useEffect(() => {
        const totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));

        if (currentPage > totalPages) {
            setCurrentPage(totalPages);
        }
    }, [currentPage, rows.length]);

    const paginatedData = rows.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE,
    );

    const emptyText = isLoading
        ? "Loading upload history..."
        : isError
            ? "Failed to load upload history."
            : "No upload history found.";

    return (
        <div className="p-4">
            <AppTable
                columns={columns}
                data={paginatedData}
                rowKey={(r) => r.id}
                emptyText={emptyText}
                tableAdditionalHeader={
                    <div className="flex items-center justify-between px-6 py-5">
                        <AppText variant="smallHeader" className="text-base font-bold">
                            Upload History
                        </AppText>
                        <AppText variant="description" className="text-sm italic text-text-muted">
                            Latest CSV uploads
                        </AppText>
                    </div>
                }
                pagination={{
                    currentPage,
                    totalItems: rows.length,
                    pageSize: PAGE_SIZE,
                    onPageChange: setCurrentPage,
                    itemLabel: "uploads",
                }}
            />
        </div>
    );
};
