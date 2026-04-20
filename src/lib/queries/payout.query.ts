import { useMutation, useQuery } from "@tanstack/react-query";
import type {
    PayoutBreakdownPaginatedResponse,
    PayoutBreakdownRequest,
} from "../../type";
import { apiClient } from "../axios";
import { payoutKeys } from "./keys";

export const PAYOUTS_PAGE_SIZE = 5;

type DownloadPayoutCsvPayload = {
    year: number;
    month: number;
};

const buildPayoutReportFileName = ({ year, month }: DownloadPayoutCsvPayload) => {
    return `Payout_Report_${year}-${String(month).padStart(2, "0")}.csv`;
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

export function usePayoutBreakdown({
    year,
    month,
    page = 1,
}: PayoutBreakdownRequest) {
    return useQuery({
        queryKey: payoutKeys.breakdownPage(year, month, page),
        queryFn: async (): Promise<PayoutBreakdownPaginatedResponse> => {
            const response = await apiClient.get<PayoutBreakdownPaginatedResponse>(
                `/payroll/payouts/breakdown/?year=${year}&month=${month}&page=${page}`,
            );

            return response.data;
        },
    });
}

export function useDownloadPayoutCsv() {
    return useMutation({
        mutationFn: async ({ year, month }: DownloadPayoutCsvPayload) => {
            const response = await apiClient.get<string>(
                `/payroll/payouts/download/?year=${year}&month=${month}`,
                {
                    responseType: "text",
                },
            );

            return {
                csvData: response.data,
                year,
                month,
            };
        },
        onSuccess: ({ csvData, year, month }) => {
            downloadCsvFile(csvData, buildPayoutReportFileName({ year, month }));
        },
    });
}
