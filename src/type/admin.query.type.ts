export type AdminResponse = {
    id: number;
    full_name: string;
    email: string;
};

export type AdminPaginatedResponse = {
    count: number;
    next: string | null;
    previous: string | null;
    results: AdminResponse[];
};

export type CreateAdminPayload = {
    full_name: string;
    email: string;
    password: string;
};

export type CreateAdminResponse = AdminResponse;

export type AdminCreateValidationErrors = {
    full_name?: string[];
    email?: string[];
    password?: string[];
    detail?: string | string[];
    non_field_errors?: string[];
    [key: string]: string[] | string | undefined;
};

export type GeneralManagerResponse = {
    id: number;
    general_manager_id: string;
    name: string;
    email: string;
};

export type GeneralManagerPaginatedResponse = {
    count: number;
    next: string | null;
    previous: string | null;
    results: GeneralManagerResponse[];
};

export type CreateGeneralManagerPayload = {
    general_manager_id: string;
    name: string;
    email: string;
    password: string;
};

export type CreateGeneralManagerResponse = GeneralManagerResponse;

export type UpdateGeneralManagerPayload = {
    name?: string;
    general_manager_id?: string;
    email?: string;
    new_password?: string;
    confirm_new_password?: string;
};

export type UpdateGeneralManagerResponse = GeneralManagerResponse;

export type GeneralManagerValidationErrors = {
    general_manager_id?: string[];
    name?: string[];
    email?: string[];
    password?: string[];
    new_password?: string[];
    confirm_new_password?: string[];
    detail?: string | string[];
    non_field_errors?: string[];
    [key: string]: string[] | string | undefined;
};