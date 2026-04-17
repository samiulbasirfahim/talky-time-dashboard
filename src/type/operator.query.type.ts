export type OperatorShiftApi = "DAY" | "NIGHT";

export type OperatorShiftDisplay = "Day" | "Night" | string;

export type OperatorStatusApi = "active" | "inactive" | "pending" | string;

export type OperatorResponse = {
    id: number;
    operator_id: string;
    operator_name: string;
    full_name: string;
    group: number;
    group_name: string;
    shift: OperatorShiftApi;
    shift_display: OperatorShiftDisplay;
    is_active: boolean;
    status: OperatorStatusApi;
    active_profiles: number;
    current_profiles_count: number;
    current_profiles: unknown[];
    total_bonus_usd: number;
};

export type OperatorPaginatedResponse = {
    count: number;
    next: string | null;
    previous: string | null;
    results: OperatorResponse[];
};

export type CreateOperatorPayload = {
    operator_id: string;
    full_name: string;
    group: number;
    shift: OperatorShiftApi;
};

export type CreateOperatorResponse = OperatorResponse;

export type OperatorCreateValidationErrors = {
    operator_id?: string[];
    full_name?: string[];
    group?: string[];
    shift?: string[];
    [key: string]: string[] | undefined;
};