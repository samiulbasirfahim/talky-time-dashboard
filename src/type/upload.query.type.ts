export type UploadCsvPayload = {
    file: File;
    isManualCutoff?: boolean;
};

export type UploadCsvResponse = unknown;

export type UploadCsvErrorResponse = {
    detail?: string | string[];
    non_field_errors?: string[];
    [key: string]: string[] | string | undefined;
};

export type CsvUploadedByName = "supervisor" | "admin" | null;

export type CsvUploadStatus = "success" | "error" | "failed";

export type CsvLatestUploadItem = {
    id: number;
    filename: string;
    status: CsvUploadStatus;
    record_count: number;
    uploaded_at: string;
    uploaded_by_name: CsvUploadedByName;
};

export type CsvLatestUploadsResponse = {
    count: number;
    results: CsvLatestUploadItem[];
};