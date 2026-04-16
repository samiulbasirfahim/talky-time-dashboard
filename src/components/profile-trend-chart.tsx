import { Bar, BarChart, Cell, ResponsiveContainer, XAxis } from "recharts"

export type ProfileTrendTimeframe = "weekly" | "monthly"

type TrendPoint = {
    label: string
    payout: number
}

const WEEKLY_TREND_DATA: TrendPoint[] = [
    { label: "MON", payout: 11200 },
    { label: "TUE", payout: 17600 },
    { label: "WED", payout: 15200 },
    { label: "THU", payout: 22800 },
    { label: "FRI", payout: 12600 },
    { label: "SAT", payout: 20200 },
    { label: "SUN", payout: 16400 },
]

const MONTHLY_TREND_DATA: TrendPoint[] = [
    { label: "01", payout: 6500 },
    { label: "02", payout: 7200 },
    { label: "03", payout: 6800 },
    { label: "04", payout: 7600 },
    { label: "05", payout: 7900 },
    { label: "06", payout: 8400 },
    { label: "07", payout: 9000 },
    { label: "08", payout: 9600 },
    { label: "09", payout: 9400 },
    { label: "10", payout: 10200 },
    { label: "11", payout: 10600 },
    { label: "12", payout: 11000 },
    { label: "13", payout: 11600 },
    { label: "14", payout: 12000 },
    { label: "15", payout: 12400 },
    { label: "16", payout: 13100 },
    { label: "17", payout: 12900 },
    { label: "18", payout: 13800 },
    { label: "19", payout: 14200 },
    { label: "20", payout: 14700 },
    { label: "21", payout: 15100 },
    { label: "22", payout: 15800 },
    { label: "23", payout: 16200 },
    { label: "24", payout: 16900 },
    { label: "25", payout: 17300 },
    { label: "26", payout: 17900 },
    { label: "27", payout: 18400 },
    { label: "28", payout: 19100 },
    { label: "29", payout: 19800 },
    { label: "30", payout: 20500 },
]

type ProfileTrendChartProps = {
    timeframe: ProfileTrendTimeframe
    className?: string
}

export function ProfileTrendChart({ timeframe, className }: ProfileTrendChartProps) {
    const data = timeframe === "weekly" ? WEEKLY_TREND_DATA : MONTHLY_TREND_DATA
    const maxPayout = Math.max(...data.map((point) => point.payout))

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