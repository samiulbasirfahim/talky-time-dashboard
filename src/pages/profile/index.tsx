import { UserPlus } from "lucide-react";
import { HeaderSection } from "../../components/header-section";
import { useAppModal } from "../../hooks/useAppModal";
import { ProfileCards } from "./profile-cards";
import { ProfileTableAssignProfile } from "./profile-table-assign-profile";
import { useMe } from "../../lib/queries";

export function Profile() {
    const createProfileModal = useAppModal();
    const {data: me} = useMe()

    return (
        <>
            <HeaderSection
                title="Profile"
                description={``}
                buttons={me?.data.role === "SUPERVISOR" ? [] : [
                    {
                        label: "Create Profile",
                        icon: UserPlus,
                        onClick: createProfileModal.openModal,
                    },
                ]}
            />
            <ProfileCards />
            <ProfileTableAssignProfile
                // isAdminView={true}
                isCreateProfileModalOpen={createProfileModal.isOpen}
                onCloseCreateProfileModal={createProfileModal.closeModal}
            />
        </>
    );
}
