import type { ReportsSummaryResponse } from "../../type";
import { ReportInfoLeftSection } from "./report-info-left-section";
import { ReportInfoRightSection } from "./report-info-right-section";

type ReportInfoProps = {
    summaryData?: ReportsSummaryResponse;
    isSummaryPending?: boolean;
    isSummaryError?: boolean;
};

export function ReportInfo({
    summaryData,
    isSummaryPending = false,
    isSummaryError = false,
}: ReportInfoProps) {
    return (
        <div className="grid grid-cols-1 gap-4 p-4 xl:grid-cols-5">
            <div className="space-y-4 xl:col-span-3">
                <ReportInfoLeftSection
                    summaryData={summaryData}
                    isSummaryPending={isSummaryPending}
                    isSummaryError={isSummaryError}
                />
            </div>
            <div className="xl:col-span-2">
                <ReportInfoRightSection />
            </div>
        </div>
    );
}