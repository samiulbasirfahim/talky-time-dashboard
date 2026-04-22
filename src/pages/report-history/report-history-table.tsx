import { Download, FileText } from "lucide-react";
import { AppButton } from "../../components/button";
import {
    AppTable,
    type PaginationProps,
    type TableColumn,
} from "../../components/table";
import { AppText } from "../../components/text";


export interface ReportHistoryRow {
    operatorID: string;
    operator: string;
    date: string;
    amount: string;
}

type ReportHistoryTableProps = {
    data: ReportHistoryRow[];
    pagination: PaginationProps;
    onExportPdf?: () => void;
    onDownloadCsv?: () => void;
};

const REPORT_HISTORY_COLUMNS: TableColumn<ReportHistoryRow>[] = [
    {
        key: "operatorID",
        header: "Operator ID",
        className: "text-sm text-text-secondary",
    },
    {
        key: "operator",
        header: "Operator",
        render: (row) => <AppText variant="description">{row.operator}</AppText>,
    },
    {
        key: "date",
        header: "Date",
        render: (row) => <AppText variant="description">{row.date}</AppText>,
    },
    {
        key: "amount",
        header: "Amount (COL)",
        align: "right",
        render: (row) => (
            <AppText variant="body" className="font-semibold">
                {row.amount}
            </AppText>
        ),
    }
];

export function ReportHistoryTable({
    data,
    pagination,
    onExportPdf,
    onDownloadCsv,
}: ReportHistoryTableProps) {
    return (
        <AppTable
            columns={REPORT_HISTORY_COLUMNS}
            data={data}
            rowKey={(row) => row.operatorID}
            emptyText="No financial history found."
            pagination={pagination}
            tableAdditionalHeader={
                <div className="flex items-center justify-between px-6 py-5">
                    <AppText variant="header" className="text-3xl font-semibold">
                        Recent Financial History
                    </AppText>
                    <div className="flex items-center gap-3">
                        <AppButton
                            variant="outline"
                            size="sm"
                            prefixIcon={FileText}
                            onClick={onExportPdf}
                            className="bg-bg-secondary/70 text-xs font-bold uppercase tracking-wide"
                        >
                            Export PDF
                        </AppButton>
                        <AppButton
                            variant="focus"
                            size="sm"
                            prefixIcon={Download}
                            onClick={onDownloadCsv}
                            className="text-xs font-bold uppercase tracking-wide"
                        >
                            Download CSV
                        </AppButton>
                    </div>
                </div>
            }
        />
    );
}
