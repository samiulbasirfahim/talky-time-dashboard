import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
    CreateProfilePayload,
    CreateProfileResponse,
    LatestReassignmentsResponse,
    MassAssignProfilePayload,
    ProfileReassignmentPayload,
    ProfilePaginatedResponse,
    ProfileResponse,
    SingleAssignProfilePayload,
    UpdateProfilePayload,
    UpdateProfileResponse,
} from "../../type";
import { apiClient } from "../axios";
import { profileKeys } from "./keys";

export const PROFILES_PAGE_LIMIT = 10;

export function useCreateProfile() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: CreateProfilePayload): Promise<CreateProfileResponse> => {
            const response = await apiClient.post<CreateProfileResponse>(
                "/operations/profiles/",
                payload,
            );
            return response.data;
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: profileKeys.all() });
        },
    });
}

export function usePaginatedProfiles(
    page: number,
    groupId?: number | string,
    enabled = true,
) {
    return useQuery({
        queryKey: profileKeys.paginated(page, groupId),
        queryFn: async (): Promise<ProfilePaginatedResponse> => {
            const params = new URLSearchParams({
                limit: String(PROFILES_PAGE_LIMIT),
                page: String(page),
            });

            if (groupId !== undefined && groupId !== null && String(groupId).trim().length > 0) {
                params.set("group_id", String(groupId));
            }

            const response = await apiClient.get<ProfilePaginatedResponse>(
                `/operations/profiles/?${params.toString()}`,
            );
            return response.data;
        },
        enabled,
    });
}

export function useSearchProfiles({
    query,
    groupId,
    withoutOperatorOnSearch,
    enabled = true,
    withoutGroupOnSearch,
    refetchInterval,
}: {
    query: string;
    groupId?: number | string;
    withoutOperatorOnSearch?: boolean;
    enabled?: boolean;
    withoutGroupOnSearch?: boolean;
    refetchInterval?: number;
}) {
    const normalizedQuery = query.trim();

    return useQuery({
        queryKey: profileKeys.search(
            normalizedQuery,
            groupId,
            withoutOperatorOnSearch,
            withoutGroupOnSearch,
        ),
        queryFn: async (): Promise<ProfilePaginatedResponse> => {
            const params = new URLSearchParams({
                limit: String(PROFILES_PAGE_LIMIT),
            });

            if (normalizedQuery.length > 0) {
                params.set("search", normalizedQuery);
            }
            
            if (withoutGroupOnSearch !== undefined) {
                params.set("without_group", String(withoutGroupOnSearch));
            }

            if (withoutOperatorOnSearch !== undefined) {
                params.set("without_operator", String(withoutOperatorOnSearch));
            }

            if (groupId !== undefined && groupId !== null && String(groupId).trim().length > 0) {
                params.set("group_id", String(groupId));
            }

            const response = await apiClient.get<ProfilePaginatedResponse>(
                `/operations/profiles/?${params.toString()}`,
            );
            return response.data;
        },
        enabled,
        refetchInterval,
    });
}

export function useSearchProfilesForGroup({
    query,
    withoutGroup,
    enabled = true,
}: {
    query: string;
    /** true = ungrouped only | false = grouped only | undefined = all */
    withoutGroup?: boolean;
    enabled?: boolean;
}) {
    const normalizedQuery = query.trim();

    return useQuery({
        queryKey: [...profileKeys.all(), "search-for-group", normalizedQuery, withoutGroup],
        queryFn: async (): Promise<ProfilePaginatedResponse> => {
            const params = new URLSearchParams({
                limit: "10",
            });

            if (normalizedQuery.length > 0) {
                params.set("search", normalizedQuery);
            }

            if (withoutGroup !== undefined) {
                params.set("without_group", String(withoutGroup));
            }

            const response = await apiClient.get<ProfilePaginatedResponse>(
                `/operations/profiles/?${params.toString()}`,
            );
            return response.data;
        },
        enabled,
    });
}

export function useProfileDetails(id: number | null) {
    return useQuery({
        queryKey: profileKeys.details(id ?? "none"),
        queryFn: async (): Promise<ProfileResponse> => {
            const response = await apiClient.get<ProfileResponse>(
                `/operations/profiles/${id}/`,
            );
            return response.data;
        },
        enabled: id !== null,
    });
}

export function useLatestReassignments(limit = 5) {
    return useQuery({
        queryKey: profileKeys.latestReassignments(limit),
        queryFn: async (): Promise<LatestReassignmentsResponse> => {
            const response = await apiClient.get<LatestReassignmentsResponse>(
                `/operations/assignments/latest-reassignments?limit=${limit}`,
            );

            return response.data;
        },
    });
}

export function useUpdateProfile() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            id,
            payload,
        }: {
            id: number;
            payload: UpdateProfilePayload;
        }): Promise<UpdateProfileResponse> => {
            const response = await apiClient.patch<UpdateProfileResponse>(
                `/operations/profiles/${id}/`,
                payload,
            );
            return response.data;
        },
        onSuccess: async (_, variables) => {
            await Promise.all([
                queryClient.invalidateQueries({ queryKey: profileKeys.all() }),
                queryClient.invalidateQueries({ queryKey: profileKeys.paginatedRoot() }),
                queryClient.invalidateQueries({ queryKey: profileKeys.details(variables.id) }),
            ]);
        },
    });
}

export function useDeleteProfile() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: number): Promise<void> => {
            await apiClient.delete(`/operations/profiles/${id}/?confirm=true`);
        },
        onSuccess: async (_, id) => {
            await Promise.all([
                queryClient.invalidateQueries({ queryKey: profileKeys.all() }),
                queryClient.invalidateQueries({ queryKey: profileKeys.paginatedRoot() }),
                queryClient.invalidateQueries({ queryKey: profileKeys.details(id) }),
            ]);
        },
    });
}

export function useMassAssignProfile() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: MassAssignProfilePayload) => {
            const res = await apiClient.post(`/operations/assignments/mass-assign/`, payload);
            return res.data;
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: profileKeys.all() });
            await queryClient.invalidateQueries({ queryKey: profileKeys.paginatedRoot() });
            await queryClient.invalidateQueries({ queryKey: profileKeys.details("all") });
        },
    });

}

export function useAssignProfile() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: SingleAssignProfilePayload) => {
            const res = await apiClient.post(`/operations/assignments/assign/`, payload);
            return res.data;
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: profileKeys.all() });
            await queryClient.invalidateQueries({ queryKey: profileKeys.paginatedRoot() });
        },
    });
}

export function useReassignProfiles() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: ProfileReassignmentPayload) => {
            const res = await apiClient.post(`/operations/assignments/reassign/`, payload);
            return res.data;
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: profileKeys.all() });
            await queryClient.invalidateQueries({ queryKey: profileKeys.paginatedRoot() });
            await queryClient.invalidateQueries({ queryKey: profileKeys.details("all") });
        },
    });
}