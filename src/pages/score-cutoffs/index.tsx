import { FileText } from "lucide-react";
import { HeaderSection } from "../../components/header-section";
import {
    useDownloadScoreCutoffCsv,
} from "../../lib/queries";
import { CommonStatCards } from "../../components/common-stat-cards";
import { ScoreCutoffTable } from "./score-cutoff-table";

export function ScoreCutoffs() {
    const { mutate: downloadCsv, isPending: isDownloadingCsv } = useDownloadScoreCutoffCsv();

    const handleDownloadCutoffReport = () => {
        downloadCsv();
    };

    return (
        <>
            <HeaderSection
                title="Score Cutoff"
                description={`Operator performance snapshot`}
                buttons={[
                    {
                        label: "Cutoff Report",
                        icon: FileText,
                        onClick: handleDownloadCutoffReport,
                        isLoading: isDownloadingCsv,
                        loadingLabel: "Downloading...",
                        disabled: isDownloadingCsv,
                    },
                ]}
            />
            <CommonStatCards />
            <ScoreCutoffTable />
        </>
    );
}
