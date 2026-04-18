import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
    CsvLatestUploadsResponse,
    UploadCsvPayload,
    UploadCsvResponse,
} from "../../type";
import { apiClient } from "../axios";
import { csvKeys } from "./keys";

export function useLatestCsvUploads() {
    return useQuery({
        queryKey: csvKeys.latest(),
        queryFn: async (): Promise<CsvLatestUploadsResponse> => {
            const response = await apiClient.get<CsvLatestUploadsResponse>("/uploads/csv/latest/");
            return response.data;
        },
    });
}

export function useUploadCsv() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ file, isManualCutoff }: UploadCsvPayload): Promise<UploadCsvResponse> => {
            const formData = new FormData();
            formData.append("files", file);

            if (typeof isManualCutoff === "boolean") {
                formData.append("is_manual_cutoff", String(isManualCutoff));
            }

            const response = await apiClient.post<UploadCsvResponse>("/uploads/csv/", formData);
            return response.data;
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: csvKeys.latest(),
            });
        },
    });
}