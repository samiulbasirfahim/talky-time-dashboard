import { isAxiosError } from "axios";
import { Save } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { HeaderSection } from "../../components/header-section";
import { AppText } from "../../components/text";
import { useSystemSettings, useUpdateSystemSettings } from "../../lib/queries";
import { SettingsExchangeRate } from "./settings-exchange-rate";
import { SettingsPayoutConfiguration } from "./settings-payout-configuration";
import { SettingsShiftSettings } from "./settings-shift-settings";
import { SettingsSystemConfiguration } from "./settings-system-configuration";
import type { UpdateSystemSettingsValidationErrors } from "../../type";

type SettingsFormValues = {
    systemName: string;
    qualificationThreshold: string;
    dayShiftStartTime: string;
    dayShiftEndTime: string;
    nightShiftStartTime: string;
    nightShiftEndTime: string;
    exchangeRateUsdToCop: string;
    timezone: string;
    payoutCurrency: string;
    monthlyResetDay: string;
};

const INITIAL_SETTINGS_FORM: SettingsFormValues = {
    systemName: "",
    qualificationThreshold: "0.00",
    dayShiftStartTime: "07:00:00",
    dayShiftEndTime: "19:00:00",
    nightShiftStartTime: "19:00:00",
    nightShiftEndTime: "07:00:00",
    exchangeRateUsdToCop: "3900.00",
    timezone: "America/Bogota",
    payoutCurrency: "COP",
    monthlyResetDay: "1",
};

function getFirstErrorMessage(value: unknown): string | undefined {
    if (Array.isArray(value) && value.length > 0 && typeof value[0] === "string") {
        return value[0];
    }

    if (typeof value === "string") {
        return value;
    }

    return undefined;
}

export function Settings() {
    const [formValues, setFormValues] = useState<SettingsFormValues>(INITIAL_SETTINGS_FORM);
    const [exchangeRateUpdatedAt, setExchangeRateUpdatedAt] = useState<string | undefined>(undefined);
    const {
        data: settingsData,
        isLoading: isSettingsLoading,
        isError: isSettingsError,
    } = useSystemSettings();
    const {
        mutateAsync: updateSystemSettings,
        isPending: isSavingSettings,
    } = useUpdateSystemSettings();
    const {
        mutateAsync: updateExchangeRateOnly,
        isPending: isUpdatingExchangeRate,
    } = useUpdateSystemSettings();

    useEffect(() => {
        if (!settingsData) {
            return;
        }

        setFormValues({
            systemName: settingsData.system_name,
            qualificationThreshold: settingsData.qualification_threshold,
            dayShiftStartTime: settingsData.day_shift_start_time,
            dayShiftEndTime: settingsData.day_shift_end_time,
            nightShiftStartTime: settingsData.night_shift_start_time,
            nightShiftEndTime: settingsData.night_shift_end_time,
            exchangeRateUsdToCop: settingsData.exchange_rate_usd_to_cop,
            timezone: settingsData.timezone,
            payoutCurrency: settingsData.payout_currency,
            monthlyResetDay: String(settingsData.monthly_reset_day),
        });
        setExchangeRateUpdatedAt(settingsData.exchange_rate_updated_at);
    }, [settingsData]);

    const handleUpdateExchangeRate = async () => {
        const numericRate = Number(formValues.exchangeRateUsdToCop);

        if (!Number.isFinite(numericRate) || numericRate <= 0) {
            toast.error("Exchange rate must be a valid positive number.");
            return;
        }

        const normalizedRate = numericRate.toFixed(2);

        try {
            const updated = await updateExchangeRateOnly({
                exchange_rate_usd_to_cop: normalizedRate,
            });

            setFormValues((prev) => ({
                ...prev,
                exchangeRateUsdToCop: updated.exchange_rate_usd_to_cop,
            }));
            setExchangeRateUpdatedAt(updated.exchange_rate_updated_at);
            toast.success("Exchange rate updated successfully.");
        } catch (error) {
            if (isAxiosError<UpdateSystemSettingsValidationErrors>(error)) {
                const apiErrors = error.response?.data;
                const apiMessage =
                    getFirstErrorMessage(apiErrors?.exchange_rate_usd_to_cop) ??
                    getFirstErrorMessage(apiErrors?.detail) ??
                    getFirstErrorMessage(apiErrors?.non_field_errors);

                if (apiMessage) {
                    toast.error(apiMessage);
                    return;
                }
            }

            toast.error("Failed to update exchange rate. Please try again.");
        }
    };

    const handleSaveAllChanges = async () => {
        const monthlyResetDay = Number(formValues.monthlyResetDay);

        if (!Number.isInteger(monthlyResetDay) || monthlyResetDay < 1 || monthlyResetDay > 31) {
            toast.error("Monthly reset day must be between 1 and 31.");
            return;
        }

        try {
            await updateSystemSettings({
                system_name: formValues.systemName.trim(),
                qualification_threshold: formValues.qualificationThreshold,
                day_shift_start_time: formValues.dayShiftStartTime,
                day_shift_end_time: formValues.dayShiftEndTime,
                night_shift_start_time: formValues.nightShiftStartTime,
                night_shift_end_time: formValues.nightShiftEndTime,
                exchange_rate_usd_to_cop: formValues.exchangeRateUsdToCop,
                timezone: formValues.timezone,
                payout_currency: formValues.payoutCurrency,
                monthly_reset_day: monthlyResetDay,
            });

            toast.success("System settings updated successfully.");
        } catch (error) {
            if (isAxiosError<UpdateSystemSettingsValidationErrors>(error)) {
                const apiErrors = error.response?.data;
                const apiMessage =
                    getFirstErrorMessage(apiErrors?.detail) ??
                    getFirstErrorMessage(apiErrors?.non_field_errors) ??
                    getFirstErrorMessage(apiErrors?.system_name) ??
                    getFirstErrorMessage(apiErrors?.qualification_threshold) ??
                    getFirstErrorMessage(apiErrors?.day_shift_start_time) ??
                    getFirstErrorMessage(apiErrors?.day_shift_end_time) ??
                    getFirstErrorMessage(apiErrors?.night_shift_start_time) ??
                    getFirstErrorMessage(apiErrors?.night_shift_end_time) ??
                    getFirstErrorMessage(apiErrors?.exchange_rate_usd_to_cop) ??
                    getFirstErrorMessage(apiErrors?.timezone) ??
                    getFirstErrorMessage(apiErrors?.payout_currency) ??
                    getFirstErrorMessage(apiErrors?.monthly_reset_day);

                if (apiMessage) {
                    toast.error(apiMessage);
                    return;
                }
            }

            toast.error("Failed to update system settings. Please try again.");
        }
    };

    return (
        <>
            <HeaderSection
                title="Settings"
                description={`Curate and manage operator incentives based on real-time performance metrics across all regional clusters.`}
                buttons={[
                    {
                        label: "Save All Changes",
                        icon: Save,
                        onClick: handleSaveAllChanges,
                        isLoading: isSavingSettings,
                        loadingLabel: "Saving...",
                        disabled: isSettingsLoading || isSavingSettings,
                    },
                ]}
            />

            <div className="p-4">
                {isSettingsLoading && (
                    <AppText variant="description" className="mb-4 text-text-muted">
                        Loading settings...
                    </AppText>
                )}

                {isSettingsError && (
                    <AppText variant="description" className="mb-4 text-red">
                        Failed to load settings data.
                    </AppText>
                )}

                <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                    <SettingsPayoutConfiguration
                        qualificationThreshold={formValues.qualificationThreshold}
                        onQualificationThresholdChange={(value) => {
                            setFormValues((prev) => ({ ...prev, qualificationThreshold: value }));
                        }}
                    />
                    <SettingsSystemConfiguration
                        systemName={formValues.systemName}
                        timezone={formValues.timezone}
                        currency={formValues.payoutCurrency}
                        resetDay={formValues.monthlyResetDay}
                        onSystemNameChange={(value) => {
                            setFormValues((prev) => ({ ...prev, systemName: value }));
                        }}
                        onTimezoneChange={(value) => {
                            setFormValues((prev) => ({ ...prev, timezone: value }));
                        }}
                        onCurrencyChange={(value) => {
                            setFormValues((prev) => ({ ...prev, payoutCurrency: value }));
                        }}
                        onResetDayChange={(value) => {
                            setFormValues((prev) => ({ ...prev, monthlyResetDay: value }));
                        }}
                    />
                    <SettingsExchangeRate
                        exchangeRate={formValues.exchangeRateUsdToCop}
                        exchangeRateUpdatedAt={exchangeRateUpdatedAt}
                        onExchangeRateChange={(value) => {
                            setFormValues((prev) => ({ ...prev, exchangeRateUsdToCop: value }));
                        }}
                        onUpdateExchangeRate={handleUpdateExchangeRate}
                        isUpdatingExchangeRate={isUpdatingExchangeRate}
                    />
                    <SettingsShiftSettings
                        dayShiftStartTime={formValues.dayShiftStartTime}
                        dayShiftEndTime={formValues.dayShiftEndTime}
                        nightShiftStartTime={formValues.nightShiftStartTime}
                        nightShiftEndTime={formValues.nightShiftEndTime}
                        onDayShiftStartTimeChange={(value) => {
                            setFormValues((prev) => ({ ...prev, dayShiftStartTime: value }));
                        }}
                        onDayShiftEndTimeChange={(value) => {
                            setFormValues((prev) => ({ ...prev, dayShiftEndTime: value }));
                        }}
                        onNightShiftStartTimeChange={(value) => {
                            setFormValues((prev) => ({ ...prev, nightShiftStartTime: value }));
                        }}
                        onNightShiftEndTimeChange={(value) => {
                            setFormValues((prev) => ({ ...prev, nightShiftEndTime: value }));
                        }}
                    />
                </div>
            </div>
        </>
    );
}
