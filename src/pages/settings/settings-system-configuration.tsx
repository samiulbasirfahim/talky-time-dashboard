import { Settings } from "lucide-react";
import { AppDropdownField, AppInputField } from "../../components/form-field";
import { AppText } from "../../components/text";

const TIMEZONE_OPTIONS = [
    { value: "America/Bogota", label: "(UTC-05:00) America/Bogota" },
    { value: "America/Lima", label: "(UTC-05:00) America/Lima" },
    { value: "America/Panama", label: "(UTC-05:00) America/Panama" },
    { value: "America/New_York", label: "(UTC-05:00/-04:00) America/New_York" },
    { value: "America/Mexico_City", label: "(UTC-06:00/-05:00) America/Mexico_City" },
    { value: "America/Chicago", label: "(UTC-06:00/-05:00) America/Chicago" },
    { value: "America/Denver", label: "(UTC-07:00/-06:00) America/Denver" },
    { value: "America/Los_Angeles", label: "(UTC-08:00/-07:00) America/Los_Angeles" },
    { value: "America/Caracas", label: "(UTC-04:00) America/Caracas" },
    { value: "America/Santiago", label: "(UTC-04:00/-03:00) America/Santiago" },
    { value: "America/Sao_Paulo", label: "(UTC-03:00) America/Sao_Paulo" },
    { value: "Europe/London", label: "(UTC+00:00/+01:00) Europe/London" },
    { value: "Europe/Madrid", label: "(UTC+01:00/+02:00) Europe/Madrid" },
    { value: "Europe/Berlin", label: "(UTC+01:00/+02:00) Europe/Berlin" },
    { value: "Europe/Paris", label: "(UTC+01:00/+02:00) Europe/Paris" },
    { value: "Asia/Dubai", label: "(UTC+04:00) Asia/Dubai" },
    { value: "Asia/Kolkata", label: "(UTC+05:30) Asia/Kolkata" },
    { value: "Asia/Bangkok", label: "(UTC+07:00) Asia/Bangkok" },
    { value: "Asia/Singapore", label: "(UTC+08:00) Asia/Singapore" },
    { value: "Asia/Tokyo", label: "(UTC+09:00) Asia/Tokyo" },
    { value: "Australia/Sydney", label: "(UTC+10:00/+11:00) Australia/Sydney" },
    { value: "UTC", label: "(UTC+00:00) UTC" },
];

const CURRENCY_OPTIONS = [
    { value: "COP", label: "COP (Colombian Peso)" },
    { value: "USD", label: "USD (US Dollar)" },
    { value: "EUR", label: "EUR (Euro)" },
    { value: "MXN", label: "MXN (Mexican Peso)" },
    { value: "BRL", label: "BRL (Brazilian Real)" },
];

const RESET_DAY_OPTIONS = [
    { value: "1", label: "Day 1" },
    { value: "2", label: "Day 2" },
    { value: "3", label: "Day 3" },
    { value: "5", label: "Day 5" },
    { value: "10", label: "Day 10" },
    { value: "15", label: "Day 15" },
    { value: "20", label: "Day 20" },
    { value: "25", label: "Day 25" },
    { value: "28", label: "Day 28" },
];

type SettingsSystemConfigurationProps = {
    systemName: string;
    timezone: string;
    currency: string;
    resetDay: string;
    onSystemNameChange: (value: string) => void;
    onTimezoneChange: (value: string) => void;
    onCurrencyChange: (value: string) => void;
    onResetDayChange: (value: string) => void;
    isReadOnly?: boolean;
};

export function SettingsSystemConfiguration({
    systemName,
    timezone,
    currency,
    resetDay,
    onSystemNameChange,
    onTimezoneChange,
    onCurrencyChange,
    onResetDayChange,
    isReadOnly = false,
}: SettingsSystemConfigurationProps) {

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
                    onChange={onSystemNameChange}
                    disabled={isReadOnly}
                />

                <AppDropdownField
                    label="Timezone"
                    value={timezone}
                    options={TIMEZONE_OPTIONS}
                    onChange={onTimezoneChange}
                    disabled={isReadOnly}
                />

                <AppDropdownField
                    label="Payout Currency"
                    value={currency}
                    options={CURRENCY_OPTIONS}
                    onChange={onCurrencyChange}
                    disabled={isReadOnly}
                />

                <AppDropdownField
                    label="Monthly Reset Day"
                    value={resetDay}
                    options={RESET_DAY_OPTIONS}
                    onChange={onResetDayChange}
                    disabled={isReadOnly}
                />
            </div>
        </section>
    );
}
