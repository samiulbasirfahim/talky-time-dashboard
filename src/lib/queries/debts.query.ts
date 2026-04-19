import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
    CreateDebtPayload,
    DebtMutationResponse,
    DebtPaginatedResponse,
    DeleteDebtResponse,
    UpdateDebtPayload,
} from "../../type";
import { apiClient } from "../axios";
import { debtsKeys } from "./keys";

export function usePaginatedDebts(page = 1, enabled = true) {
	return useQuery({
		queryKey: debtsKeys.page(page),
		queryFn: async (): Promise<DebtPaginatedResponse> => {
			const response = await apiClient.get<DebtPaginatedResponse>(
				`/payroll/debts/?page=${page}`,
			);

			return response.data;
		},
		enabled,
	});
}

export function useCreateDebt() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (payload: CreateDebtPayload): Promise<DebtMutationResponse> => {
			const response = await apiClient.post<DebtMutationResponse>(
				"/payroll/debts/",
				payload,
			);

			return response.data;
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: debtsKeys.all(),
			});
		},
	});
}

export function useUpdateDebt() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({
			id,
			payload,
		}: {
			id: number;
			payload: UpdateDebtPayload;
		}): Promise<DebtMutationResponse> => {
			const response = await apiClient.patch<DebtMutationResponse>(
				`/payroll/debts/${id}/`,
				payload,
			);

			return response.data;
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: debtsKeys.all(),
			});
		},
	});
}

export function useDeleteDebt() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (id: number): Promise<DeleteDebtResponse> => {
			const response = await apiClient.delete<DeleteDebtResponse>(
				`/payroll/debts/${id}/`,
			);

			return response.data;
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: debtsKeys.all(),
			});
		},
	});
}
