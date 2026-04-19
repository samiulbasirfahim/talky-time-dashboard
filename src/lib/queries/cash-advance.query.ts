import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
    CashAdvanceMutationResponse,
    CashAdvancePaginatedResponse,
    CreateCashAdvancePayload,
    DeleteCashAdvanceResponse,
    UpdateCashAdvancePayload,
} from "../../type";
import { apiClient } from "../axios";
import { cashAdvanceKeys } from "./keys";

export function usePaginatedCashAdvances(page = 1, enabled = true) {
    return useQuery({
        queryKey: cashAdvanceKeys.page(page),
        queryFn: async (): Promise<CashAdvancePaginatedResponse> => {
            const response = await apiClient.get<CashAdvancePaginatedResponse>(
                `/payroll/cash-advances/?page=${page}`,
            );

            return response.data;
        },
        enabled,
    });
}

export function useCashAdvanceDetails(id: number | null, enabled = true) {
    return useQuery({
        queryKey: cashAdvanceKeys.details(id ?? "none"),
        queryFn: async (): Promise<CashAdvanceMutationResponse> => {
            const response = await apiClient.get<CashAdvanceMutationResponse>(
                `/payroll/cash-advances/${id}/`,
            );

            return response.data;
        },
        enabled: enabled && id !== null,
    });
}

export function useCreateCashAdvance() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (
            payload: CreateCashAdvancePayload,
        ): Promise<CashAdvanceMutationResponse> => {
            const response = await apiClient.post<CashAdvanceMutationResponse>(
                "/payroll/cash-advances/",
                payload,
            );

            return response.data;
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: cashAdvanceKeys.all(),
            });
        },
    });
}

export function useUpdateCashAdvance() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            id,
            payload,
        }: {
            id: number;
            payload: UpdateCashAdvancePayload;
        }): Promise<CashAdvanceMutationResponse> => {
            const response = await apiClient.patch<CashAdvanceMutationResponse>(
                `/payroll/cash-advances/${id}/`,
                payload,
            );

            return response.data;
        },
        onSuccess: async (_, variables) => {
            await Promise.all([
                queryClient.invalidateQueries({ queryKey: cashAdvanceKeys.all() }),
                queryClient.invalidateQueries({
                    queryKey: cashAdvanceKeys.details(variables.id),
                }),
            ]);
        },
    });
}

export function useDeleteCashAdvance() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: number): Promise<DeleteCashAdvanceResponse> => {
            const response = await apiClient.delete<DeleteCashAdvanceResponse>(
                `/payroll/cash-advances/${id}/`,
            );

            return response.data;
        },
        onSuccess: async (_, id) => {
            await Promise.all([
                queryClient.invalidateQueries({ queryKey: cashAdvanceKeys.all() }),
                queryClient.invalidateQueries({
                    queryKey: cashAdvanceKeys.details(id),
                }),
            ]);
        },
    });
}
