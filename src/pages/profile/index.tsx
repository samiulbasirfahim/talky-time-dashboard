import { UserPlus } from "lucide-react";
import { HeaderSection } from "../../components/header-section";
import { useAppModal } from "../../hooks/useAppModal";
import { ProfileCards } from "./profile-cards";
import { ProfileTableAssignProfile } from "./profile-table-assign-profile";

export function Profile() {
    const createProfileModal = useAppModal();

    return (
        <>
            <HeaderSection
                title="Profile"
                description={`10 total · 9 active · 4 with 25% rule`}
                buttons={[
                    {
                        label: "Create Profile",
                        icon: UserPlus,
                        onClick: createProfileModal.openModal,
                    },
                ]}
            />
            <ProfileCards />
            <ProfileTableAssignProfile
                isCreateProfileModalOpen={createProfileModal.isOpen}
                onCloseCreateProfileModal={createProfileModal.closeModal}
            />
        </>
    );
}
