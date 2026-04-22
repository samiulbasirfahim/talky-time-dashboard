import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { groupKeys } from "./keys";
import type {
    GroupCreationPayload,
    GroupCreateResponse,
    GroupDetailResponse,
    GroupSearchResponse,
    GroupUpdatePayload,
} from "../../type/group.query.type";
import { apiClient } from "../axios";

export const ALL_GROUPS_LIMIT = 200;

export function useCreateGroup() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: GroupCreationPayload): Promise<GroupCreateResponse> => {
            const response = await apiClient.post<GroupCreateResponse>(
                "/operations/operator-groups/",
                payload,
            );
            return response.data;
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: groupKeys.all(),
            });
        },
    });
}

export function useSearchGroups(query: string) {
    return useQuery({
        queryKey: groupKeys.search(query),
        queryFn: async (): Promise<GroupSearchResponse> => {
            const normalizedQuery = query.trim();
            const endpoint = normalizedQuery
                ? `/operations/operator-groups/?limit=5&search=${encodeURIComponent(normalizedQuery)}`
                : "/operations/operator-groups/?limit=5";

            const response = await apiClient.get<GroupSearchResponse>(endpoint);
            return response.data;
        },
    });
}

export function useDeleteGroup() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: number): Promise<void> => {
            await apiClient.delete(`/operations/operator-groups/${id}/`);
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: groupKeys.all(),
            });
        },
    });
}

export function useAllGroups() {
    return useAllGroupsWithLimit(ALL_GROUPS_LIMIT);
}

export function useAllGroupsWithLimit(limit: number) {
    return useQuery({
        queryKey: groupKeys.list(limit),
        queryFn: async (): Promise<GroupSearchResponse> => {
            const response = await apiClient.get<GroupSearchResponse>(
                `/operations/operator-groups/?limit=${limit}`,
            );
            return response.data;
        },
    });
}


export const useGroupDetails = (id: number | string | null) => {
    return useQuery({
        queryKey: groupKeys.details(id ?? "none"),
        queryFn: async (): Promise<GroupDetailResponse> => {
            const response = await apiClient.get<GroupDetailResponse>(`/operations/operator-groups/${id}/`);
            if (response.status === 404) {
                throw new Error("Group not found");
            }
            return response.data;
        },
        enabled: id !== null,
    });
};

export function useUpdateGroup() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            id,
            payload,
        }: {
            id: number;
            payload: GroupUpdatePayload;
        }): Promise<GroupDetailResponse> => {
            const response = await apiClient.patch<GroupDetailResponse>(
                `/operations/operator-groups/${id}/`,
                payload,
            );
            return response.data;
        },
        onSuccess: async (_, variables) => {
            await Promise.all([
                queryClient.invalidateQueries({ queryKey: groupKeys.all() }),
                queryClient.invalidateQueries({ queryKey: groupKeys.details(variables.id) }),
            ]);
        },
    });
}