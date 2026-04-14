import { ProfileLeftSection } from "./profile-left-section";
import { ProfileAssignSection } from "./profile-assign-section";

export function ProfileTableAssignProfile() {
    return (
        <div className="grid grid-cols-1 gap-4 p-4 xl:grid-cols-3">
            <div className="col-span-2 space-y-4 p-4">
                <ProfileLeftSection />
            </div>
            <div className="col-span-1 p-4">
                <ProfileAssignSection />
            </div>
        </div>
    );      
}
