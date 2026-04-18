export const authKeys = {
    me: () => ["auth", "me"] as const,
}

export const groupKeys = {
    all: () => ["groups"] as const,
    list: (limit: number) => [...groupKeys.all(), "list", limit] as const,
    search: (query: string) => [...groupKeys.all(), "search", query] as const,
}

export const supervisorKeys = {
    all: () => ["supervisors"] as const,
    search: (query: string) => [...supervisorKeys.all(), "search", query] as const,
    details: (id: string | number) => [...supervisorKeys.all(), "details", id] as const,
    paginatedRoot: () => [...supervisorKeys.all(), "paginated"] as const,
    paginated: (page: number) => [...supervisorKeys.paginatedRoot(), page] as const,
}

export const operatorKeys = {
    all: () => ["operators"] as const,
    search: (query: string) => [...operatorKeys.all(), "search", query] as const,
    details: (id: string | number) => [...operatorKeys.all(), "details", id] as const,
    paginatedRoot: () => [...operatorKeys.all(), "paginated"] as const,
    paginated: (page: number) => [...operatorKeys.paginatedRoot(), page] as const,
}

export const profileKeys = {
    all: () => ["profiles"] as const,
    details: (id: string | number) => [...profileKeys.all(), "details", id] as const,
    paginatedRoot: () => [...profileKeys.all(), "paginated"] as const,
    paginated: (page: number) => [...profileKeys.paginatedRoot(), page] as const,
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
    earnings: () => [...dashboardKeys.all(), "earnings"] as const,
}

export const disciplineKeys = {
    all: () => ["discipline"] as const,
    warnings: () => [...disciplineKeys.all(), "warnings"] as const,
    warningLogsRoot: () => [...disciplineKeys.all(), "warning-logs"] as const,
    warningLogs: (page: number) => [...disciplineKeys.warningLogsRoot(), page] as const,
}

export const settingsKeys = {
    all: () => ["settings"] as const,
    system: () => [...settingsKeys.all(), "system"] as const,
}