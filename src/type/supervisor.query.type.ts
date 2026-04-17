export type SupervisorShiftApi = "DAY" | "NIGHT";

export type SupervisorShiftDisplay = "Day" | "Night" | string;

export type SupervisorResponse = {
    id: number;
    user_id: number;
    name: string;
    supervisor_id: string;
    supervisor_name: string;
    first_name: string;
    last_name: string;
    email: string;
    assigned_group: number;
    group_name: string;
    shift: SupervisorShiftApi;
    shift_display: SupervisorShiftDisplay;
    operators: number[];
    operators_count: number;
    total_supervisors: number;
    [key: string]: unknown;
};

export type SupervisorPaginatedResponse = {
    count: number;
    next: string | null;
    previous: string | null;
    results: SupervisorResponse[];
    total_supervisors: number;
};

export type CreateSupervisorPayload = {
    name: string;
    supervisor_name: string;
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    supervisor_id: string;
    assigned_group: number;
    shift: SupervisorShiftApi;
    operators: number[];
};

export type CreateSupervisorResponse = SupervisorResponse;

export type UpdateSupervisorPayload = Partial<CreateSupervisorPayload>;

export type UpdateSupervisorResponse = SupervisorResponse;

export type SupervisorCreateValidationErrors = {
    email?: string[];
    password?: string[];
    supervisor_id?: string[];
    assigned_group?: string[];
    shift?: string[];
    name?: string[];
    supervisor_name?: string[];
    first_name?: string[];
    last_name?: string[];
    non_field_errors?: string[];
    detail?: string | string[];
    [key: string]: string[] | string | undefined;
};

export type SupervisorUpdateValidationErrors = SupervisorCreateValidationErrors;