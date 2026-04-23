import { HeaderSection } from "../../components/header-section";
import { useReportsSummary } from "../../lib/queries";
import { ReportHistoryCards } from "./report-history-cards";
import { ReportInfo } from "./report-info";

export function ReportHistory() {
    const {
        data: summaryData,
        isPending: isSummaryPending,
        isError: isSummaryError,
    } = useReportsSummary();

    return (
        <>
            <HeaderSection
                title="Report & History"
                description={`Performance analytics and group comparison`}
                buttons={[]}
            />
            <ReportHistoryCards
                summaryData={summaryData}
                isSummaryPending={isSummaryPending}
                isSummaryError={isSummaryError}
            />
            <ReportInfo
                summaryData={summaryData}
                isSummaryPending={isSummaryPending}
                isSummaryError={isSummaryError}
            />

            {/* <div className="p-4">
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
            </div> */}
        </>
    );
}
