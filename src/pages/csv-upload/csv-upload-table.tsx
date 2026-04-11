import { useState } from "react";
import { CheckCircle, XCircle, FileText, Clock } from "lucide-react";
import { AppText } from "../../components/text";
import {
    AppTable,
    type TableColumn,
} from "../../components/table";

// ─── Types ────────────────────────────────────────────────────────────────────

type UploadStatus = "success" | "error";

interface CsvUploadRow {
    id: string;
    filename: string;
    status: UploadStatus;
    records: number;
    uploadedBy: string;
    timestamp: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_DATA: CsvUploadRow[] = [
    { id: "1", filename: "bonuses_2024_03_28.csv", status: "success", records: 48, uploadedBy: "Admin", timestamp: "2024-03-28 09:15" },
    { id: "2", filename: "bonuses_2024_03_27.csv", status: "success", records: 46, uploadedBy: "Admin", timestamp: "2024-03-27 09:02" },
    { id: "3", filename: "bonuses_2024_03_26.csv", status: "error", records: 12, uploadedBy: "Supervisor", timestamp: "2024-03-26 09:30" },
    { id: "4", filename: "bonuses_2024_03_25.csv", status: "success", records: 50, uploadedBy: "Admin", timestamp: "2024-03-25 08:55" },
    { id: "5", filename: "bonuses_2024_03_24.csv", status: "success", records: 44, uploadedBy: "Admin", timestamp: "2024-03-24 09:10" },
    { id: "6", filename: "bonuses_2024_03_23.csv", status: "success", records: 38, uploadedBy: "Admin", timestamp: "2024-03-23 10:05" },
    { id: "7", filename: "bonuses_2024_03_22.csv", status: "error", records: 5, uploadedBy: "Supervisor", timestamp: "2024-03-22 08:40" },
    { id: "8", filename: "bonuses_2024_03_21.csv", status: "success", records: 52, uploadedBy: "Admin", timestamp: "2024-03-21 09:20" },
    { id: "9", filename: "bonuses_2024_03_20.csv", status: "success", records: 41, uploadedBy: "Admin", timestamp: "2024-03-20 09:00" },
    { id: "10", filename: "bonuses_2024_03_19.csv", status: "success", records: 47, uploadedBy: "Admin", timestamp: "2024-03-19 08:50" },
    { id: "11", filename: "bonuses_2024_03_18.csv", status: "error", records: 3, uploadedBy: "Supervisor", timestamp: "2024-03-18 09:35" },
    { id: "12", filename: "bonuses_2024_03_17.csv", status: "success", records: 55, uploadedBy: "Admin", timestamp: "2024-03-17 08:30" },
];

const PAGE_SIZE = 5;

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

    const paginatedData = MOCK_DATA.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE,
    );

    return (
        <div className="p-4">
            <AppTable
                columns={columns}
                data={paginatedData}
                rowKey={(r) => r.id}
                emptyText="No upload history found."
                tableAdditionalHeader={
                    <div className="flex items-center justify-between px-6 py-5">
                        <AppText variant="smallHeader" className="text-base font-bold">
                            Upload History
                        </AppText>
                        <AppText variant="description" className="text-sm italic text-text-muted">
                            Last 5 uploads
                        </AppText>
                    </div>
                }
                pagination={{
                    currentPage,
                    totalItems: MOCK_DATA.length,
                    pageSize: PAGE_SIZE,
                    onPageChange: setCurrentPage,
                    itemLabel: "uploads",
                }}
            />
        </div>
    );
};
