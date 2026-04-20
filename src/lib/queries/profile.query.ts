import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
    CreateProfilePayload,
    CreateProfileResponse,
    MassAssignProfilePayload,
    ProfilePaginatedResponse,
    ProfileResponse,
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

export function usePaginatedProfiles(page: number) {
    return useQuery({
        queryKey: profileKeys.paginated(page),
        queryFn: async (): Promise<ProfilePaginatedResponse> => {
            const response = await apiClient.get<ProfilePaginatedResponse>(
                `/operations/profiles/?limit=${PROFILES_PAGE_LIMIT}&page=${page}`,
            );
            return response.data;
        },
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