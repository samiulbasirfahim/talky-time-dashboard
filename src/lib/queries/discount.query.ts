import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
    CreateDiscountPayload,
    DeleteDiscountResponse,
    DiscountMutationResponse,
    DiscountPaginatedResponse,
    UpdateDiscountPayload,
} from "../../type";
import { apiClient } from "../axios";
import { discountKeys } from "./keys";

export function usePaginatedDiscounts(page = 1, enabled = true) {
    return useQuery({
        queryKey: discountKeys.page(page),
        queryFn: async (): Promise<DiscountPaginatedResponse> => {
            const response = await apiClient.get<DiscountPaginatedResponse>(
                `/payroll/discounts/?page=${page}`,
            );

            return response.data;
        },
        enabled,
    });
}

export function useCreateDiscount() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (
            payload: CreateDiscountPayload,
        ): Promise<DiscountMutationResponse> => {
            const response = await apiClient.post<DiscountMutationResponse>(
                "/payroll/discounts/",
                payload,
            );

            return response.data;
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: discountKeys.all(),
            });
        },
    });
}

export function useUpdateDiscount() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            id,
            payload,
        }: {
            id: number;
            payload: UpdateDiscountPayload;
        }): Promise<DiscountMutationResponse> => {
            const response = await apiClient.patch<DiscountMutationResponse>(
                `/payroll/discounts/${id}/`,
                payload,
            );

            return response.data;
        },
        onSuccess: async (_, variables) => {
            await Promise.all([
                queryClient.invalidateQueries({ queryKey: discountKeys.all() }),
                queryClient.invalidateQueries({ queryKey: discountKeys.details(variables.id) }),
            ]);
        },
    });
}

export function useDeleteDiscount() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: number): Promise<DeleteDiscountResponse> => {
            const response = await apiClient.delete<DeleteDiscountResponse>(
                `/payroll/discounts/${id}/`,
            );

            return response.data;
        },
        onSuccess: async (_, id) => {
            await Promise.all([
                queryClient.invalidateQueries({ queryKey: discountKeys.all() }),
                queryClient.invalidateQueries({ queryKey: discountKeys.details(id) }),
            ]);
        },
    });
}
