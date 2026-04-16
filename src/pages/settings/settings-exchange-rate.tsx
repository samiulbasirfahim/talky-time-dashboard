import React from "react";
import { CircleDollarSign } from "lucide-react";
import { AppButton } from "../../components/button";
import { AppInputField } from "../../components/form-field";
import { AppText } from "../../components/text";

export function SettingsExchangeRate() {
    const [exchangeRate, setExchangeRate] = React.useState("1000");

    return (
              <section className="p-4 shadow-border shadow-xs rounded-md w-full space-y-4 border border-border">
            <div className="space-y-1">
                <div className="flex items-center gap-2">
                    <CircleDollarSign size={26} className="text-text-muted" />
                    <AppText variant="smallHeader" className="font-semibold text-text">
                        Exchange Rate
                    </AppText>
                </div>
                <AppText variant="description" className="text-text-secondary">
                    Manage USD to COP conversion rate for payouts
                </AppText>
            </div>

            <AppInputField
                label="USD to COP Exchange Rate"
                type="number"
                value={exchangeRate}
                onChange={setExchangeRate}
                fullWidth={false}
                inputClassName="w-36"
                prefix={
                    <AppText variant="description" className="text-base text-text-secondary">
                        $1 USD =
                    </AppText>
                }
                suffix={
                    <AppText variant="description" className="text-base text-text-secondary">
                        COP
                    </AppText>
                }
            />

            <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                    <AppText variant="description" className="text-sm text-text-muted">
                        Last updated:
                    </AppText>
                    <span className="rounded-md bg-tab-bg px-3 py-1 text-sm font-semibold text-text">
                        March 15, 2026
                    </span>
                </div>

                <AppButton
                    variant="outline"
                    size="sm"
                    className="h-9 rounded-lg border-text-focus/45 px-4 font-semibold text-text-focus"
                >
                    Update Rate
                </AppButton>
            </div>

            <div className="rounded-xl bg-bg-focus px-4 py-3">
                <AppText variant="description" className="text-base text-text-focus">
                    <span className="font-semibold text-text-focus">Monthly Update Control:</span> Exchange rate should be
                    updated at the beginning of each month to ensure accurate payout calculations.
                </AppText>
            </div>
        </section>
    );
}
