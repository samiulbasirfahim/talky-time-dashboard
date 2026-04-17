import { Navigate, useLocation } from "react-router";
import { useAuthStore } from "../lib/store/auth.store";
import type { ReactNode } from "react";
import toast from "react-hot-toast";
import { useEffect, useRef } from "react";
import { useMe } from "../lib/queries";
import { canAccessPathByRole } from "../lib/access-control";

type ProtectedRouteProps = {
    redirectPath: string;
    children: ReactNode;
};

type PublicRouteProps = {
    redirectPath: string;
    children: ReactNode;
};

export const ProtectedRoute = ({ redirectPath, children }: ProtectedRouteProps) => {
    const refreshToken = useAuthStore((state) => state.refreshToken);
    const isHydrated = useAuthStore((state) => state.isHydrated);
    const location = useLocation();
    const notifiedPathRef = useRef<string | null>(null);
    const { data, isLoading } = useMe({
        enabled: isHydrated && Boolean(refreshToken),
    });
    const user = data?.data;
    const hasPathAccess = user
        ? canAccessPathByRole(user.role, location.pathname)
        : false;

    useEffect(() => {
        if (!isHydrated || !refreshToken || isLoading || !user) {
            return;
        }

        if (hasPathAccess) {
            notifiedPathRef.current = null;
            return;
        }

        if (location.pathname === "/") {
            return;
        }

        if (notifiedPathRef.current === location.pathname) {
            return;
        }

        notifiedPathRef.current = location.pathname;
        toast.error("You do not have access to this feature.");
    }, [
        hasPathAccess,
        isHydrated,
        isLoading,
        location.pathname,
        refreshToken,
        user,
    ]);

    if (!isHydrated) {
        return null;
    }

    if (!refreshToken) {
        console.log("No refresh token found, redirecting to login");
        return <Navigate to={redirectPath} replace state={{ from: location.pathname }} />;
    }

    if (isLoading) {
        return null;
    }

    if (!user) {
        return <Navigate to={redirectPath} replace state={{ from: location.pathname }} />;
    }

    if (!hasPathAccess) {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};

export const PublicRoute = ({ redirectPath, children }: PublicRouteProps) => {
    const refreshToken = useAuthStore((state) => state.refreshToken);
    const isHydrated = useAuthStore((state) => state.isHydrated);

    if (!isHydrated) {
        return null;
    }

    if (refreshToken) {
        return <Navigate to={redirectPath} replace />;
    }

    return <>{children}</>;
};