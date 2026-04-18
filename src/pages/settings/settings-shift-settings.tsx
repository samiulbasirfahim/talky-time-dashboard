import { SunMoon } from "lucide-react";
import { AppDropdownField } from "../../components/form-field";
import { AppText } from "../../components/text";

const TIME_OPTIONS = Array.from({ length: 24 }, (_, hour) => {
    const value = `${String(hour).padStart(2, "0")}:00:00`;
    const period = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 === 0 ? 12 : hour % 12;
    const label = `${hour12}:00 ${period}`;

    return { value, label };
});

type SettingsShiftSettingsProps = {
    dayShiftStartTime: string;
    dayShiftEndTime: string;
    nightShiftStartTime: string;
    nightShiftEndTime: string;
    onDayShiftStartTimeChange: (value: string) => void;
    onDayShiftEndTimeChange: (value: string) => void;
    onNightShiftStartTimeChange: (value: string) => void;
    onNightShiftEndTimeChange: (value: string) => void;
};

export function SettingsShiftSettings({
    dayShiftStartTime,
    dayShiftEndTime,
    nightShiftStartTime,
    nightShiftEndTime,
    onDayShiftStartTimeChange,
    onDayShiftEndTimeChange,
    onNightShiftStartTimeChange,
    onNightShiftEndTimeChange,
}: SettingsShiftSettingsProps) {

    return (
              <section className="p-4 shadow-border shadow-xs rounded-md w-full space-y-4 border border-border">
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
                        value={dayShiftStartTime}
                        options={TIME_OPTIONS}
                        onChange={onDayShiftStartTimeChange}
                    />
                    <AppDropdownField
                        label="End Time"
                        value={dayShiftEndTime}
                        options={TIME_OPTIONS}
                        onChange={onDayShiftEndTimeChange}
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
                        value={nightShiftStartTime}
                        options={TIME_OPTIONS}
                        onChange={onNightShiftStartTimeChange}
                    />
                    <AppDropdownField
                        label="End Time"
                        value={nightShiftEndTime}
                        options={TIME_OPTIONS}
                        onChange={onNightShiftEndTimeChange}
                    />
                </div>
            </div>
        </section>
    );
}
