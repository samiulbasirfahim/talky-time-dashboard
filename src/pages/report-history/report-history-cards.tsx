import { AlertCircle, ChartNoAxesCombined, Network, type LucideIcon } from "lucide-react";
import { AppText } from "../../components/text";
import type { ReportsSummaryResponse } from "../../type";

type ReportHistoryCard = {
    label: string;
    value: string;
    valueSuffix?: string;
    cardBackground: string;
    icon: LucideIcon;
    iconBackground: string;
    iconColor: string;
};

type ReportHistoryCardsProps = {
    summaryData?: ReportsSummaryResponse;
    isSummaryPending?: boolean;
    isSummaryError?: boolean;
};

const formatCop = (value: number | undefined) => {
    return `CO$ ${(value ?? 0).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;
};

export function ReportHistoryCards({
    summaryData,
    isSummaryPending = false,
    isSummaryError = false,
}: ReportHistoryCardsProps) {
    const reportHistoryCards: ReportHistoryCard[] = [
        {
            label: "Total Bonuses Paid",
            value: isSummaryPending ? "Loading..." : formatCop(summaryData?.total_bonus_paid),
            cardBackground: "bg-[#234EB71A]",
            icon: ChartNoAxesCombined,
            iconBackground: "bg-[#98B9F233]",
            iconColor: "text-[#2C61E5]",
        },
        {
            label: "Top Group",
            value: isSummaryPending ? "Loading..." : (summaryData?.top_group?.group_name ?? "N/A"),
            cardBackground: "bg-[#AA6DEC1A]",
            icon: Network,
            iconBackground: "bg-[#AA6DEC1A]",
            iconColor: "text-[#AA6DEC]",
        },
        {
            label: "Total Payout USD/COP",
            value: isSummaryPending ? "Loading..." : formatCop(summaryData?.total_payout),
            valueSuffix: "COP",
            cardBackground: "bg-[#FDA2A21A]",
            icon: AlertCircle,
            iconBackground: "bg-[#FF000033]",
            iconColor: "text-[#FF0000]",
        },
    ];

    return (
        <div className="space-y-2 px-4">
            {isSummaryError && (
                <AppText variant="description" className="text-red">
                    Failed to load reports summary. Showing fallback values.
                </AppText>
            )}
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
                {reportHistoryCards.map((card) => (
                    <div
                        key={card.label}
                        className={`flex flex-col rounded-2xl border border-transparent p-5 transition-all hover:border-border/50 ${card.cardBackground}`}
                    >
                        <div className="mb-8">
                            <div className={`inline-flex rounded-xl p-2.5 ${card.iconBackground} ${card.iconColor}`}>
                                <card.icon size={22} strokeWidth={2.5} />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <AppText variant="description" className="text-base text-text-secondary">
                                {card.label}
                            </AppText>

                            <div className="flex items-end gap-1">
                                <AppText variant="header">{card.value}</AppText>
                                {card.valueSuffix && (
                                    <AppText variant="description" className="pb-1 font-semibold uppercase text-text-muted">
                                        {card.valueSuffix}
                                    </AppText>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
