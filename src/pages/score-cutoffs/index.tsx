import { FileText } from "lucide-react";
import { HeaderSection } from "../../components/header-section";
import {
    useDownloadScoreCutoffCsv,
    usePaginatedScoreCutoffs,
} from "../../lib/queries";
import { ScoreCutoffCards } from "./score-cutoff-cards";
import { ScoreCutoffTable } from "./score-cutoff-table";
import { ScoreCutoffWindowStatus } from "./score-cutoff-window-status";

export function ScoreCutoffs() {
    const { data, isLoading: isLoadingCutoffPage } = usePaginatedScoreCutoffs(1);
    const { mutate: downloadCsv, isPending: isDownloadingCsv } = useDownloadScoreCutoffCsv();

    const latestCutoffId = data?.results?.[0]?.id ?? null;

    const handleDownloadCutoffReport = () => {
        if (latestCutoffId === null) {
            return;
        }

        downloadCsv(latestCutoffId);
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
                        disabled: isLoadingCutoffPage || latestCutoffId === null,
                    },
                ]}
            />
            <ScoreCutoffCards />
            <ScoreCutoffWindowStatus />
            <ScoreCutoffTable />
        </>
    );
}
