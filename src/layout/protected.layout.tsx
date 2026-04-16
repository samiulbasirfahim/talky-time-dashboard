
import { Navigate, useLocation } from "react-router";
import { useAuthStore } from "../lib/store/auth.store";
import type { ReactNode } from "react";

type ProtectedRouteProps = {
    redirectPath: string;
    children: ReactNode
}

export const ProtectedRoute = ({ redirectPath, children }: ProtectedRouteProps) => {
    const refreshToken = useAuthStore((state) => state.refreshToken);
    const isHydrated = useAuthStore((state) => state.isHydrated);
    const location = useLocation();

    if (!isHydrated) {
        return null;
    }

    if (!refreshToken) {
        console.log("No refresh token found, redirecting to login");
        return <Navigate to={redirectPath} replace state={{ from: location.pathname }} />;
    }
    return <>{children}</>;
}