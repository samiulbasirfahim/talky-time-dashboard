import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
    AdminPaginatedResponse,
    CreateAdminPayload,
    CreateAdminResponse,
    GeneralManagerPaginatedResponse,
    CreateGeneralManagerPayload,
    CreateGeneralManagerResponse,
    UpdateGeneralManagerPayload,
    UpdateGeneralManagerResponse,
} from "../../type";
import { apiClient } from "../axios";
import { adminKeys } from "./keys";

export const ADMINS_PAGE_LIMIT = 5;

export function useCreateAdmin() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: CreateAdminPayload): Promise<CreateAdminResponse> => {
            const response = await apiClient.post<CreateAdminResponse>(
                "/accounts/admins/",
                payload,
            );

            return response.data;
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: adminKeys.paginatedRoot(),
            });
        },
    });
}

export function usePaginatedAdmins(page: number) {
    return useQuery({
        queryKey: adminKeys.paginated(page),
        queryFn: async (): Promise<AdminPaginatedResponse> => {
            const response = await apiClient.get<AdminPaginatedResponse>(
                `/accounts/admins/?limit=${ADMINS_PAGE_LIMIT}&page=${page}`,
            );

            return response.data;
        },
    });
}

export function useDeleteAdmin() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: number): Promise<void> => {
            await apiClient.delete(`/accounts/admins/${id}/`);
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: adminKeys.all(),
            });
        },
    });
}

export const GENERAL_MANAGERS_PAGE_LIMIT = 10;

export function useCreateGeneralManager() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: CreateGeneralManagerPayload): Promise<CreateGeneralManagerResponse> => {
            const response = await apiClient.post<CreateGeneralManagerResponse>(
                "/accounts/general-managers/",
                payload,
            );

            return response.data;
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: adminKeys.generalManagersPaginatedRoot(),
            });
        },
    });
}

export function usePaginatedGeneralManagers(page: number, enabled = true) {
    return useQuery({
        queryKey: adminKeys.generalManagersPaginated(page),
        queryFn: async (): Promise<GeneralManagerPaginatedResponse> => {
            const response = await apiClient.get<GeneralManagerPaginatedResponse>(
                `/accounts/general-managers/?limit=${GENERAL_MANAGERS_PAGE_LIMIT}&page=${page}`,
            );

            return response.data;
        },
        enabled,
    });
}

export function useUpdateGeneralManager() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            id,
            payload,
        }: {
            id: number;
            payload: UpdateGeneralManagerPayload;
        }): Promise<UpdateGeneralManagerResponse> => {
            const response = await apiClient.patch<UpdateGeneralManagerResponse>(
                `/accounts/general-managers/${id}/`,
                payload,
            );

            return response.data;
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: adminKeys.generalManagersPaginatedRoot(),
            });
        },
    });
}

export function useDeleteGeneralManager() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: number): Promise<void> => {
            await apiClient.delete(`/accounts/general-managers/${id}/`);
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: adminKeys.generalManagersPaginatedRoot(),
            });
        },
    });
}