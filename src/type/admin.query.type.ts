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