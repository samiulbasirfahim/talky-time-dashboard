export const authKeys = {
    me: () => ["auth", "me"] as const,
}

export const groupKeys = {
    all: () => ["groups"] as const,
    list: () => [...groupKeys.all(), "list"] as const,
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