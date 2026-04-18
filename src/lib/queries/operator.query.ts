import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { operatorKeys } from "./keys";
import { apiClient } from "../axios";
import type {
    CreateOperatorPayload,
    CreateOperatorResponse,
    OperatorPaginatedResponse,
    OperatorResponse,
    UpdateOperatorPayload,
    UpdateOperatorResponse,
} from "../../type";

export const OPERATORS_PAGE_LIMIT = 10;

export function useCreateOperator() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: CreateOperatorPayload): Promise<CreateOperatorResponse> => {
            const response = await apiClient.post<CreateOperatorResponse>(
                "/operations/operators/",
                payload,
            );
            return response.data;
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: operatorKeys.all(),
            });
        },
    });
}

export function useUpdateOperator() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            id,
            payload,
        }: {
            id: number;
            payload: UpdateOperatorPayload;
        }): Promise<UpdateOperatorResponse> => {
            const response = await apiClient.patch<UpdateOperatorResponse>(
                `/operations/operators/${id}/`,
                payload,
            );
            return response.data;
        },
        onSuccess: async (_, variables) => {
            await Promise.all([
                queryClient.invalidateQueries({
                    queryKey: operatorKeys.all(),
                }),
                queryClient.invalidateQueries({
                    queryKey: operatorKeys.details(variables.id),
                }),
            ]);
        },
    });
}

export function useDeleteOperator() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: number): Promise<void> => {
            await apiClient.delete(`/operations/operators/${id}/`);
        },
        onSuccess: async (_, id) => {
            await Promise.all([
                queryClient.invalidateQueries({
                    queryKey: operatorKeys.all(),
                }),
                queryClient.invalidateQueries({
                    queryKey: operatorKeys.details(id),
                }),
            ]);
        },
    });
}

export function useSearchOperators(query: string) {
    return useQuery({
        queryKey: operatorKeys.search(query),
        queryFn: async (): Promise<OperatorPaginatedResponse> => {
            const response = await apiClient.get<OperatorPaginatedResponse>(
                `/operations/operators/?search=${encodeURIComponent(query)}`,
            );
            return response.data;
        },
    });
}

export function usePaginatedOperators(page: number) {
    return useQuery({
        queryKey: operatorKeys.paginated(page),
        queryFn: async (): Promise<OperatorPaginatedResponse> => {
            const response = await apiClient.get<OperatorPaginatedResponse>(
                `/operations/operators/?limit=${OPERATORS_PAGE_LIMIT}&page=${page}`,
            );
            return response.data;
        },
    });
}

export function useOperatorDetails(id: string | number) {
    return useQuery({
        queryKey: operatorKeys.details(id),
        queryFn: async (): Promise<OperatorResponse> => {
            const response = await apiClient.get<OperatorResponse>(
                `/operations/operators/${id}/`,
            );
            return response.data;
        },
    });
}