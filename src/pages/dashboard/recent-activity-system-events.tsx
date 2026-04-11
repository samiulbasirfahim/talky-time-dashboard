import { RecentOperatorActivity } from "./recent-operator-activity";
import { SystemEvents } from "./system-events";

export function RecentActivity_SystemEvents() {
    return (
        <div className="grid grid-cols-3 p-4 gap-4">
            <div className="col-span-2">
                <RecentOperatorActivity />
            </div>
            <div className="col-span-1">
                <SystemEvents />
            </div>
        </div>
    );
}
