export type ProfileOperatorSummary = {
    id: number;
    operator_id: string;
    full_name: string;
    group_id: number;
    group_name: string;
    shift: "DAY" | "NIGHT" | string;
    shift_display: string;
    assigned_at: string;
};

export type ProfileResponse = {
    id: number;
    profile_id: number;
    name: string;
    profile_name: string;
    group?: number;
    bonus_percentage: number;
    bonus_percentage_display: string;
    is_active: boolean;
    operator: string;
    group_id?: number;
    group_name?: string;
    monthly_earning: number;
    current_operator: ProfileOperatorSummary | null;
    monthly_bonus_total: number;
    latest_cumulative_bonus: number;
};

export type ProfilePaginatedResponse = {
    count: number;
    next: string | null;
    previous: string | null;
    results: ProfileResponse[];
    total_profiles?: number;
    assigned_profiles?: number;
    unassigned_profiles?: number;
};

export type CreateProfilePayload = {
    profile_id: number | string;
    profile_name: string;
    bonus_percentage: number;
    is_active: boolean;
    group?: number | string;
};

export type CreateProfileResponse = ProfileResponse;

export type UpdateProfilePayload = Partial<{
    profile_name: string;
    name: string;
    profile_id: number | string;
    bonus_percentage: number;
    remove_operator: boolean;
    group?: number | string;
}>;

export type UpdateProfileResponse = ProfileResponse;

export type ProfileValidationErrors = {
    profile_name?: string[];
    name?: string[];
    profile_id?: string[];
    bonus_percentage?: string[];
    detail?: string | string[];
    non_field_errors?: string[];
    [key: string]: string[] | string | undefined;
};

export type MassAssignProfilePayload = {
    group_id: number;
    shift: "DAY" | "NIGHT" | string;
    target_date: string;
}

export type SingleAssignProfilePayload = {
    operator_id: number;
    profile_id: number[];
};

export type ProfileReassignmentPayload = {
    profile_id: number[];
    new_operator_id: number;
};

export type ProfileReassignmentValidationErrors = {
    profile_id?: string[];
    new_operator_id?: string[];
    detail?: string | string[];
    non_field_errors?: string[];
    [key: string]: string[] | string | undefined;
};

export type LatestReassignmentItem = {
    id: number;
    operator: number;
    operator_id_value: string;
    operator_name: string;
    operator_shift: "DAY" | "NIGHT" | string;
    operator_shift_display: string;
    group_id: number;
    group_name: string;
    profile: number;
    profile_id_value: number;
    profile_name: string;
    profile_bonus_percentage: number;
    start_at: string;
    end_at: string | null;
    assigned_by: number | null;
    is_active: boolean;
    created_at: string;
};

export type LatestReassignmentsResponse = {
    count: number;
    results: LatestReassignmentItem[];
};