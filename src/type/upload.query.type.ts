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