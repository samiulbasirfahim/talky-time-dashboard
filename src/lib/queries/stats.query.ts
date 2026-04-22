import { queryClient } from "."

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
}

export function useDashboardStats() {
    
}
export function useSupervisorsStats() {}

export function useOperatorStats() {}

export function useProfileStats() {}

export function useScoreCutoffStats() {}

export function useBonusPerformanceStats() {}

export function useReportHistoryStats() {}

export function usePayoutStats() {}

export function useDisciplineStats() {}

export function refreshAllStats() {
    queryClient.invalidateQueries({ queryKey: statsKeys.all() });
}