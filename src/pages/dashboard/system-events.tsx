import { AppText } from "../../components/text";
import { SystemEvent } from "./system-event-card";

export function SystemEvents() {
    return (
        <div className="p-4 w-full rounded-md shadow-border shadow-xs">
            <AppText variant="header" className="mb-4">
                System Events
            </AppText>

            <SystemEvent
                title="CSV Uploaded"
                description="Dashboard A"
                ago="2m ago"
                type="csv_upload"
            />

            <SystemEvent
                title="Profile Assigned"
                description="Dashboard B"
                ago="10m ago"
                type="profile_assign"
            />

            <SystemEvent
                title="CSV Uploaded"
                description="Dashboard C"
                ago="30m ago"
                type="csv_upload"
            />

            <SystemEvent
                title="Profile Assigned"
                description="Dashboard D"
                ago="1h ago"
                type="profile_assign"
            />

            <SystemEvent
                title="CSV Uploaded"
                description="Dashboard E"
                ago="2h ago"
                type="csv_upload"
            />

            <SystemEvent
                title="Profile Assigned"
                description="Dashboard F"
                ago="5h ago"
                type="profile_assign"
                isLast={true}
            />
        </div>
    );
}
