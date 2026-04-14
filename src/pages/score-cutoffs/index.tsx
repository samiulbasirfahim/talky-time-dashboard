import { FileText } from "lucide-react";
import { HeaderSection } from "../../components/header-section";
import { ScoreCutoffCards } from "./score-cutoff-cards";
import { ScoreCutoffTable } from "./score-cutoff-table";
import { ScoreCutoffWindowStatus } from "./score-cutoff-window-status";

export function ScoreCutoffs() {
    return (
        <>
            <HeaderSection
                title="Score Cutoff"
                description={`Operator performance snapshot`}
                buttons={[
                    {
                        label: "Cutoff Report",
                        icon: FileText,
                        onClick: () => {
                            console.log("Pressed Cutoff Report!");
                        },
                    },
                ]}
            />
            <ScoreCutoffCards />
            <ScoreCutoffWindowStatus />
            <ScoreCutoffTable />
        </>
    );
}
