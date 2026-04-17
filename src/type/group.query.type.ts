export type GroupCreationPayload = {
    name: string;
    supervisors?: number[];
    operators?: number[];
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

export type GroupResult = {
    id: number;
    name: string;
    telegram_chat_id: string | null;
    is_active: boolean;
    total_bonus: number;
    operator_count: number;
    supervisor_count: number;
    supervisors: GroupSupervisorSummary[];
    operators_summary: GroupOperatorsSummary;
};

export type GroupSearchResponse = {
    count: number;
    next: string | null;
    previous: string | null;
    results: GroupResult[];
    active_groups_count?: number;
};