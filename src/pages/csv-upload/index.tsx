import { HeaderSection } from "../../components/header-section";
import { CsvUploadCards } from "./csv-upload-cards";
import { CsvUploadTable } from "./csv-upload-table";

export function CsvUpload() {
    return (
        <>
            <HeaderSection
                title="CSV Upload System"
                description={`Upload bonus data files for processing.`}
                buttons={[]}
            />
            <CsvUploadCards />
            <CsvUploadTable />
        </>
    );
}
