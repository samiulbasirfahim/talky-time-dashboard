import React from "react";
import { Settings } from "lucide-react";
import { AppDropdownField, AppInputField } from "../../components/form-field";
import { AppText } from "../../components/text";

const TIMEZONE_OPTIONS = [
    { value: "utc-5", label: "UTC-5 (Colombia)" },
    { value: "utc-4", label: "UTC-4" },
    { value: "utc-3", label: "UTC-3" },
];

const CURRENCY_OPTIONS = [
    { value: "cop", label: "COP (Colombian Peso)" },
    { value: "usd", label: "USD (US Dollar)" },
    { value: "eur", label: "EUR (Euro)" },
];

const RESET_DAY_OPTIONS = [
    { value: "day-1", label: "Day 1" },
    { value: "day-5", label: "Day 5" },
    { value: "day-10", label: "Day 10" },
    { value: "day-15", label: "Day 15" },
];

export function SettingsSystemConfiguration() {
    const [systemName, setSystemName] = React.useState("Workforce Management System");
    const [timezone, setTimezone] = React.useState("utc-5");
    const [currency, setCurrency] = React.useState("cop");
    const [resetDay, setResetDay] = React.useState("day-1");

    return (
        <section className="p-4 shadow-border shadow-xs rounded-md w-full space-y-4 border border-border">
            <div className="space-y-1">
                <div className="flex items-center gap-2">
                    <Settings size={26} className="text-text-muted" />
                    <AppText variant="smallHeader" className="font-semibold text-text">
                        System Configuration
                    </AppText>
                </div>
                <AppText variant="description" className="text-text-secondary">
                    Configure core system settings and regional preferences
                </AppText>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <AppInputField
                    label="System Name"
                    type="text"
                    value={systemName}
                    onChange={setSystemName}
                />

                <AppDropdownField
                    label="Timezone"
                    value={timezone}
                    options={TIMEZONE_OPTIONS}
                    onChange={setTimezone}
                />

                <AppDropdownField
                    label="Payout Currency"
                    value={currency}
                    options={CURRENCY_OPTIONS}
                    onChange={setCurrency}
                />

                <AppDropdownField
                    label="Monthly Reset Day"
                    value={resetDay}
                    options={RESET_DAY_OPTIONS}
                    onChange={setResetDay}
                />
            </div>
        </section>
    );
}
