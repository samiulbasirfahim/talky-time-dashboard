import { isAxiosError } from "axios";
import { FileText, Upload } from "lucide-react";
import React from "react";
import toast from "react-hot-toast";
import { AppButton } from "../../components/button";
import { useUploadCsv } from "../../lib/queries";
import type { UploadCsvErrorResponse } from "../../type";
import { AppText } from "../../components/text";

export function CsvUploadCards() {
    const inputRef = React.useRef<HTMLInputElement>(null);
    const { mutateAsync: uploadCsv, isPending: isUploading } = useUploadCsv();

    const handleBrowseClick = () => {
        inputRef.current?.click();
    };

    const getFirstErrorMessage = (value: unknown): string | undefined => {
        if (Array.isArray(value) && value.length > 0 && typeof value[0] === "string") {
            return value[0];
        }
        if (typeof value === "string") {
            return value;
        }
        return undefined;
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0] ?? null;
        event.target.value = "";

        if (!selectedFile) {
            return;
        }

        if (!selectedFile.name.toLowerCase().endsWith(".csv")) {
            toast.error("Please select a CSV file.");
            return;
        }

        try {
            await uploadCsv({ file: selectedFile });
            toast.success("CSV uploaded successfully.");
        } catch (error) {
            if (isAxiosError<UploadCsvErrorResponse>(error)) {
                const apiErrors = error.response?.data;
                const apiMessage =
                    getFirstErrorMessage(apiErrors?.detail) ??
                    getFirstErrorMessage(apiErrors?.non_field_errors);

                if (apiMessage) {
                    toast.error(apiMessage);
                    return;
                }
            }

            toast.error("Failed to upload CSV file. Please try again.");
        }
    };

    return (
        <div className="p-4">
            <div className="flex w-full items-center justify-center rounded-xl border border-dashed border-text-focus/25 py-12">
                <div className="flex flex-col items-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-bg-focus text-text-focus">
                        <Upload size={24} />
                    </div>

                    <AppText variant="smallHeader" className="mt-4 text-center text-text">
                        Upload CSV file
                    </AppText>

                    <AppText variant="description" className="mt-2 text-center text-text-muted">
                        Click below to browse a single CSV file
                    </AppText>

                    <input
                        ref={inputRef}
                        type="file"
                        accept=".csv,text/csv"
                        className="hidden"
                        onChange={handleFileChange}
                        disabled={isUploading}
                    />

                    <AppButton
                        variant="focus"
                        size="sm"
                        prefixIcon={FileText}
                        className="mt-4 rounded-lg px-6 py-2 text-sm font-semibold"
                        onClick={handleBrowseClick}
                        isLoading={isUploading}
                        loadingLabel="Uploading..."
                        disabled={isUploading}
                    >
                        Browse File
                    </AppButton>

                    <AppText variant="description" className="mt-4 text-center text-xs text-text-muted/60">
                        Accepted format: .csv · Max file size: 10MB
                    </AppText>
                </div>
            </div>
        </div>
    );
}
