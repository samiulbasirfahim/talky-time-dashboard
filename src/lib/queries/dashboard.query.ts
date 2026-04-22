import { useQuery } from "@tanstack/react-query";
import type {
    DashboardEarningsResponse,
    ReportsLeaderboardPeriod,
    ReportsLeaderboardResponse,
} from "../../type";
import { apiClient } from "../axios";
import { dashboardKeys } from "./keys";

export function useDashboardEarnings(enabled = true) {
    return useQuery({
        queryKey: dashboardKeys.earnings(),
        queryFn: async (): Promise<DashboardEarningsResponse> => {
            const response = await apiClient.get<DashboardEarningsResponse>(
                "/reports/earnings/",
            );

            return response.data;
        },
        enabled,
    });
}

export function useReportsLeaderboard({
    period,
    year,
    month,
    limit,
}: {
    period: ReportsLeaderboardPeriod;
    year: number;
    month: number;
    limit: number;
}) {
    return useQuery({
        queryKey: dashboardKeys.leaderboard(period, year, month, limit),
        queryFn: async (): Promise<ReportsLeaderboardResponse> => {
            const response = await apiClient.get<ReportsLeaderboardResponse>(
                "/reports/leaderboard",
                {
                    params: {
                        period,
                        year,
                        month,
                        limit,
                    },
                },
            );

            return response.data;
        },
    });
}