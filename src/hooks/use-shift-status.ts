import { useState, useEffect, useMemo } from "react";
import { useSystemSettings } from "../lib/queries/settings.query";

export function useShiftStatus() {
    const { data: settings } = useSystemSettings();
    const [now, setNow] = useState(new Date());

    useEffect(() => {
        const interval = setInterval(() => {
            setNow(new Date());
        }, 60000);
        return () => clearInterval(interval);
    }, []);

    const isDayShift = useMemo(() => {
        if (!settings?.day_shift_start_time || !settings?.day_shift_end_time) return true;

        const currentHours = now.getHours();
        const currentMinutes = now.getMinutes();
        const currentTime = currentHours + currentMinutes / 60;

        const [dayStartH, dayStartM] = settings.day_shift_start_time.split(":").map(Number);
        const [dayEndH, dayEndM] = settings.day_shift_end_time.split(":").map(Number);

        const dayStart = dayStartH + (dayStartM || 0) / 60;
        const dayEnd = dayEndH + (dayEndM || 0) / 60;

        if (dayStart < dayEnd) {
            return currentTime >= dayStart && currentTime < dayEnd;
        } else {
            return currentTime >= dayStart || currentTime < dayEnd;
        }
    }, [settings, now]);

    return {
        isDayShift,
        now,
    };
}
