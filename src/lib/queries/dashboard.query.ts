import { useQuery } from "@tanstack/react-query";
import type { DashboardEarningsResponse } from "../../type";
import { apiClient } from "../axios";
import { dashboardKeys } from "./keys";

export function useDashboardEarnings() {
    return useQuery({
        queryKey: dashboardKeys.earnings(),
        queryFn: async (): Promise<DashboardEarningsResponse> => {
            const response = await apiClient.get<DashboardEarningsResponse>(
                "/reports/earnings/",
            );

            return response.data;
        },
    });
}