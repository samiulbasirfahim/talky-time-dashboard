import { AppButton } from "../../components/button"
import { AppText } from "../../components/text"
import {
    GROUP_CHIP_CLASS,
    MONTHLY_GROUP_COMPARISON,
    TOP_OPERATORS,
} from "./report-info-data"

export function ReportInfoRightSection() {
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
                                <AppText variant="body" className="font-semibold text-text">
                                    {operator.name}
                                </AppText>
                                <span
                                    className={`mt-1 inline-flex rounded-md px-2 py-0.5 text-sm font-semibold ${GROUP_CHIP_CLASS[operator.group]}`}
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
                    onClick={() => { }}
                >
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