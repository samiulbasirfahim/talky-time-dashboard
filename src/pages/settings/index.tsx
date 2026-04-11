import { Save } from "lucide-react";
import { HeaderSection } from "../../components/header-section";

export function Settings() {
    return (
        <HeaderSection
            title="Supervisors"
            description={`Curate and manage operator incentives based on real-time performance metrics across all regional clusters.`}
            buttons={[
                {
                    label: "Save All Changes",
                    icon: Save,
                    onClick: () => {
                        console.log("Pressed Save All Changes!");
                    },
                },
            ]}
        />
    );
}
