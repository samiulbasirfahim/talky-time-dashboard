export type LoginPayload = {
    email: string;
    password: string;
};

export type AuthUserRole = "ADMIN" | "SUPERVISOR" | string;

export type AuthUser = {
    id: number;
    email: string;
    username: string;
    first_name: string;
    last_name: string;
    role: AuthUserRole;
    is_admin: boolean;
    is_supervisor: boolean;
};

export type LoginResponse = {
    refresh: string;
    access: string;
    user: AuthUser;
};

export type MeResponse = AuthUser;