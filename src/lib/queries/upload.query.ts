import { useMutation } from "@tanstack/react-query";
import type { UploadCsvPayload, UploadCsvResponse } from "../../type";
import { apiClient } from "../axios";

export function useUploadCsv() {
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
    });
}