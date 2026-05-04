import type { AuthUserRole } from "../type";

export const SUPERVISOR_ALLOWED_ROUTES: string[] = [
    "/",
    "/supervisor",
    "/operators",
    "/profile",
    "/csv-upload",
    "/bonus-performance",
    "/score-cutoffs",
    "/payouts",
    "/discipline",
];

export const GENERAL_MANAGER_ALLOWED_ROUTES: string[] = [
    ...SUPERVISOR_ALLOWED_ROUTES,
    "/general-manager",
];

function normalizePathname(pathname: string) {
    if (!pathname) {
        return "/";
    }

    if (pathname.length > 1 && pathname.endsWith("/")) {
        return pathname.slice(0, -1);
    }

    return pathname;
}

function matchesAllowedRoute(pathname: string, allowedRoute: string) {
    if (allowedRoute === "/") {
        return pathname === "/";
    }

    return pathname === allowedRoute || pathname.startsWith(`${allowedRoute}/`);
}

export function isSupervisorAllowedPath(pathname: string) {
    const normalizedPathname = normalizePathname(pathname);

    return SUPERVISOR_ALLOWED_ROUTES.some((route) =>
        matchesAllowedRoute(normalizedPathname, route),
    );
}

export function isGeneralManagerAllowedPath(pathname: string) {
    const normalizedPathname = normalizePathname(pathname);

    return GENERAL_MANAGER_ALLOWED_ROUTES.some((route) =>
        matchesAllowedRoute(normalizedPathname, route),
    );
}

export function canAccessPathByRole(
    role: AuthUserRole | undefined,
    pathname: string,
) {
    if (role === "ADMIN") {
        return true;
    }

    if (role === "GENERAL_MANAGER") {
        return isGeneralManagerAllowedPath(pathname);
    }

    if (role === "SUPERVISOR") {
        return isSupervisorAllowedPath(pathname);
    }

    return false;
}
