import { useQuery } from "@tanstack/react-query";
import type {
    DashboardEarningsResponse,
    ReportsLeaderboardPeriod,
    ReportsLeaderboardResponse,
    ReportsSummaryResponse,
    SystemNotificationResponse,
    DashboardStatsResponse,
} from "../../type";
import { apiClient } from "../axios";
import { dashboardKeys } from "./keys";

export function useReportsSummary() {
    return useQuery({
        queryKey: dashboardKeys.summary(),
        queryFn: async (): Promise<ReportsSummaryResponse> => {
            const response = await apiClient.get<ReportsSummaryResponse>(
                "/reports/summary/",
            );

            return response.data;
        },
    });
}

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

export function useLatestSystemNotifications() {
    return useQuery({
        queryKey: [...dashboardKeys.all(), "system-notifications"] as const,
        queryFn: async (): Promise<SystemNotificationResponse> => {
            const response = await apiClient.get<SystemNotificationResponse>(
                "/system-notifications/latest/",
            );

            return response.data;
        },
    });
}

export function useDashboardStats() {
    return useQuery({
        queryKey: dashboardKeys.stats(),
        queryFn: async (): Promise<DashboardStatsResponse> => {
            const response = await apiClient.get<DashboardStatsResponse>(
                "/reports/dashboard-stats/",
            );
            return response.data;
        },
    });
}