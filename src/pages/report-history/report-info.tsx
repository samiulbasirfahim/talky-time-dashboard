import { CircleMinus, TriangleAlert } from "lucide-react"
import { AppButton } from "../../components/button"
import { ProfileTrendChart, type ProfileTrendTimeframe } from "../../components/profile-trend-chart"
import { AppText } from "../../components/text"
import { SegmentedTabBar } from "../../components/segmented-tab-bar"
import { useState } from "react"

type TopOperator = {
    name: string
    group: string
    amount: string
    change: string
}

type GroupComparison = {
    name: string
    amount: string
}

const TOP_OPERATORS: TopOperator[] = [
    { name: "Elena Rodriguez", group: "Medellin", amount: "CO$ 1,240", change: "+18%" },
    { name: "Sofia Jensen", group: "Remote", amount: "CO$1,105", change: "+12%" },
    { name: "Marco Beltran", group: "Bogota", amount: "CO$980", change: "+5%" },
]

const MONTHLY_GROUP_COMPARISON: GroupComparison[] = [
    { name: "Medellin", amount: "CO$1,300" },
    { name: "Bogota", amount: "CO$680" },
    { name: "Remote", amount: "CO$1800" },
]

const groupChipClass: Record<string, string> = {
    Medellin: "bg-[#DBE7FF] text-[#1D4ED8]",
    Bogota: "bg-[#DBE7FF] text-[#1D4ED8]",
    Remote: "bg-[#EDF2F7] text-[#475569]",
}

const CHART_TABS = [
    { label: "Weekly", value: "weekly" as const },
    { label: "Monthly", value: "monthly" as const },
]

function ReportInfoRightSection() {
    return (
        <div className="space-y-4">
            <section className="rounded-[28px] border border-border bg-bg px-8 py-7 shadow-xs">
                <AppText variant="smallHeader" className="text-4xl font-semibold text-text">
                    Top Operators
                </AppText>

                <div className="mt-7 space-y-6">
                    {TOP_OPERATORS.map((operator) => (
                        <div key={operator.name} className="flex items-start justify-between gap-3">
                            <div>
                                <AppText variant="body" className=" font-semibold text-text">
                                    {operator.name}
                                </AppText>
                                <span
                                    className={`mt-1 inline-flex rounded-md px-2 py-0.5 text-sm font-semibold ${groupChipClass[operator.group]}`}
                                >
                                    {operator.group}
                                </span>
                            </div>

                            <div className="text-right">
                                <AppText variant="body" className="font-semibold text-text">
                                    {operator.amount}
                                </AppText>
                                <AppText variant="description" className="font-bold text-green!">
                                    {operator.change}
                                </AppText>
                            </div>
                        </div>
                    ))}
                </div>

                <AppButton
                    variant="bg"
                    fullWidth
                    className="mt-6"
                    onClick={() => { }}       >
                    View All Performance
                </AppButton>
            </section>

            <section className="rounded-[28px] bg-[#2F68AB] px-8 py-8 text-white shadow-[0_18px_28px_rgba(47,104,171,0.22)]">
                <AppText variant="smallHeader" className="text-4xl font-semibold text-white">
                    Monthly Group Comparison
                </AppText>

                <div className="mt-8 space-y-6">
                    {MONTHLY_GROUP_COMPARISON.map((group) => (
                        <div key={group.name} className="flex items-center justify-between">
                            <AppText variant="body" className="text-white/95">
                                {group.name}
                            </AppText>
                            <AppText variant="body" className="text-white">
                                {group.amount}
                            </AppText>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    )
}

function ReportInfoLeftSection() {
    const [selectedTab, setSelectedTab] = useState<ProfileTrendTimeframe>("weekly")

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
                        <AppText variant="body" style={{
                            color: "#BA1A1A"
                        }}>
                            Active Warnings
                        </AppText>
                        <div className="flex items-end gap-2">
                            <AppText variant="header"
                                style={{
                                    color: "#93000A"
                                }}
                            >
                                5
                            </AppText>
                            <AppText variant="description" className="text-text-muted text-sm font-light"> across 8 operators</AppText>
                        </div>
                    </div>
                </div>

                <div className="flex flex-row bg-tab-bg rounded-2xl px-8 py-6 items-center">
                    <div className="flex items-center justify-center rounded-full bg-[#E2E8F0] p-3">
                        <CircleMinus size={26} className="text-[#475569]" strokeWidth={2} />
                    </div>
                    <div className="ml-6">
                        <AppText variant="body" style={{
                            color: "#475569"
                        }}>
                            Total Deductions
                        </AppText>
                        <div className="flex items-end gap-2">
                            <AppText variant="header"
                                style={{
                                    color: "#0F172A"
                                }}
                            >
                                $840.00
                            </AppText>
                            <AppText variant="description" className="text-text-muted text-sm font-light"> COl</AppText>
                        </div>
                        <AppText variant="description" className="text-text-muted text-sm font-light">total</AppText>
                    </div>
                </div>
            </div>

            <div className="border-border border rounded-2xl shadow-xs p-8 w-full">
                <div className="flex flex-wrap items-center justify-between gap-3 w-full">
                    <AppText variant="smallHeader" className="font-semibold text-text col-span-2 py-4">
                        Weekly Bonus Distribution
                    </AppText>
                    <SegmentedTabBar
                        value={selectedTab}
                        options={CHART_TABS}
                        onChange={setSelectedTab}
                    />
                </div>
                <div className="mt-6 h-92.5 w-full">
                    <ProfileTrendChart timeframe={selectedTab} className="h-full w-full" />
                </div>
            </div>
        </div>

    )
}



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