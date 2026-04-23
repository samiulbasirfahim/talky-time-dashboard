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

export type ReportsSummaryTopGroup = {
    group_id: number;
    group_name: string;
    total_bonus: number;
    operator_count: number;
};

export type ReportsSummaryCurrentMonth = {
    start_date: string;
    end_date: string;
    total_bonus: number;
};

export type ReportsSummaryResponse = {
    total_bonus_paid: number;
    top_group: ReportsSummaryTopGroup;
    total_payout: number;
    active_warning_count: number;
    total_deduction: number;
    top_operators: ReportsLeaderboardItem[];
    current_month: ReportsSummaryCurrentMonth;
};

export type SystemNotification = {
    id: number;
    actor_name: string;
    actor_role: string;
    method: string;
    path: string;
    view_name: string;
    resource: string;
    message: string;
    status_code: number;
    created_at: string;
};

export type SystemNotificationResponse = {
    count: number;
    results: SystemNotification[];
};

export type DashboardStatsResponse = {
    total_bonus_today: number;
    active_operators: number;
    active_profiles: number;
    payout_till_now: number;
};