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
    bonus_percentage: number;
    bonus_percentage_display: string;
    is_active: boolean;
    operator: string;
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
};

export type CreateProfileResponse = ProfileResponse;

export type UpdateProfilePayload = Partial<{
    profile_name: string;
    name: string;
    profile_id: number | string;
    bonus_percentage: number;
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