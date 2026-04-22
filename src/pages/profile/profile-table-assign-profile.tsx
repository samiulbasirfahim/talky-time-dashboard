import { ProfileLeftSection } from "./profile-left-section";
import { ProfileAssignSection } from "./profile-assign-section";

interface ProfileTableAssignProfileProps {
    isCreateProfileModalOpen: boolean;
    onCloseCreateProfileModal: () => void;
}

export function ProfileTableAssignProfile({
    isCreateProfileModalOpen,
    onCloseCreateProfileModal,
}: ProfileTableAssignProfileProps) {
    return (
        <div className="grid grid-cols-1 gap-4 p-4 xl:grid-cols-3">
            <div className="col-span-2 space-y-4 p-4">
                {/* {JSON.stringify({isAdminView})} */}
                <ProfileLeftSection
                    // isAdminView={isAdminView}
                    isCreateProfileModalOpen={isCreateProfileModalOpen}
                    onCloseCreateProfileModal={onCloseCreateProfileModal}
                />
            </div>
            <div className="col-span-1 p-4">
                <ProfileAssignSection />
            </div>
        </div>
    );      
}
