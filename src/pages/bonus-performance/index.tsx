import { HeaderSection } from "../../components/header-section";
import { CommonStatCards } from "../../components/common-stat-cards";
import { BonusPerformanceTable } from "./bonus-performance-table";

export function BonusPerformance() {
    return (
        <>
            <HeaderSection
                title="Bonus & Performance"
                description={`Curate and manage operator incentives based on real-time performance metrics across all regional clusters.`}
                buttons={[
                    // {
                    //     label: "Set Target",
                    //     icon: Target,
                    //     onClick: () => {
                    //         console.log("Pressed Set Target!");
                    //     },
                    // },
                ]}
            />
            <CommonStatCards />
            <BonusPerformanceTable />
        </>
    );
}
