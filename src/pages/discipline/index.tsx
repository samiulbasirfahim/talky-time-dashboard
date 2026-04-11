import { HeaderSection } from "../../components/header-section";
import { DisciplineCards } from "./discipline-cards";
import { DisciplineWarningTable } from "./discipline-warning-table";

export function Discipline() {
    return (
        <>
            <HeaderSection
                title="Discipline"
                description={`Create and manage operator incentives based on real-time performance metrics across all regional clusters.`}
                buttons={[]}
            />
            <DisciplineCards />
            <div className="p-4">
                <DisciplineWarningTable />
            </div>
        </>
    );
}