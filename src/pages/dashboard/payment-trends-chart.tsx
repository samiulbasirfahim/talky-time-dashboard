import { useState } from "react";
import { AppText } from "../../components/text";
import { AppButton } from "../../components/button";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";

const dummyData = {
    monthly: [
        { date: "2026-04-01", payout: 5000 },
        { date: "2026-04-02", payout: 7000 },
        { date: "2026-04-03", payout: 6000 },
        { date: "2026-04-04", payout: 8000 },
        { date: "2026-04-05", payout: 7500 },
        { date: "2026-04-06", payout: 9000 },
        { date: "2026-04-07", payout: 8500 },
        { date: "2026-04-08", payout: 9500 },
        { date: "2026-04-09", payout: 10000 },
        { date: "2026-04-10", payout: 11000 },
        { date: "2026-04-11", payout: 10500 },
        { date: "2026-04-12", payout: 12000 },
        { date: "2026-04-13", payout: 11500 },
        { date: "2026-04-14", payout: 13000 },
        { date: "2026-04-15", payout: 12500 },
        { date: "2026-04-16", payout: 14000 },
        { date: "2026-04-17", payout: 13500 },
        { date: "2026-04-18", payout: 15000 },
        { date: "2026-04-19", payout: 14500 },
        { date: "2026-04-20", payout: 16000 },
        { date: "2026-04-21", payout: 15500 },
        { date: "2026-04-22", payout: 17000 },
        { date: "2026-04-23", payout: 16500 },
        { date: "2026-04-24", payout: 18000 },
        { date: "2026-04-25", payout: 17500 },
        { date: "2026-04-26", payout: 19000 },
        { date: "2026-04-27", payout: 18500 },
        { date: "2026-04-28", payout: 20000 },
        { date: "2026-04-29", payout: 19500 },
        { date: "2026-04-30", payout: 21000 },
    ],
    weekly: [
        { date: "2026-04-24", payout: 18000 },
        { date: "2026-04-25", payout: 17500 },
        { date: "2026-04-26", payout: 19000 },
        { date: "2026-04-27", payout: 18500 },
        { date: "2026-04-28", payout: 20000 },
        { date: "2026-04-29", payout: 19500 },
        { date: "2026-04-30", payout: 21000 },
    ],
};

type TextAnchor = "start" | "middle" | "end";
export function PaymentTrendsChart() {
    const [selectedTimeframe, setSelectedTimeframe] = useState<
        "Monthly" | "Weekly"
    >("Monthly");

    const data =
        selectedTimeframe === "Monthly" ? dummyData.monthly : dummyData.weekly;

    const getBarColor = (payout: number) => {
        const min = 5000;
        const max = 21000;
        const ratio = (payout - min) / (max - min);

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
        <div className="p-4 w-full rounded-md shadow-border shadow-xs">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <AppText variant="header">Total Payout Trends</AppText>
                    <AppText variant="description">
                        Revenue distribution over the last{" "}
                        {selectedTimeframe === "Monthly" ? "30" : "7"} days
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
