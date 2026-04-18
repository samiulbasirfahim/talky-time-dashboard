export type ScoreCutoffShift = "DAY" | "NIGHT" | string;

export type ScoreCutoffResponse = {
    id: number;
    operator_name: string;
    group: string;
    daily_total: string;
    monthly_total: number;
    current_window: string;
    shift: ScoreCutoffShift;
    total_group_bonus: number;
};

export type ScoreCutoffPaginatedResponse = {
    count: number;
    next: string | null;
    previous: string | null;
    results: ScoreCutoffResponse[];
};