export type SystemSettingsResponse = {
    id: number;
    system_name: string;
    qualification_threshold: string;
    day_shift_start_time: string;
    day_shift_start_time_display?: string;
    day_shift_end_time: string;
    day_shift_end_time_display?: string;
    night_shift_start_time: string;
    night_shift_start_time_display?: string;
    night_shift_end_time: string;
    night_shift_end_time_display?: string;
    exchange_rate_usd_to_cop: string;
    exchange_rate_updated_at?: string;
    timezone: string;
    payout_currency: string;
    monthly_reset_day: number;
};

export type UpdateSystemSettingsPayload = Partial<
    Pick<
        SystemSettingsResponse,
        | "system_name"
        | "qualification_threshold"
        | "day_shift_start_time"
        | "day_shift_end_time"
        | "night_shift_start_time"
        | "night_shift_end_time"
        | "exchange_rate_usd_to_cop"
        | "timezone"
        | "payout_currency"
        | "monthly_reset_day"
    >
>;

export type UpdateSystemSettingsValidationErrors = {
    system_name?: string[];
    qualification_threshold?: string[];
    day_shift_start_time?: string[];
    day_shift_end_time?: string[];
    night_shift_start_time?: string[];
    night_shift_end_time?: string[];
    exchange_rate_usd_to_cop?: string[];
    timezone?: string[];
    payout_currency?: string[];
    monthly_reset_day?: string[];
    detail?: string | string[];
    non_field_errors?: string[];
    [key: string]: string[] | string | undefined;
};