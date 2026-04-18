import { useMutation, useQuery } from "@tanstack/react-query";
import type { ScoreCutoffPaginatedResponse } from "../../type";
import { apiClient } from "../axios";
import { scoreCutoffKeys } from "./keys";

export const SCORE_CUTOFFS_PAGE_SIZE = 10;

const buildSettlementFileName = () => {
    const datePart = new Date().toISOString().slice(0, 10);
    return `Settlement_Report_${datePart}.csv`;
};

const downloadCsvFile = (csvData: string, fileName: string) => {
    if (typeof window === "undefined") {
        return;
    }

    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.setAttribute("href", url);
    link.setAttribute("download", fileName);
    link.style.visibility = "hidden";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};

export function usePaginatedScoreCutoffs(page: number) {
    return useQuery({
        queryKey: scoreCutoffKeys.paginated(page),
        queryFn: async (): Promise<ScoreCutoffPaginatedResponse> => {
            const response = await apiClient.get<ScoreCutoffPaginatedResponse>(
                `/operations/score-cutoffs/page/?page=${page}`,
            );

            return response.data;
        },
    });
}

export function useDownloadScoreCutoffCsv() {
    return useMutation({
        mutationFn: async (cutoffId: number): Promise<string> => {
            const response = await apiClient.get<string>(
                `/operations/score-cutoffs/${cutoffId}/csv`,
                {
                    responseType: "text",
                },
            );

            return response.data;
        },
        onSuccess: (csvData) => {
            downloadCsvFile(csvData, buildSettlementFileName());
        },
    });
}