import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis } from "recharts"
import { useDashboardEarnings } from "../lib/queries"
import type { DashboardEarningsResponse } from "../type"

export type ProfileTrendTimeframe = "weekly" | "monthly"

type TrendPoint = {
    label: string
    payout: number
}

type TextAnchor = "start" | "middle" | "end"

type ProfileTrendChartProps = {
    timeframe: ProfileTrendTimeframe
    className?: string
    earningsData?: DashboardEarningsResponse
}

type CustomTickProps = {
    x?: number | string
    y?: number | string
    payload?: {
        value: string
    }
}

type CustomBarShapeProps = {
    x?: number | string
    y?: number | string
    width?: number | string
    height?: number | string
    payload?: TrendPoint
}

const formatLabel = (label: string) => {
    const parsedDate = new Date(label)
    if (Number.isNaN(parsedDate.getTime())) {
        return label
    }

    return `${parsedDate
        .toLocaleString("en-US", { month: "short" })
        .toUpperCase()} ${String(parsedDate.getDate()).padStart(2, "0")}`
}

export function ProfileTrendChart({ timeframe, className, earningsData }: ProfileTrendChartProps) {
    const { data: earningsFromQuery } = useDashboardEarnings(earningsData === undefined)
    const earnings = earningsData ?? earningsFromQuery

    const mapSeriesPoint = (item: { label?: string; date?: string; total_bonus: number }) => {
        const resolvedLabel = (item.label ?? item.date ?? "").trim()
        const payout = Number(item.total_bonus)

        return {
            label: resolvedLabel,
            payout: Number.isFinite(payout) ? payout : 0,
        }
    }

    const weeklyData: TrendPoint[] = (earnings?.weekly_bonus_series ?? [])
        .map(mapSeriesPoint)
        .filter((point) => point.label.length > 0)

    const monthlyData: TrendPoint[] = (earnings?.monthly_bonus_series ?? [])
        .map(mapSeriesPoint)
        .filter((point) => point.label.length > 0)

    const data = timeframe === "weekly" ? weeklyData : monthlyData
    const payouts = data.map((item) => item.payout)
    const minPayout = payouts.length > 0 ? Math.min(...payouts) : 0
    const maxPayout = payouts.length > 0 ? Math.max(...payouts) : 1

    const getBarColor = (payout: number) => {
        if (maxPayout === minPayout) {
            return "#2C61E540"
        }

        const ratio = (payout - minPayout) / (maxPayout - minPayout)

        if (ratio > 0.8) return "#2C61E5DD"
        if (ratio > 0.6) return "#2C61E580"
        if (ratio > 0.4) return "#2C61E540"
        if (ratio > 0.2) return "#2C61E526"
        return "#2C61E51A"
    }

    const getTicks = () => {
        if (data.length === 0) {
            return []
        }

        if (timeframe === "weekly") {
            return data.map((d) => d.label)
        }

        return Array.from(new Set([
            data[0].label,
            data[Math.floor(data.length / 2)].label,
            data[data.length - 1].label,
        ]))
    }

    const CustomBarShape = (props: CustomBarShapeProps) => {
        const x = Number(props.x ?? 0)
        const y = Number(props.y ?? 0)
        const width = Number(props.width ?? 0)
        const rawHeight = Number(props.height ?? 0)
        const payout = props.payload?.payout ?? 0
        const barHeight = Math.max(rawHeight, payout === 0 ? 2 : 0)

        return (
            <rect
                x={x}
                y={y}
                width={width}
                height={barHeight}
                fill={getBarColor(payout)}
                rx={4}
                ry={4}
                className="transition-all duration-500 ease-in-out"
            />
        )
    }

    return (
        <div className={className}>
            {data.length === 0 ? (
                <div className="flex h-full w-full items-center justify-center">
                    <span className="text-sm text-text-muted">No trend data available.</span>
                </div>
            ) : (
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={data}
                    margin={{ top: 20, right: 0, left: 0, bottom: 0 }}
                    barCategoryGap="0%"
                    barGap={0}
                >
                    <XAxis
                        dataKey="label"
                        axisLine={false}
                        tickLine={false}
                        ticks={getTicks()}
                        interval={0}
                        padding={{ left: 10, right: 10 }}
                        tick={(props: CustomTickProps) => {
                            if (data.length === 0 || !props.payload?.value) {
                                return null
                            }

                            const x = Number(props.x ?? 0)
                            const y = Number(props.y ?? 0)
                            const tickValue = props.payload.value

                            let anchor: TextAnchor = "middle"
                            const isFirst = tickValue === data[0].label
                            const isLast = tickValue === data[data.length - 1].label

                            if (isFirst) anchor = "start"
                            else if (isLast) anchor = "end"

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
                                    {formatLabel(tickValue)}
                                </text>
                            )
                        }}
                    />

                    <Tooltip cursor={{ fill: "transparent" }} animationDuration={300} />
                    <Bar
                        dataKey="payout"
                        shape={<CustomBarShape />}
                        isAnimationActive
                        animationDuration={800}
                        animationEasing="ease-in-out"
                    />
                </BarChart>
            </ResponsiveContainer>
            )}
        </div>
    )
}