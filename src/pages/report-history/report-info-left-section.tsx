import { CircleMinus, TriangleAlert } from "lucide-react"
import { useState } from "react"
import { ProfileTrendChart, type ProfileTrendTimeframe } from "../../components/profile-trend-chart"
import { useDashboardEarnings } from "../../lib/queries"
import { SegmentedTabBar } from "../../components/segmented-tab-bar"
import { AppText } from "../../components/text"
import { CHART_TABS } from "./report-info-data"

export function ReportInfoLeftSection() {
    const [selectedTab, setSelectedTab] = useState<ProfileTrendTimeframe>("weekly")
    const { data: earningsData } = useDashboardEarnings()

    return (
        <div className="space-y-4">
            <div className="border-border border rounded-2xl shadow-xs p-8 w-full grid-cols-2 grid gap-6">
                <AppText variant="smallHeader" className="font-semibold text-text col-span-2 py-4">
                    Deductions & Compliance Summary
                </AppText>

                <div className="flex flex-row bg-[#FFDAD64D] rounded-2xl px-8 py-6 items-center">
                    <div className="flex items-center justify-center rounded-full bg-bg-danger/10 p-3">
                        <TriangleAlert size={26} className="text-[#93000A]" strokeWidth={2} />
                    </div>
                    <div className="ml-6">
                        <AppText variant="body" style={{ color: "#BA1A1A" }}>
                            Active Warnings
                        </AppText>
                        <div className="flex items-end gap-2">
                            <AppText variant="header" style={{ color: "#93000A" }}>
                                5
                            </AppText>
                            <AppText variant="description" className="text-text-muted text-sm font-light">
                                {" "}
                                across 8 operators
                            </AppText>
                        </div>
                    </div>
                </div>

                <div className="flex flex-row bg-tab-bg rounded-2xl px-8 py-6 items-center">
                    <div className="flex items-center justify-center rounded-full bg-[#E2E8F0] p-3">
                        <CircleMinus size={26} className="text-[#475569]" strokeWidth={2} />
                    </div>
                    <div className="ml-6">
                        <AppText variant="body" style={{ color: "#475569" }}>
                            Total Deductions
                        </AppText>
                        <div className="flex items-end gap-2">
                            <AppText variant="header" style={{ color: "#0F172A" }}>
                                $840.00
                            </AppText>
                            <AppText variant="description" className="text-text-muted text-sm font-light">
                                {" "}
                                COl
                            </AppText>
                        </div>
                        <AppText variant="description" className="text-text-muted text-sm font-light">
                            total
                        </AppText>
                    </div>
                </div>
            </div>

            <div className="border-border border rounded-2xl shadow-xs p-8 w-full">
                <div className="flex flex-wrap items-center justify-between gap-3 w-full">
                    <AppText variant="smallHeader" className="font-semibold text-text col-span-2 py-4">
                        {
                            selectedTab === "weekly"
                                ? "Weekly Bonus Distribution"
                                :
                                "Monthly Bonus Distribution"

                        }
                    </AppText>
                    <SegmentedTabBar
                        value={selectedTab}
                        options={CHART_TABS}
                        onChange={setSelectedTab}
                    />
                </div>
                <div className="mt-6 h-92.5 w-full">
                    <ProfileTrendChart timeframe={selectedTab} className="h-full w-full" earningsData={earningsData} />
                </div>
            </div>
        </div>
    )
}