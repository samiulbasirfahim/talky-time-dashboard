import { useMutation, useQuery } from "@tanstack/react-query";
import type { LoginPayload } from "../../type";
import { apiClient } from "../axios";
import { authKeys } from "./keys";
import { useAuthStore } from "../store/auth.store";

export function useLogin() {
    return useMutation({
        mutationFn: (payload: LoginPayload) => {
            return apiClient.post("/accounts/login/", payload, { unprotected: true });
        },
        onSuccess: (data) => {
            const { access, refresh } = data.data;
            // localStorage.setItem("accessToken", access);
            // localStorage.setItem("refreshToken", refresh);
            useAuthStore.getState().setAccessToken(access);
            useAuthStore.getState().setRefreshToken(refresh);
        }
    })
}

export function useMe() {
    const response = useQuery({
        queryKey: authKeys.me(),
        queryFn: () => apiClient.get("/accounts/me/"),
        retry: false,
    })


    return {
        ...response
    };
}

export function useLogout() {
    const refreshToken = useAuthStore((state) => state.refreshToken);

    if (!refreshToken) {
        throw new Error("No refresh token found. User might not be logged in.");
    }

    return useMutation({
        mutationFn: () => {
            return apiClient.post("/accounts/logout/", { refresh: refreshToken });
        },
        onSuccess: () => {
            useAuthStore.getState().clearTokens();
        }
    })
}

export function useInitializeAuth() {
    const { data, isLoading } = useMe();

    return {
        user: data?.data,
        isLoading,
    }
}