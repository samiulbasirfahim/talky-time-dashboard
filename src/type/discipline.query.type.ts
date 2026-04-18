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