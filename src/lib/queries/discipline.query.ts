import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
    DisciplinaryReprimandPaginatedResponse,
    DisciplinaryWarningLogResponse,
    IssueDisciplinaryWarningPayload,
    IssueDisciplinaryWarningResponse,
    RevokeDisciplinaryWarningResponse,
} from "../../type";
import { apiClient } from "../axios";
import { disciplineKeys } from "./keys";

export const DISCIPLINE_WARNING_LOG_PAGE_SIZE = 10;
export const DISCIPLINE_REPRIMAND_PAGE_SIZE = 10;

export function useRecentDisciplinaryReprimands(limit = 2) {
    return useQuery({
        queryKey: disciplineKeys.recentReprimands(limit),
        queryFn: async (): Promise<DisciplinaryReprimandPaginatedResponse> => {
            const response = await apiClient.get<DisciplinaryReprimandPaginatedResponse>(
                `/payroll/disciplinary/reprimands/recent/?limit=${limit}`,
            );

            return response.data;
        },
    });
}

export function usePaginatedDisciplinaryReprimands(page: number, enabled = true) {
    return useQuery({
        queryKey: disciplineKeys.paginatedReprimands(page),
        queryFn: async (): Promise<DisciplinaryReprimandPaginatedResponse> => {
            const response = await apiClient.get<DisciplinaryReprimandPaginatedResponse>(
                `/payroll/disciplinary/reprimands/page/?page=${page}`,
            );

            return response.data;
        },
        enabled,
    });
}

export function usePaginatedDisciplinaryWarningLog(page: number) {
    return useQuery({
        queryKey: disciplineKeys.warningLogs(page),
        queryFn: async (): Promise<DisciplinaryWarningLogResponse> => {
            const response = await apiClient.get<DisciplinaryWarningLogResponse>(
                `/payroll/disciplinary/warnings/log/?page=${page}`,
            );

            return response.data;
        },
    });
}

export function useIssueDisciplinaryWarning() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (
            payload: IssueDisciplinaryWarningPayload,
        ): Promise<IssueDisciplinaryWarningResponse> => {
            const response = await apiClient.post<IssueDisciplinaryWarningResponse>(
                "/payroll/disciplinary/warnings/",
                payload,
            );

            return response.data;
        },
        onSuccess: async () => {
            await Promise.all([
                queryClient.invalidateQueries({
                    queryKey: disciplineKeys.warnings(),
                }),
                queryClient.invalidateQueries({
                    queryKey: disciplineKeys.warningLogsRoot(),
                }),
            ]);
        },
    });
}

export function useRevokeDisciplinaryWarning() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (warningId: number): Promise<RevokeDisciplinaryWarningResponse> => {
            const response = await apiClient.delete<RevokeDisciplinaryWarningResponse>(
                `/payroll/disciplinary/warnings/${warningId}/revoke/`,
            );

            return response.data;
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: disciplineKeys.warningLogsRoot(),
            });
        },
    });
}