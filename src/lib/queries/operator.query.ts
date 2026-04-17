import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { operatorKeys } from "./keys";
import { apiClient } from "../axios";
import type {
    CreateOperatorPayload,
    CreateOperatorResponse,
    OperatorPaginatedResponse,
    OperatorResponse,
} from "../../type";

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
                queryKey: operatorKeys.paginatedRoot(),
            });
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
                `/operations/operators/?page=${page}`,
            );
            return response.data;
        },
    });
}

export function useOperatorDetails(id: string) {
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