export type LoginPayload = {
    email: string;
    password: string;
};

export type AuthUserRole = "ADMIN" | "SUPERVISOR" | "GENERAL_MANAGER" | string;

export type AuthUser = {
    id: number;
    email: string;
    username: string;
    first_name: string;
    last_name: string;
    role: AuthUserRole;
    is_admin: boolean;
    is_general_manager: boolean;
    is_supervisor: boolean;
};

export type LoginResponse = {
    refresh: string;
    access: string;
    user: AuthUser;
};

export type MeResponse = AuthUser;