import { useState } from "react";
import { HeaderSection } from "../../components/header-section";
import { ReportHistoryTable, type ReportHistoryRow } from "./report-history-table";

const PAGE_SIZE = 4;

const REPORT_HISTORY_DATA: ReportHistoryRow[] = [
    { transactionId: "#CUR-2023-8821", operator: "Elena Rodriguez", date: "APR 30,26", amount: "$450.00", status: "cleared" },
    { transactionId: "#CUR-2023-8822", operator: "Marco Beltran", date: "FEB 30,26", amount: "$215.00", status: "pending" },
    { transactionId: "#CUR-2023-8823", operator: "Sofia Jensen", date: "APR 20,26", amount: "$320.00", status: "cleared" },
    { transactionId: "#CUR-2023-8824", operator: "Lucas Viana", date: "APR 16,26", amount: "$285.00", status: "pending" },
    { transactionId: "#CUR-2023-8825", operator: "Ana Torres", date: "APR 15,26", amount: "$540.00", status: "cleared" },
    { transactionId: "#CUR-2023-8826", operator: "Jorge Medina", date: "APR 14,26", amount: "$195.00", status: "pending" },
    { transactionId: "#CUR-2023-8827", operator: "Nina Clarke", date: "APR 13,26", amount: "$412.00", status: "cleared" },
    { transactionId: "#CUR-2023-8828", operator: "Arian Noor", date: "APR 12,26", amount: "$255.00", status: "pending" },
    { transactionId: "#CUR-2023-8829", operator: "Maya Islam", date: "APR 11,26", amount: "$374.00", status: "cleared" },
    { transactionId: "#CUR-2023-8830", operator: "Rafi Hasan", date: "APR 10,26", amount: "$299.00", status: "pending" },
    { transactionId: "#CUR-2023-8831", operator: "Sakib Khan", date: "APR 09,26", amount: "$610.00", status: "cleared" },
    { transactionId: "#CUR-2023-8832", operator: "Ivy Rahman", date: "APR 08,26", amount: "$187.00", status: "pending" },
];

export function ReportHistory() {
    const [currentPage, setCurrentPage] = useState(1);

    const paginatedData = REPORT_HISTORY_DATA.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE,
    );

    return (
        <>
            <HeaderSection
                title="Report & History"
                description={`Performance analytics and group comparison`}
                buttons={[]}
            />

            <div className="p-4">
                <ReportHistoryTable
                    data={paginatedData}
                    pagination={{
                        currentPage,
                        totalItems: REPORT_HISTORY_DATA.length,
                        pageSize: PAGE_SIZE,
                        onPageChange: setCurrentPage,
                        itemLabel: "operators",
                    }}
                    onExportPdf={() => {
                        console.log("Export report PDF");
                    }}
                    onDownloadCsv={() => {
                        console.log("Download report CSV");
                    }}
                />
            </div>
        </>
    );
}
