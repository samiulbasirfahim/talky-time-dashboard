import { CircleDollarSign } from "lucide-react";
import { AppButton } from "../../components/button";
import { AppInputField } from "../../components/form-field";
import { AppText } from "../../components/text";

type SettingsExchangeRateProps = {
    exchangeRate: string;
    exchangeRateUpdatedAt?: string;
    onExchangeRateChange: (value: string) => void;
    onUpdateExchangeRate: () => void;
    isUpdatingExchangeRate: boolean;
    isReadOnly?: boolean;
};

export function SettingsExchangeRate({
    exchangeRate,
    exchangeRateUpdatedAt,
    onExchangeRateChange,
    onUpdateExchangeRate,
    isUpdatingExchangeRate,
    isReadOnly = false,
}: SettingsExchangeRateProps) {

    const formattedLastUpdated = (() => {
        if (!exchangeRateUpdatedAt) {
            return "-";
        }

        const parsedDate = new Date(exchangeRateUpdatedAt);
        if (Number.isNaN(parsedDate.getTime())) {
            return exchangeRateUpdatedAt;
        }

        return parsedDate.toLocaleString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        });
    })();

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
                onChange={onExchangeRateChange}
                fullWidth={false}
                inputClassName="w-36"
                disabled={isReadOnly}
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
                        {formattedLastUpdated}
                    </span>
                </div>

                {!isReadOnly && (
                    <AppButton
                        variant="outline"
                        size="sm"
                        className="h-9 rounded-lg border-text-focus/45 px-4 font-semibold text-text-focus"
                        onClick={onUpdateExchangeRate}
                        isLoading={isUpdatingExchangeRate}
                        loadingLabel="Updating..."
                        disabled={isUpdatingExchangeRate}
                    >
                        Update Rate
                    </AppButton>
                )}
            </div>

            <div className="rounded-xl bg-bg-focus px-4 py-3">
                <AppText variant="description" className="">
                    <span className="font-semibold text-text-focus">Monthly Update Control:</span> <span className="text-text-focus/70">
                        Exchange rate should be
                    updated at the beginning of each month to ensure accurate payout calculations.
                    </span>
                </AppText>
            </div>
        </section>
    );
}
