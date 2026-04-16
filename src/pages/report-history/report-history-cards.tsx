import { AlertCircle, ChartNoAxesCombined, Network, type LucideIcon } from "lucide-react";
import { AppText } from "../../components/text";

type ReportHistoryCard = {
    label: string;
    value: string;
    valueSuffix?: string;
    cardBackground: string;
    icon: LucideIcon;
    iconBackground: string;
    iconColor: string;
};

const REPORT_HISTORY_CARDS: ReportHistoryCard[] = [
    {
        label: "Total Bonuses Paid",
        value: "COL$ 42,850.00",
        cardBackground: "bg-[#234EB71A]",
        icon: ChartNoAxesCombined,
        iconBackground: "bg-[#98B9F233]",
        iconColor: "text-[#2C61E5]",
    },
    {
        label: "Top Group",
        value: "Medellin",
        cardBackground: "bg-[#AA6DEC1A]",
        icon: Network,
        iconBackground: "bg-[#AA6DEC1A]",
        iconColor: "text-[#AA6DEC]",
    },
    {
        label: "Total Payout USD/COP",
        value: "58k",
        valueSuffix: "COP",
        cardBackground: "bg-[#FDA2A21A]",
        icon: AlertCircle,
        iconBackground: "bg-[#FF000033]",
        iconColor: "text-[#FF0000]",
    },
];

export function ReportHistoryCards() {
    return (
        <div className="grid grid-cols-1 gap-3 px-4 md:grid-cols-2 xl:grid-cols-3">
            {REPORT_HISTORY_CARDS.map((card) => (
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
    );
}
