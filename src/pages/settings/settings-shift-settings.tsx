import React from "react";
import { SunMoon } from "lucide-react";
import { AppDropdownField } from "../../components/form-field";
import { AppText } from "../../components/text";

const TIME_OPTIONS = [
    { value: "7am", label: "7:00 AM" },
    { value: "8am", label: "8:00 AM" },
    { value: "9am", label: "9:00 AM" },
    { value: "7pm", label: "7:00 PM" },
    { value: "8pm", label: "8:00 PM" },
];

export function SettingsShiftSettings() {
    const [dayStartTime, setDayStartTime] = React.useState("7am");
    const [dayTimezone, setDayTimezone] = React.useState("7pm");
    const [nightStartTime, setNightStartTime] = React.useState("7pm");
    const [nightTimezone, setNightTimezone] = React.useState("7am");

    return (
        <section className="w-full space-y-4 rounded-md p-4 shadow-border shadow-xs">
            <div className="space-y-1">
                <div className="flex items-center gap-2">
                    <SunMoon size={26} className="text-text-muted" />
                    <AppText variant="smallHeader" className="font-semibold text-text">
                        Shift Settings
                    </AppText>
                </div>
                <AppText variant="description" className="text-text-secondary">
                    Configure day and night shift schedules
                </AppText>
            </div>

            <div className="space-y-2">
                <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#F59E0B]" />
                    <AppText variant="smallHeader" className="text-base font-semibold text-text">
                        Day Shift
                    </AppText>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <AppDropdownField
                        label="Start Time"
                        value={dayStartTime}
                        options={TIME_OPTIONS}
                        onChange={setDayStartTime}
                    />
                    <AppDropdownField
                        label="Timezone"
                        value={dayTimezone}
                        options={TIME_OPTIONS}
                        onChange={setDayTimezone}
                    />
                </div>
            </div>

            <div className="space-y-2">
                <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#4F46E5]" />
                    <AppText variant="smallHeader" className="text-base font-semibold text-text">
                        Night Shift
                    </AppText>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <AppDropdownField
                        label="Start Time"
                        value={nightStartTime}
                        options={TIME_OPTIONS}
                        onChange={setNightStartTime}
                    />
                    <AppDropdownField
                        label="Timezone"
                        value={nightTimezone}
                        options={TIME_OPTIONS}
                        onChange={setNightTimezone}
                    />
                </div>
            </div>
        </section>
    );
}
