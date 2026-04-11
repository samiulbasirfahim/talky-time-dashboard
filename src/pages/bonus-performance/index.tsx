import { Plus } from "lucide-react";
import { HeaderSection } from "../../components/header-section";
import { BonusPerformanceCards } from "./bonus-performance-cards";
import { BonusPerformanceTable } from "./bonus-performance-table";

export function BonusPerformance() {
    return (
        <>
            <HeaderSection
                title="Bonus & Performance"
                description={`Curate and manage operator incentives based on real-time performance metrics across all regional clusters.`}
                buttons={[
                    {
                        label: "Add Bonus",
                        icon: Plus,
                        onClick: () => {
                            console.log("Pressed Add Bonus!");
                        },
                    },
                ]}
            />
            <BonusPerformanceCards />
            <BonusPerformanceTable />
        </>
    );
}
