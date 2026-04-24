import { useQuery } from "@tanstack/react-query";
import { queryClient } from ".";
import { apiClient } from "../axios";

const statsKeys = {
    all: () => ["stats"] as const,
    dashboard: () => [...statsKeys.all(), "dashboard"] as const,
    supervisors: () => [...statsKeys.all(), "supervisors"] as const,
    operators: () => [...statsKeys.all(), "operators"] as const,
    profiles: () => [...statsKeys.all(), "profiles"] as const,
    scoreCutoffs: () => [...statsKeys.all(), "score-cutoffs"] as const,
    bonusPerformance: () => [...statsKeys.all(), "bonus-performance"] as const,
    reportHistory: () => [...statsKeys.all(), "report-history"] as const,
    payouts: () => [...statsKeys.all(), "payouts"] as const,
    discipline: () => [...statsKeys.all(), "discipline"] as const,
};

export function useDashboardStats() { }
export function useSupervisorsStats() { }

export function useOperatorStats() { }

export function useProfileStats() { }

export function useScoreCutoffStats() { }

export function useBonusPerformanceStats() {
    return useQuery({
        queryKey: statsKeys.bonusPerformance(),
        queryFn: async () => {
            const response = await apiClient.get(
                "/operations/score-cutoffs/daily-total/",
            );
            if (!response.data) {
                throw "API ERROR, no daily total";
            }
            return response.data;
        },
    });
}

export function useReportHistoryStats() { }

export function usePayoutStats() { }

export function useDisciplineStats() { }

export function refreshAllStats() {
    queryClient.invalidateQueries({ queryKey: statsKeys.all() });
}
