import { UserPlus } from "lucide-react";
import { HeaderSection } from "../../components/header-section";
import { ProfileCards } from "./profile-cards";
import { ProfileTableAssignProfile } from "./profile-table-assign-profile";

export function Profile() {
    return (
        <>
            <HeaderSection
                title="Profile"
                description={`10 total · 9 active · 4 with 25% rule`}
                buttons={[
                    {
                        label: "Create Profile",
                        icon: UserPlus,
                        onClick: () => {
                            console.log("Pressed Assign Profile!");
                        },
                    },
                ]}
            />
            <ProfileCards />
            <ProfileTableAssignProfile />
        </>
    );
}
