import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { groupKeys, supervisorKeys } from "./keys";
import { apiClient } from "../axios";
import type {
    CreateSupervisorPayload,
    CreateSupervisorResponse,
    SupervisorPaginatedResponse,
    SupervisorResponse,
    UpdateSupervisorPayload,
    UpdateSupervisorResponse,
} from "../../type";

export const SUPERVISORS_PAGE_LIMIT = 4;

export function useCreateSupervisor() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (
            payload: CreateSupervisorPayload,
        ): Promise<CreateSupervisorResponse> => {
            const response = await apiClient.post<CreateSupervisorResponse>(
                "/accounts/supervisors/",
                payload,
            );

            return response.data;
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: supervisorKeys.paginatedRoot(),
            });
        },
    });
}

export function useUpdateSupervisor() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            id,
            payload,
        }: {
            id: number;
            payload: UpdateSupervisorPayload;
        }): Promise<UpdateSupervisorResponse> => {
            const response = await apiClient.patch<UpdateSupervisorResponse>(
                `/accounts/supervisors/${id}/`,
                payload,
            );

            return response.data;
        },
        onSuccess: async (_, variables) => {
            await Promise.all([
                queryClient.invalidateQueries({
                    queryKey: supervisorKeys.paginatedRoot(),
                }),
                queryClient.invalidateQueries({
                    queryKey: supervisorKeys.details(variables.id),
                }),
                queryClient.invalidateQueries({
                    queryKey: groupKeys.all(),
                })
            ]);
        },
    });
}

export function useDeleteSupervisor() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: number): Promise<void> => {
            await apiClient.delete(`/accounts/supervisors/${id}/`);
        },
        onSuccess: async (_, id) => {
            await Promise.all([
                queryClient.invalidateQueries({
                    queryKey: supervisorKeys.all(),
                }),
                queryClient.invalidateQueries({
                    queryKey: supervisorKeys.details(id),
                }),
            ]);
        },
    });
}

export function useSearchSupervisors(query: string, withoutGroup?: boolean) {
    return useQuery({
        queryKey: supervisorKeys.search(query, withoutGroup),
        queryFn: async (): Promise<SupervisorPaginatedResponse> => {
            const params = new URLSearchParams();
            params.set("search", query);
            if (withoutGroup !== undefined) {
                params.set("without_group", String(withoutGroup));
            }
            const response = await apiClient.get<SupervisorPaginatedResponse>(
                `/accounts/supervisors/?${params.toString()}`,
            );

            return response.data;
        },
    });
}

export function usePaginatedSupervisors(page: number, groupId?: number | string, enabled = true) {
    return useQuery({
        queryKey: supervisorKeys.paginated(page, groupId),
        queryFn: async (): Promise<SupervisorPaginatedResponse> => {
            const params = new URLSearchParams({
                limit: String(SUPERVISORS_PAGE_LIMIT),
                page: String(page),
            });

            if (groupId !== undefined && groupId !== null && String(groupId).trim().length > 0) {
                params.set("group_id", String(groupId));
            }

            const response = await apiClient.get<SupervisorPaginatedResponse>(
                `/accounts/supervisors/?${params.toString()}`,
            );

            return response.data;
        },
        enabled,
    });
}

export function useSupervisorDetails(id: string | number) {
    return useQuery({
        queryKey: supervisorKeys.details(id),
        queryFn: async (): Promise<SupervisorResponse> => {
            const response = await apiClient.get<SupervisorResponse>(
                `/accounts/supervisors/${id}/`,
            );

            return response.data;
        },
    });
}