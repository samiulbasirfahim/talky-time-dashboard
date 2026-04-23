import { useState } from "react";
import { AppText } from "../../components/text";
import { AppButton } from "../../components/button";
import { useDashboardEarnings } from "../../lib/queries";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";

type PayoutPoint = {
    date: string;
    payout: number;
};

type TextAnchor = "start" | "middle" | "end";
export function PaymentTrendsChart() {
    const [selectedTimeframe, setSelectedTimeframe] = useState<
        "Monthly" | "Weekly"
    >("Monthly");
    const { data: earnings, isLoading, isError } = useDashboardEarnings();

    const monthlyData: PayoutPoint[] = (earnings?.monthly_bonus_series ?? []).map((item) => ({
        date: item.date,
        payout: item.total_bonus,
    }));

    const weeklyData: PayoutPoint[] = (earnings?.weekly_bonus_series ?? []).map((item) => ({
        date: item.date,
        payout: item.total_bonus,
    }));

    const data =
        selectedTimeframe === "Monthly" ? monthlyData : weeklyData;

    const payouts = data.map((item) => item.payout);
    const minPayout = payouts.length > 0 ? Math.min(...payouts) : 0;
    const maxPayout = payouts.length > 0 ? Math.max(...payouts) : 1;

    const getBarColor = (payout: number) => {
        if (maxPayout === minPayout) {
            return "#2C61E540";
        }

        const ratio = (payout - minPayout) / (maxPayout - minPayout);

        if (ratio > 0.8) return "#2C61E5DD";
        if (ratio > 0.6) return "#2C61E580";
        if (ratio > 0.4) return "#2C61E540";
        if (ratio > 0.2) return "#2C61E526";
        return "#2C61E51A";
    };

    const CustomBarShape = (props: any) => {
        const { x, y, width, height, payload } = props;

        // Ensure height is at least a pixel so it's always visible during transition
        const barHeight = Math.max(height, 0);

        return (
            <rect
                x={x}
                y={y}
                width={width}
                height={barHeight}
                fill={getBarColor(payload.payout)}
                rx={4}
                ry={4}
                className="transition-all duration-500 ease-in-out"
            />
        );
    };

    const getTicks = () => {
        if (data.length === 0) {
            return [];
        }

        if (selectedTimeframe === "Weekly") {
            return data.map((d) => d.date); // Show every day for weekly
        }
        // For monthly, grab the first, middle, and last date
        return [
            data[0].date,
            data[Math.floor(data.length / 2)].date,
            data[data.length - 1].date,
        ];
    };

    return (
        <div className="p-4 w-full rounded-md shadow-border shadow-xs border border-border">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <AppText variant="header">Total Payout Trends</AppText>
                    <AppText variant="description">
                        Revenue distribution over the last {data.length} days
                    </AppText>
                </div>
                <div className="space-x-2">
                    <AppButton
                        variant={selectedTimeframe === "Weekly" ? "focus" : "outline"}
                        onClick={() => setSelectedTimeframe("Weekly")}
                    >
                        Weekly
                    </AppButton>
                    <AppButton
                        variant={selectedTimeframe === "Monthly" ? "focus" : "outline"}
                        onClick={() => setSelectedTimeframe("Monthly")}
                    >
                        Monthly
                    </AppButton>
                </div>
            </div>

            {isLoading && (
                <AppText variant="description" className="mb-3 text-text-muted">
                    Loading payout trends...
                </AppText>
            )}

            {isError && (
                <AppText variant="description" className="mb-3 text-red">
                    Failed to load payout trends.
                </AppText>
            )}

            <ResponsiveContainer width={"100%"} height={400}>
                <BarChart
                    data={data}
                    margin={{ top: 20, right: 0, left: 0, bottom: 0 }}
                >
                    <XAxis
                        dataKey="date"
                        axisLine={false}
                        tickLine={false}
                        ticks={getTicks()}
                        interval={0}
                        padding={{ left: 10, right: 10 }}
                        tick={(props: any) => {
                            if (data.length === 0) {
                                return null;
                            }

                            const x = Number(props.x);
                            const y = Number(props.y);
                            const { payload } = props;

                            let anchor: TextAnchor = "middle";
                            const isFirst = payload.value === data[0].date;
                            const isLast = payload.value === data[data.length - 1].date;

                            if (isFirst) anchor = "start";
                            else if (isLast) anchor = "end";

                            return (
                                <text
                                    x={x}
                                    y={y}
                                    dy={16}
                                    fill="#94A3B8"
                                    fontSize={13}
                                    fontWeight={400}
                                    textAnchor={anchor}
                                    fontFamily="Inter"
                                >
                                    {(() => {
                                        const date = new Date(payload.value);
                                        return `${date.toLocaleString("en-US", { month: "short" }).toUpperCase()} ${String(date.getDate()).padStart(2, "0")}`;
                                    })()}
                                </text>
                            );
                        }}
                    />

                    <Tooltip cursor={{ fill: "transparent" }} animationDuration={300} />
                    <Bar
                        dataKey="payout"
                        id="payout-bar-group"
                        shape={<CustomBarShape />}
                        isAnimationActive={true}
                        animationDuration={800}
                        animationEasing="ease-in-out"
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
