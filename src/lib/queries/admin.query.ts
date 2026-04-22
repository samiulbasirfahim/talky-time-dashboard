import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
    AdminPaginatedResponse,
    CreateAdminPayload,
    CreateAdminResponse,
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