import React from "react";
import { BadgePercent } from "lucide-react";
import { AppInputField } from "../../components/form-field";
import { AppText } from "../../components/text";

export function SettingsPayoutConfiguration() {
    const [defaultCommissionRate, setDefaultCommissionRate] = React.useState("21");
    const [highPerformanceRate, setHighPerformanceRate] = React.useState("25");
    const [qualificationThreshold, setQualificationThreshold] = React.useState("1000");

    return (
        <section className="p-4 shadow-border shadow-xs rounded-md w-full space-y-4">
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

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <AppInputField
                    label="Default Commission Rate"
                    description="Standard commission rate for all operators"
                    type="number"
                    value={defaultCommissionRate}
                    onChange={setDefaultCommissionRate}
                    inputClassName="pr-8"
                    suffix={
                        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-base font-semibold text-text-muted">
                            %
                        </span>
                    }
                />

                <AppInputField
                    label="High Performance Rate"
                    description="Commission rate for top performers"
                    type="number"
                    value={highPerformanceRate}
                    onChange={setHighPerformanceRate}
                    inputClassName="pr-8"
                    suffix={
                        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-base font-semibold text-text-muted">
                            %
                        </span>
                    }
                />
            </div>

            <AppInputField
                label="Qualification Threshold"
                description="Minimum bonuses required to qualify for high performance rate"
                type="number"
                value={qualificationThreshold}
                onChange={setQualificationThreshold}
                suffix={
                    <AppText variant="description" className="text-base text-text-muted">
                        bonuses
                    </AppText>
                }
            />
        </section>
    );
}
