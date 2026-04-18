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

export function useSearchSupervisors(query: string) {
    return useQuery({
        queryKey: supervisorKeys.search(query),
        queryFn: async (): Promise<SupervisorPaginatedResponse> => {
            const response = await apiClient.get<SupervisorPaginatedResponse>(
                `/accounts/supervisors/?search=${encodeURIComponent(query)}`,
            );

            return response.data;
        },
    });
}

export function usePaginatedSupervisors(page: number) {
    return useQuery({
        queryKey: supervisorKeys.paginated(page),
        queryFn: async (): Promise<SupervisorPaginatedResponse> => {
            const response = await apiClient.get<SupervisorPaginatedResponse>(
                `/accounts/supervisors/?limit=${SUPERVISORS_PAGE_LIMIT}&page=${page}`,
            );

            return response.data;
        },
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