import { useMutation, useQuery } from "@tanstack/react-query";
import type { LoginPayload, LoginResponse, MeResponse } from "../../type";
import { apiClient } from "../axios";
import { authKeys } from "./keys";
import { useAuthStore } from "../store/auth.store";

export function useLogin() {
    return useMutation({
        mutationFn: (payload: LoginPayload) => {
            return apiClient.post<LoginResponse>("/accounts/login/", payload, {
                unprotected: true,
            });
        },
        onSuccess: (data) => {
            const { access, refresh } = data.data;
            // localStorage.setItem("accessToken", access);
            // localStorage.setItem("refreshToken", refresh);
            useAuthStore.getState().setAccessToken(access);
            useAuthStore.getState().setRefreshToken(refresh);
        },
    });
}

type UseMeOptions = {
    enabled?: boolean;
};

export function useMe(options?: UseMeOptions) {
    const response = useQuery({
        queryKey: authKeys.me(),
        queryFn: () => apiClient.get<MeResponse>("/accounts/me/"),
        retry: false,
        enabled: options?.enabled ?? true,
    });


    return {
        ...response
    };
}

export function useLogout() {
    return useMutation({
        mutationFn: () => {
            const refreshToken = useAuthStore.getState().refreshToken;

            if (!refreshToken) {
                return Promise.resolve(null);
            }

            return apiClient.post("/accounts/logout/", { refresh: refreshToken });
        },
        onSuccess: () => {
            useAuthStore.getState().clearTokens();
        }
    });
}

export function useInitializeAuth() {
    const { data, isLoading } = useMe();

    return {
        user: data?.data,
        isLoading,
    };
}