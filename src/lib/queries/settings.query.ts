import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
    SystemSettingsResponse,
    UpdateSystemSettingsPayload,
} from "../../type";
import { apiClient } from "../axios";
import { settingsKeys } from "./keys";

export function useSystemSettings() {
    return useQuery({
        queryKey: settingsKeys.system(),
        queryFn: async (): Promise<SystemSettingsResponse> => {
            const response = await apiClient.get<SystemSettingsResponse>("/settings/system/");
            return response.data;
        },
    });
}

export function useUpdateSystemSettings() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (
            payload: UpdateSystemSettingsPayload,
        ): Promise<SystemSettingsResponse> => {
            const response = await apiClient.patch<SystemSettingsResponse>(
                "/settings/system/",
                payload,
            );

            return response.data;
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: settingsKeys.system(),
            });
        },
    });
}