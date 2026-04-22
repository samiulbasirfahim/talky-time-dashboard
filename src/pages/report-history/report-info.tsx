
import { ReportInfoLeftSection } from "./report-info-left-section"
import { ReportInfoRightSection } from "./report-info-right-section"




export function ReportInfo() {
    return (
        <div className="grid grid-cols-1 gap-4 p-4 xl:grid-cols-5">
            <div className="xl:col-span-3 space-y-4">
                <ReportInfoLeftSection />
            </div>
            <div className="xl:col-span-2">
                <ReportInfoRightSection />
            </div>
        </div>
    )
}