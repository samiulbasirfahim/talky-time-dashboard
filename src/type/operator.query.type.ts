export type OperatorShiftApi = "DAY" | "NIGHT";

export type OperatorShiftDisplay = "Day" | "Night" | string;

export type OperatorStatusApi = "active" | "inactive" | "pending" | string;

export type OperatorProfileSummary = {
    id: number;
    profile_id: number;
    profile_name: string;
    bonus_percentage: number;
    bonus_percentage_display: string;
    assigned_at: string;
};

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
    current_profiles: OperatorProfileSummary[];
    total_bonus_usd: number;
};

export type OperatorPaginatedResponse = {
    count: number;
    next: string | null;
    previous: string | null;
    results: OperatorResponse[];
    total_operator_count?: number;
    total_active_operator_count?: number;
    total_active_profile_count?: number;
};

export type CreateOperatorPayload = {
    operator_id: string;
    full_name: string;
    group: number;
    shift: OperatorShiftApi;
};

export type CreateOperatorResponse = OperatorResponse;

export type UpdateOperatorPayload = Partial<CreateOperatorPayload>;

export type UpdateOperatorResponse = OperatorResponse;

export type OperatorCreateValidationErrors = {
    operator_id?: string[];
    full_name?: string[];
    group?: string[];
    shift?: string[];
    detail?: string | string[];
    non_field_errors?: string[];
    [key: string]: string[] | string | undefined;
};

export type OperatorUpdateValidationErrors = OperatorCreateValidationErrors;

export type OperatorStatusChangeLatestResponse = {
    id: number;
    operator_name: string;
    operator_id: string;
    status: "active" | "inactive";
    created_at: string;
};