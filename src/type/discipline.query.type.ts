export type IssueDisciplinaryWarningPayload = {
    operator_id: number;
    action_date: string;
    reason: string;
};

export type IssueDisciplinaryWarningResponse = {
    id?: number;
    operator_id?: number;
    action_date?: string;
    reason?: string;
    [key: string]: unknown;
};

export type IssueDisciplinaryWarningValidationErrors = {
    operator_id?: string[];
    action_date?: string[];
    reason?: string[];
    detail?: string | string[];
    non_field_errors?: string[];
    [key: string]: string[] | string | undefined;
};

export type DisciplinaryWarningAction = "revoke_warning" | string;

export type DisciplinaryWarningLogItem = {
    id: number;
    operator_id: string;
    operator_name: string;
    date: string;
    reason: string;
    warning_count: number;
    action: DisciplinaryWarningAction;
};

export type DisciplinaryWarningLogResponse = {
    count: number;
    next: string | null;
    previous: string | null;
    results: DisciplinaryWarningLogItem[];
};

export type RevokeDisciplinaryWarningResponse = {
    detail?: string;
    [key: string]: unknown;
};

export type DisciplinaryReprimandItem = {
    operator: number;
    operator_id: string;
    operator_name: string;
    reprimand_count: number;
    total_deduction: number | string;
    latest_reprimand_date: string;
    id?: number;
    date?: string;
    created_at?: string;
    month?: string;
    warning_count?: number;
    warning_limit?: number;
    amount_cop?: number | string;
    deduction_amount?: number | string;
    [key: string]: unknown;
};

export type DisciplinaryReprimandPaginatedResponse = {
    count: number;
    next: string | null;
    previous: string | null;
    results: DisciplinaryReprimandItem[];
};

export type DisciplinaryOverviewResponse = {
    active_warnings: number;
    active_warnings_total_operators: number;
    reprimands: number;
    at_risk: number;
    monthly_reset_days_left: number;
};