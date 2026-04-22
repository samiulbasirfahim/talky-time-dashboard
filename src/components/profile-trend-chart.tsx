import { Bar, BarChart, Cell, ResponsiveContainer, XAxis } from "recharts"
import { useDashboardEarnings } from "../lib/queries"
import type { DashboardEarningsResponse } from "../type"

export type ProfileTrendTimeframe = "weekly" | "monthly"

type TrendPoint = {
    label: string
    payout: number
}

type ProfileTrendChartProps = {
    timeframe: ProfileTrendTimeframe
    className?: string
    earningsData?: DashboardEarningsResponse
}

export function ProfileTrendChart({ timeframe, className, earningsData }: ProfileTrendChartProps) {
    const { data: earningsFromQuery } = useDashboardEarnings(earningsData === undefined)
    const earnings = earningsData ?? earningsFromQuery

    const weeklyData: TrendPoint[] = (earnings?.weekly_bonus_series ?? []).map((item) => ({
        label: item.label,
        payout: item.total_bonus,
    }))

    const monthlyData: TrendPoint[] = (earnings?.monthly_bonus_series ?? []).map((item) => ({
        label: item.label,
        payout: item.total_bonus,
    }))

    const data = timeframe === "weekly" ? weeklyData : monthlyData
    const maxPayout = data.length > 0 ? Math.max(...data.map((point) => point.payout)) : 0

    const ticks =
        timeframe === "weekly"
            ? data.map((point) => point.label)
            : data
                .filter((_, index) => index % 5 === 0 || index === data.length - 1)
                .map((point) => point.label)

    return (
        <div className={className}>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={data}
                    margin={{ top: 8, right: 0, left: 0, bottom: 0 }}
                    barCategoryGap="0%"
                    barGap={0}
                >
                    <XAxis
                        dataKey="label"
                        axisLine={false}
                        tickLine={false}
                        interval={0}
                        ticks={ticks}
                        tick={{ fill: "#8A9CB3", fontSize: 15, fontWeight: 600 }}
                    />

                    <Bar
                        dataKey="payout"
                        radius={[22, 22, 0, 0]}
                        isAnimationActive
                        animationDuration={700}
                    >
                        {data.map((entry) => (
                            <Cell
                                key={entry.label}
                                fill={entry.payout === maxPayout ? "#2C61E5" : "#D0D8E6"}
                            />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}