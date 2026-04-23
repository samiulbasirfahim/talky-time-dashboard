import { BadgePercent } from "lucide-react";
import { AppInputField } from "../../components/form-field";
import { AppText } from "../../components/text";

type SettingsPayoutConfigurationProps = {
    qualificationThreshold: string;
    onQualificationThresholdChange: (value: string) => void;
};

export function SettingsPayoutConfiguration({
    qualificationThreshold,
    onQualificationThresholdChange,
}: SettingsPayoutConfigurationProps) {
    return (
        <section className="p-4 shadow-border shadow-xs rounded-md w-full space-y-4 border border-border">
            <div className="space-y-1">
                <div className="flex items-center gap-2">
                    <BadgePercent size={26} className="text-text-muted" />
                    <AppText variant="smallHeader" className="font-semibold text-text">
                        Payout Configuration
                    </AppText>
                </div>
                <AppText variant="description" className="text-text-secondary">
                    Configure commission rates and performance thresholds
                </AppText>
            </div>

            <AppInputField
                label="25% Qualification Threshold"
                description="Minimum bonuses required to qualify for high performance rate"
                type="number"
                value={qualificationThreshold}
                onChange={onQualificationThresholdChange}
                suffix={
                    <AppText variant="description" className="text-base text-text-muted">
                        bonuses
                    </AppText>
                }
            />
        </section>
    );
}
