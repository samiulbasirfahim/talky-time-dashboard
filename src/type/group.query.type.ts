export type GroupCreationPayload = {
    name: string;
    supervisors?: number[];
    operators?: number[];
    profiles?: number[];
};

export type GroupUpdatePayload = {
    name?: string;
    supervisors?: number[];
    operators?: number[];
    profiles?: number[];
};

export type GroupCreateResponse = {
    id: number;
    name: string;
    supervisors?: number[];
    operators?: number[];
    [key: string]: unknown;
};

export type GroupCreateValidationErrors = {
    name?: string[];
    supervisors?: string[];
    operators?: string[];
    non_field_errors?: string[];
    [key: string]: string[] | undefined;
};

export type GroupSupervisorSummary = {
    id: number;
    supervisor_id: string;
    user_id: number;
    name: string;
    supervisor_name: string;
    user_name: string;
    email: string;
    shift: "DAY" | "NIGHT";
    shift_display: "Day" | "Night" | string;
};

export type GroupOperatorsSummary = {
    total: number;
    day_shift: number;
    night_shift: number;
};

export type GroupDetailOperator = {
    id: number;
    operator_id: string;
    full_name: string;
    operator_name: string;
    shift: "DAY" | "NIGHT" | string;
    shift_display: string;
    is_active: boolean;
};

export type GroupDetailProfile = {
    id: number;
    profile_id: number;
    profile_name: string;
    group: number;
    bonus_percentage: number;
    bonus_percentage_display: string;
    is_active: boolean;
    operator: string | null;
    monthly_earning: number;
    current_operator: {
        id: number;
        operator_id: string;
        full_name: string;
        group_id: number;
        group_name: string;
        shift: string;
        shift_display: string;
        assigned_at: string;
    } | null;
    monthly_bonus_total: number;
    latest_cumulative_bonus: number;
    group_name: string;
};

export type GroupResult = {
    id: number;
    name: string;
    telegram_chat_id: string | null;
    is_active: boolean;
    total_bonus: number;
    operator_count: number;
    supervisor_count: number;
    profile_count: number;
    supervisors?: GroupSupervisorSummary[];
    operators_summary: GroupOperatorsSummary;
};

export type GroupDetailResponse = GroupResult & {
    operators: GroupDetailOperator[];
    profiles: GroupDetailProfile[];
};

export type GroupSearchResponse = {
    count: number;
    next: string | null;
    previous: string | null;
    results: GroupResult[];
    active_groups_count?: number;
};