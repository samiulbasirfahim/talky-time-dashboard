import { CalendarDays, Sun } from "lucide-react";
import { AppText } from "../../components/text";

export function ScoreCutoffWindowStatus() {
    return (
        <div className="p-4">
            <div className="flex flex-row items-center justify-start gap-3">
                <div className="relative overflow-hidden rounded-lg bg-[#E8EEF4] px-4 py-3">
                    <div className="absolute left-0 top-0 h-full w-1.5 bg-text-focus" />

                    <div className="flex items-center gap-2.5">
                        <CalendarDays size={22} className="text-text-secondary" />
                        <AppText
                            variant="description"
                            className="font-bold uppercase tracking-[0.14em] text-text-secondary"
                        >
                            Current Window
                        </AppText>
                    </div>

                    <AppText
                        variant="smallHeader"
                        className="mt-2 font-semibold leading-tight text-text"
                    >
                        March 28, 2026 - 2:00 PM
                    </AppText>
                </div>

                <div className="rounded-lg bg-[#DDE0FA] px-4 py-3 xl:col-span-2">
                    <div className="flex items-center gap-2.5">
                        <Sun size={22} className="text-text-focus" />
                        <AppText
                            variant="description"
                            className="font-bold text-text-focus"
                        >
                            Shift Status
                        </AppText>
                    </div>

                    <AppText
                        variant="smallHeader"
                        className="mt-1.5 font-semibold leading-tight text-text-focus"
                    >
                        Day Shift
                    </AppText>
                </div>
            </div>
        </div>
    );
}
