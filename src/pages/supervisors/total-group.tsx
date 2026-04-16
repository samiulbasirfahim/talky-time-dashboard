import React from "react";
import { Users } from "lucide-react";
import { AppButton } from "../../components/button";
import { DeleteConfirmModal } from "../../components/delete-confirm-modal";
import { HorizontalStatCardV2 } from "../../components/horizontal-stat-card-v2";
import { AppText } from "../../components/text";

interface GroupItem {
    id: string;
    title: string;
    operators: number;
    supervisors: number;
    value: string;
    lightColor: boolean;
}

const INITIAL_GROUPS: GroupItem[] = [
    {
        id: "group-medellin",
        title: "Medellin Hub",
        operators: 18,
        supervisors: 2,
        value: "$112,400",
        lightColor: false,
    },
    {
        id: "group-bogota",
        title: "Bogota Hub",
        operators: 24,
        supervisors: 3,
        value: "$126,900",
        lightColor: false,
    },
    {
        id: "group-cali",
        title: "Cali Hub",
        operators: 14,
        supervisors: 1,
        value: "$84,100",
        lightColor: true,
    },
];

export function TotalGroup() {
    const [groups, setGroups] = React.useState<GroupItem[]>(INITIAL_GROUPS);
    const [groupIdToDelete, setGroupIdToDelete] = React.useState<string | null>(null);

    const groupToDelete = groups.find((group) => group.id === groupIdToDelete);

    const handleCloseDeleteModal = () => setGroupIdToDelete(null);

    const handleConfirmDelete = () => {
        if (!groupIdToDelete) return;

        setGroups((prev) => prev.filter((group) => group.id !== groupIdToDelete));
        setGroupIdToDelete(null);
    };

    return (
        <div className="p-4">
            <div className="shadow-border shadow-xs rounded-md w-full space-y-4 p-4">
                <div className="flex justify-between items-center">
                    <AppText variant="header">Total Group</AppText>
                    <AppButton prefixIcon={Users}>Create Group</AppButton>
                </div>

                <div className="grid grid-cols-1 gap-3 xl:grid-cols-3">
                    {groups.length === 0 ? (
                        <div className="col-span-full rounded-lg border border-border bg-bg-secondary p-4 text-center">
                            <AppText variant="description">No groups available.</AppText>
                        </div>
                    ) : (
                        groups.map((group) => (
                            <HorizontalStatCardV2
                                key={group.id}
                                title={group.title}
                                description={`${group.operators} Operator`}
                                descriptionSecs={`${group.supervisors} Supervisors`}
                                value={group.value}
                                lightColor={group.lightColor}
                                onDelete={() => setGroupIdToDelete(group.id)}
                            />
                        ))
                    )}
                </div>
            </div>

            <DeleteConfirmModal
                open={Boolean(groupIdToDelete)}
                onCancel={handleCloseDeleteModal}
                onConfirm={handleConfirmDelete}
                title={groupToDelete ? `Delete ${groupToDelete.title}?` : "Delete this group?"}
                description="This group will be removed from the list. This action cannot be undone."
                ariaLabel="Confirm delete group"
            />
        </div>
    );
}
