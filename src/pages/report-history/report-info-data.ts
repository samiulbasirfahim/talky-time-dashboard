export type TopOperator = {
    name: string
    group: string
    amount: string
    change: string
}

export type GroupComparison = {
    name: string
    amount: string
}

export const TOP_OPERATORS: TopOperator[] = [
    { name: "Elena Rodriguez", group: "Medellin", amount: "CO$ 1,240", change: "+18%" },
    { name: "Sofia Jensen", group: "Remote", amount: "CO$1,105", change: "+12%" },
    { name: "Marco Beltran", group: "Bogota", amount: "CO$980", change: "+5%" },
]

export const MONTHLY_GROUP_COMPARISON: GroupComparison[] = [
    { name: "Medellin", amount: "CO$1,300" },
    { name: "Bogota", amount: "CO$680" },
    { name: "Remote", amount: "CO$1800" },
]

export const GROUP_CHIP_CLASS: Record<string, string> = {
    Medellin: "bg-[#DBE7FF] text-[#1D4ED8]",
    Bogota: "bg-[#DBE7FF] text-[#1D4ED8]",
    Remote: "bg-[#EDF2F7] text-[#475569]",
}

export const CHART_TABS = [
    { label: "Weekly", value: "weekly" as const },
    { label: "Monthly", value: "monthly" as const },
]