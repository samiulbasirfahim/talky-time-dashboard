export type DashboardMonthlyGroupEarning = {
    group_id: number;
    group_name: string;
    total_bonus: number;
    operator_count: number;
};

export type DashboardMonthlyGroupEarnings = {
    start_date: string;
    end_date: string;
    groups: DashboardMonthlyGroupEarning[];
    total_bonus: number;
};

export type DashboardBonusSeriesPoint = {
    date: string;
    label: string;
    total_bonus: number;
};

export type DashboardEarningsResponse = {
    monthly_group_earnings: DashboardMonthlyGroupEarnings;
    monthly_bonus_series: DashboardBonusSeriesPoint[];
    weekly_bonus_series: DashboardBonusSeriesPoint[];
    weekly_total_bonus: number;
};

export type ReportsLeaderboardPeriod = "weekly" | "monthly" | string;

export type ReportsLeaderboardItem = {
    operator_db_id: number;
    operator_id: string;
    operator_name: string;
    group_id: number;
    group_name: string;
    shift: "DAY" | "NIGHT" | string;
    total_bonus: number;
    rank: number;
};

export type ReportsLeaderboardResponse = {
    period: ReportsLeaderboardPeriod;
    start_date: string;
    end_date: string;
    top_operators: ReportsLeaderboardItem[];
};