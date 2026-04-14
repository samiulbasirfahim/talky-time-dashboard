import { Save } from "lucide-react";
import { HeaderSection } from "../../components/header-section";
import { SettingsExchangeRate } from "./settings-exchange-rate";
import { SettingsPayoutConfiguration } from "./settings-payout-configuration";
import { SettingsShiftSettings } from "./settings-shift-settings";
import { SettingsSystemConfiguration } from "./settings-system-configuration";

export function Settings() {
    return (
        <>
            <HeaderSection
                title="Settings"
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

            <div className="p-4">
                <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                    <SettingsPayoutConfiguration />
                    <SettingsSystemConfiguration />
                    <SettingsExchangeRate />
                    <SettingsShiftSettings />
                </div>
            </div>
        </>
    );
}
