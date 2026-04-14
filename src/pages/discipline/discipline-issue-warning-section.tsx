import { ArrowRight } from "lucide-react";
import { AppButton } from "../../components/button";
import { AppText } from "../../components/text";

type ReprimandHistoryRow = {
    operator: string;
    month: string;
    deduction: string;
};

const REPRIMAND_HISTORY: ReprimandHistoryRow[] = [
    {
        operator: "Luna_",
        month: "March 2026",
        deduction: "-100,000 COP",
    },
    {
        operator: "Aria 35",
        month: "February 2026",
        deduction: "-100,000 COP",
    },
];

export function DisciplineIssueWarningSection() {
    return (
        <div className="p-4">
            <div className="grid grid-cols-1 items-start gap-4 xl:grid-cols-2">
                <div className="h-fit w-full space-y-5 rounded-md p-4 shadow-border shadow-xs">
                        <AppText variant="smallHeader" className="font-semibold text-text">
                            Issue Warning
                        </AppText>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <AppText variant="description" className="text-xs font-bold uppercase tracking-[0.14em] text-text-secondary">
                                    Operator ID / Name
                                </AppText>
                                <input
                                    type="text"
                                    placeholder="Select operator..."
                                    className="h-11 w-full rounded-lg border border-border bg-tab-bg px-4 text-base text-text-secondary outline-none placeholder:text-text-muted focus:border-text-focus focus:bg-white"
                                />
                            </div>

                            <div className="space-y-2">
                                <AppText variant="description" className="text-xs font-bold uppercase tracking-[0.14em] text-text-secondary">
                                    Date
                                </AppText>
                                <div className="relative">
                                    <input
                                        type="date"
                                        defaultValue="2026-04-12"
                                        className="h-11 w-full rounded-lg border border-border bg-tab-bg px-4 text-base text-text outline-none focus:border-text-focus focus:bg-white"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <AppText variant="description" className="text-xs font-bold uppercase tracking-[0.14em] text-text-secondary">
                                Reason for Warning
                            </AppText>
                            <textarea
                                rows={3}
                                placeholder="Describe the violation in detail..."
                                className="w-full resize-none rounded-lg border border-border bg-tab-bg px-4 py-3 text-base text-text-secondary outline-none placeholder:text-text-muted focus:border-text-focus focus:bg-white"
                            />
                        </div>

                        <AppButton type="button" variant="focus" fullWidth className="h-12 rounded-lg text-base font-semibold">
                            Issue Warning
                        </AppButton>
                </div>

                <div className="h-fit w-full space-y-5 rounded-md p-4 shadow-border shadow-xs">
                        <AppText variant="smallHeader" className="font-semibold text-text">
                            Reprimand History
                        </AppText>

                        <div className="grid grid-cols-3 gap-4 pb-1">
                            <AppText variant="description" className="text-xs font-bold uppercase tracking-[0.14em] text-text-muted">
                                Operator
                            </AppText>
                            <AppText variant="description" className="text-xs font-bold uppercase tracking-[0.14em] text-text-muted">
                                Month
                            </AppText>
                            <AppText variant="description" className="text-right text-xs font-bold uppercase tracking-[0.14em] text-text-muted">
                                Deduction
                            </AppText>
                        </div>

                        <div className="space-y-5">
                            {REPRIMAND_HISTORY.map((entry) => (
                                <div key={`${entry.operator}-${entry.month}`} className="grid grid-cols-3 gap-4">
                                    <AppText variant="body" className="text-base font-semibold text-text">
                                        {entry.operator}
                                    </AppText>
                                    <AppText variant="description" className="text-base text-text-secondary">
                                        {entry.month}
                                    </AppText>
                                    <span  className="text-right text-base font-semibold text-red">
                                        {entry.deduction}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <button
                            type="button"
                            className="ml-auto flex items-center gap-2 text-sm font-semibold text-text-secondary hover:text-text-focus"
                        >
                            View All Financial Deductions
                            <ArrowRight size={16} />
                        </button>
                </div>
            </div>
        </div>
    );
}
