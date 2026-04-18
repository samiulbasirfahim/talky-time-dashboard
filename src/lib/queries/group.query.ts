import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { groupKeys } from "./keys";
import type {
    GroupCreationPayload,
    GroupCreateResponse,
    GroupSearchResponse,
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
