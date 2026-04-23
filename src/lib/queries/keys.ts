export const authKeys = {
    me: () => ["auth", "me"] as const,
}

export const adminKeys = {
    all: () => ["admins"] as const,
    paginatedRoot: () => [...adminKeys.all(), "paginated"] as const,
    paginated: (page: number) => [...adminKeys.paginatedRoot(), page] as const,
    generalManagersAll: () => ["general-managers"] as const,
    generalManagersPaginatedRoot: () => [...adminKeys.generalManagersAll(), "paginated"] as const,
    generalManagersPaginated: (page: number) => [...adminKeys.generalManagersPaginatedRoot(), page] as const,
}

export const groupKeys = {
    all: () => ["groups"] as const,
    list: (limit: number) => [...groupKeys.all(), "list", limit] as const,
    search: (query: string) => [...groupKeys.all(), "search", query] as const,
    details: (id: number | string) => [...groupKeys.all(), "details", id] as const,
}

export const supervisorKeys = {
    all: () => ["supervisors"] as const,
    search: (query: string, withoutGroup?: boolean) => [...supervisorKeys.all(), "search", query, withoutGroup] as const,
    details: (id: string | number) => [...supervisorKeys.all(), "details", id] as const,
    paginatedRoot: () => [...supervisorKeys.all(), "paginated"] as const,
    paginated: (page: number, groupId?: number | string) => [...supervisorKeys.paginatedRoot(), page, groupId ?? "all-groups"] as const,
}

export const operatorKeys = {
    all: () => ["operators"] as const,
    search: (query: string, withoutGroup?: boolean, groupId?: number | string) =>
        [...operatorKeys.all(), "search", query, withoutGroup, groupId ?? "all-groups"] as const,
    details: (id: string | number) => [...operatorKeys.all(), "details", id] as const,
    paginatedRoot: () => [...operatorKeys.all(), "paginated"] as const,
    paginated: (page: number, groupId?: number | string) => [...operatorKeys.paginatedRoot(), page, groupId ?? "all-groups"] as const,
    latestStatusChanges: () => [...operatorKeys.all(), "status-changes", "latest"] as const,
}

export const profileKeys = {
    all: () => ["profiles"] as const,
    details: (id: string | number) => [...profileKeys.all(), "details", id] as const,
    paginatedRoot: () => [...profileKeys.all(), "paginated"] as const,
    paginated: (page: number, groupId?: number | string) =>
        [...profileKeys.paginatedRoot(), page, groupId ?? "all-groups"] as const,
    search: (
        query: string,
        groupId?: number | string,
        withoutOperatorOnSearch?: boolean,
        withoutGroupOnSearch?: boolean,
    ) =>
        [
            ...profileKeys.all(),
            "search",
            query,
            groupId ?? "all-groups",
            withoutOperatorOnSearch,
            withoutGroupOnSearch,
        ] as const,
    latestReassignments: (limit: number) =>
        [...profileKeys.all(), "latest-reassignments", limit] as const,
}

export const debtsKeys = {
    all: () => ["debts"] as const,
    page: (page: number) => [...debtsKeys.all(), "page", page] as const,
}

export const cashAdvanceKeys = {
    all: () => ["cash-advances"] as const,
    page: (page: number) => [...cashAdvanceKeys.all(), "page", page] as const,
    details: (id: number | string) => [...cashAdvanceKeys.all(), "details", id] as const,
}

export const discountKeys = {
    all: () => ["discounts"] as const,
    page: (page: number) => [...discountKeys.all(), "page", page] as const,
    details: (id: number | string) => [...discountKeys.all(), "details", id] as const,
}

export const payoutKeys = {
    all: () => ["payouts"] as const,
    breakdownRoot: (year: number, month: number) =>
        [...payoutKeys.all(), "breakdown", year, month] as const,
    breakdownPage: (year: number, month: number, page: number) =>
        [...payoutKeys.breakdownRoot(year, month), page] as const,
}

export const csvKeys = {
    all: () => ["csv"] as const,
    latest: () => [...csvKeys.all(), "latest"] as const,
}

export const scoreCutoffKeys = {
    all: () => ["score-cutoffs"] as const,
    paginatedRoot: () => [...scoreCutoffKeys.all(), "paginated"] as const,
    paginated: (page: number) => [...scoreCutoffKeys.paginatedRoot(), page] as const,
}

export const dashboardKeys = {
    all: () => ["dashboard"] as const,
    summary: () => [...dashboardKeys.all(), "summary"] as const,
    stats: () => [...dashboardKeys.all(), "stats"] as const,
    earnings: () => [...dashboardKeys.all(), "earnings"] as const,
    leaderboard: (period: string, year: number, month: number, limit: number) =>
        [...dashboardKeys.all(), "leaderboard", period, year, month, limit] as const,
}

export const disciplineKeys = {
    all: () => ["discipline"] as const,
    overview: () => [...disciplineKeys.all(), "overview"] as const,
    warnings: () => [...disciplineKeys.all(), "warnings"] as const,
    warningLogsRoot: () => [...disciplineKeys.all(), "warning-logs"] as const,
    warningLogs: (page: number) => [...disciplineKeys.warningLogsRoot(), page] as const,
    reprimandsRoot: () => [...disciplineKeys.all(), "reprimands"] as const,
    recentReprimands: (limit: number) => [...disciplineKeys.reprimandsRoot(), "recent", limit] as const,
    paginatedReprimandsRoot: () => [...disciplineKeys.reprimandsRoot(), "paginated"] as const,
    paginatedReprimands: (page: number) => [...disciplineKeys.paginatedReprimandsRoot(), page] as const,
}

export const settingsKeys = {
    all: () => ["settings"] as const,
    system: () => [...settingsKeys.all(), "system"] as const,
}