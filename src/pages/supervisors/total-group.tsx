import React from "react";
import { isAxiosError } from "axios";
import { Users } from "lucide-react";
import toast from "react-hot-toast";
import { AppButton } from "../../components/button";
import { DeleteConfirmModal } from "../../components/delete-confirm-modal";
import { HorizontalStatCardV2 } from "../../components/horizontal-stat-card-v2";
import { useAppModal } from "../../hooks/useAppModal";
import {
    useAllGroups,
    useCreateGroup,
    useDeleteGroup,
    useGroupDetails,
    useUpdateGroup,
} from "../../lib/queries";
import type {
    GroupCreateValidationErrors,
    GroupCreationPayload,
    GroupUpdatePayload,
} from "../../type";
import { AppText } from "../../components/text";
import {
    CreateGroupModal,
    type CreateGroupDefaultValues,
    type CreateGroupFormFieldErrors,
    type CreateGroupFormValues,
} from "./create-group-modal";

interface GroupItem {
    id: string;
    title: string;
    operators: number;
    supervisors: number;
    profiles: number;
    value: string;
    lightColor: boolean;
}

type GroupDeleteErrorResponse = {
    detail?: string | string[];
    non_field_errors?: string[];
};

function getFirstErrorMessage(value: unknown): string | undefined {
    if (Array.isArray(value) && value.length > 0 && typeof value[0] === "string") {
        return value[0];
    }
    if (typeof value === "string") {
        return value;
    }
    return undefined;
}

function formatUsd(value: number): string {
    return value.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
}

export function TotalGroup({
    isAdminView = false,
}: {
    isAdminView?: boolean;
}) {
    const { mutateAsync: createGroup } = useCreateGroup();
    const { mutateAsync: deleteGroup } = useDeleteGroup();
    const { mutateAsync: updateGroup } = useUpdateGroup();
    const {
        data: groupsData,
        isPending: isGroupsPending,
        isError: isGroupsError,
    } = useAllGroups();

    const [groupIdToDelete, setGroupIdToDelete] = React.useState<string | null>(null);
    const [isDeletingGroup, setIsDeletingGroup] = React.useState(false);

    // Edit state
    const [groupIdToEdit, setGroupIdToEdit] = React.useState<number | null>(null);
    const [editDefaultValues, setEditDefaultValues] = React.useState<CreateGroupDefaultValues | null>(null);

    const createGroupModal = useAppModal();
    const editGroupModal = useAppModal();

    // Fetch group details when an edit is triggered
    const { data: groupDetailsData, isPending: isGroupDetailsPending } = useGroupDetails(groupIdToEdit);

    const groups = React.useMemo<GroupItem[]>(() => {
        return (groupsData?.results ?? []).map((group, index) => ({
            id: String(group.id),
            title: group.name,
            operators: group.operator_count,
            supervisors: group.supervisor_count,
            profiles: group.profile_count,
            value: formatUsd(group.total_bonus),
            lightColor: index % 2 === 0,
        }));
    }, [groupsData]);

    const groupToDelete = groups.find((group) => group.id === groupIdToDelete);

    const handleCloseDeleteModal = () => setGroupIdToDelete(null);

    const handleConfirmDelete = async () => {
        if (isDeletingGroup) {
            return;
        }

        if (!groupIdToDelete) return;

        const parsedGroupId = Number(groupIdToDelete);
        if (!Number.isInteger(parsedGroupId) || parsedGroupId <= 0) {
            toast.error("Invalid group ID.");
            setGroupIdToDelete(null);
            return;
        }

        try {
            setIsDeletingGroup(true);
            await deleteGroup(parsedGroupId);
            toast.success("Group deleted successfully.");
        } catch (error) {
            if (isAxiosError<GroupDeleteErrorResponse>(error)) {
                const apiErrors = error.response?.data;
                const apiMessage =
                    getFirstErrorMessage(apiErrors?.detail) ??
                    getFirstErrorMessage(apiErrors?.non_field_errors);

                if (apiMessage) {
                    toast.error(apiMessage);
                    return;
                }
            }

            toast.error("Failed to delete group. Please try again.");
        } finally {
            setIsDeletingGroup(false);
            setGroupIdToDelete(null);
        }
    };

    // When group details load after clicking Edit, open the modal
    React.useEffect(() => {
        if (!groupIdToEdit || isGroupDetailsPending || !groupDetailsData) {
            return;
        }

        const supervisors = groupDetailsData.supervisors ?? [];
        const operators = groupDetailsData.operators ?? [];
        const profiles = groupDetailsData.profiles ?? [];

        const defaults: CreateGroupDefaultValues = {
            groupName: groupDetailsData.name,
            supervisorIds: supervisors.map((s) => String(s.id)),
            operatorIds: operators.map((o) => String(o.id)),
            profileIds: profiles.map((p) => String(p.id)),
            supervisorLabels: Object.fromEntries(
                supervisors.map((s) => [
                    String(s.id),
                    s.supervisor_name || s.name || s.supervisor_id,
                ]),
            ),
            operatorLabels: Object.fromEntries(
                operators.map((o) => [
                    String(o.id),
                    o.full_name || o.operator_name || o.operator_id,
                ]),
            ),
            profileLabels: Object.fromEntries(
                profiles.map((p) => [
                    String(p.id),
                    p.profile_name || String(p.profile_id),
                ]),
            ),
        };

        setEditDefaultValues(defaults);
        editGroupModal.openModal();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [groupDetailsData, isGroupDetailsPending, groupIdToEdit]);

    const handleEditClick = (groupId: string) => {
        const numericId = Number(groupId);
        if (!Number.isInteger(numericId) || numericId <= 0) return;

        // Reset previous state so we trigger fresh fetch
        setEditDefaultValues(null);
        setGroupIdToEdit(numericId);
    };

    const handleCloseEditModal = () => {
        editGroupModal.closeModal();
        setGroupIdToEdit(null);
        setEditDefaultValues(null);
    };

    const handleCreateGroup = async (
        values: CreateGroupFormValues,
    ): Promise<CreateGroupFormFieldErrors | null> => {
        const trimmedName = values.groupName.trim();
        if (!trimmedName) {
            return {
                groupName: "Group name is required.",
            };
        }

        const payload: GroupCreationPayload = {
            name: trimmedName,
        };

        const normalizedSupervisorIdsRaw = values.supervisorIds.map((id) => Number(id));
        const hasInvalidSupervisorId = normalizedSupervisorIdsRaw.some(
            (id) => !Number.isInteger(id) || id <= 0,
        );
        if (hasInvalidSupervisorId) {
            return {
                supervisorIds: "Supervisors must contain valid primary key IDs.",
            };
        }

        const normalizedOperatorIdsRaw = values.operatorIds.map((id) => Number(id));
        const hasInvalidOperatorId = normalizedOperatorIdsRaw.some(
            (id) => !Number.isInteger(id) || id <= 0,
        );
        if (hasInvalidOperatorId) {
            return {
                operatorIds: "Operators must contain valid primary key IDs.",
            };
        }

        const normalizedProfileIdsRaw = values.profileIds.map((id) => Number(id));
        const hasInvalidProfileId = normalizedProfileIdsRaw.some(
            (id) => !Number.isInteger(id) || id <= 0,
        );
        if (hasInvalidProfileId) {
            return {
                profileIds: "Profiles must contain valid primary key IDs.",
            };
        }

        const normalizedSupervisorIds = [...new Set(normalizedSupervisorIdsRaw)];
        const normalizedOperatorIds = [...new Set(normalizedOperatorIdsRaw)];
        const normalizedProfileIds = [...new Set(normalizedProfileIdsRaw)];

        if (normalizedSupervisorIds.length > 0) {
            payload.supervisors = normalizedSupervisorIds;
        }
        if (normalizedOperatorIds.length > 0) {
            payload.operators = normalizedOperatorIds;
        }
        if (normalizedProfileIds.length > 0) {
            payload.profiles = normalizedProfileIds;
        }

        try {
            await createGroup(payload);
            toast.success("Group created successfully.");
            return null;
        } catch (error) {
            if (isAxiosError<GroupCreateValidationErrors>(error)) {
                const apiErrors = error.response?.data;
                const mappedErrors: CreateGroupFormFieldErrors = {};

                if (apiErrors && typeof apiErrors === "object") {
                    mappedErrors.groupName =
                        getFirstErrorMessage(apiErrors.name) ??
                        getFirstErrorMessage(apiErrors.non_field_errors);
                    mappedErrors.supervisorIds = getFirstErrorMessage(apiErrors.supervisors);
                    mappedErrors.operatorIds = getFirstErrorMessage(apiErrors.operators);
                }

                if (Object.keys(mappedErrors).length > 0) {
                    return mappedErrors;
                }
            }

            toast.error("Failed to create group. Please try again.");
            return {
                groupName: "Failed to create group. Please try again.",
            };
        }
    };

    const handleUpdateGroup = async (
        values: CreateGroupFormValues,
    ): Promise<CreateGroupFormFieldErrors | null> => {
        if (!groupIdToEdit) return null;

        const trimmedName = values.groupName.trim();
        if (!trimmedName) {
            return { groupName: "Group name is required." };
        }

        const payload: GroupUpdatePayload = {
            name: trimmedName,
            supervisors: [...new Set(values.supervisorIds.map(Number))],
            operators: [...new Set(values.operatorIds.map(Number))],
            profiles: [...new Set(values.profileIds.map(Number))],
        };

        try {
            await updateGroup({ id: groupIdToEdit, payload });
            toast.success("Group updated successfully.");
            return null;
        } catch (error) {
            if (isAxiosError<GroupCreateValidationErrors>(error)) {
                const apiErrors = error.response?.data;
                const mappedErrors: CreateGroupFormFieldErrors = {};

                if (apiErrors && typeof apiErrors === "object") {
                    mappedErrors.groupName =
                        getFirstErrorMessage(apiErrors.name) ??
                        getFirstErrorMessage(apiErrors.non_field_errors);
                    mappedErrors.supervisorIds = getFirstErrorMessage(apiErrors.supervisors);
                    mappedErrors.operatorIds = getFirstErrorMessage(apiErrors.operators);
                }

                if (Object.keys(mappedErrors).length > 0) {
                    return mappedErrors;
                }
            }

            toast.error("Failed to update group. Please try again.");
            return { groupName: "Failed to update group. Please try again." };
        }
    };

    return (
        <div id="total-groups" className="p-4">
            <div className="shadow-border border-border border shadow-xs rounded-md w-full space-y-4 p-4">
                <div className="flex justify-between items-center">
                    <AppText variant="header">Total Group</AppText>
                    {
                        isAdminView && (
                            <AppButton prefixIcon={Users} onClick={createGroupModal.openModal}>
                                Create Group
                            </AppButton>)
                    }
                </div>

                <div className="grid grid-cols-1 gap-3 xl:grid-cols-3">
                    {isGroupsPending ? (
                        <div className="col-span-full rounded-lg border border-border bg-bg-secondary p-4 text-center">
                            <AppText variant="description">Loading groups...</AppText>
                        </div>
                    ) : isGroupsError ? (
                        <div className="col-span-full rounded-lg border border-border bg-bg-secondary p-4 text-center">
                            <AppText variant="description">Failed to load groups.</AppText>
                        </div>
                    ) : groups.length === 0 ? (
                        <div className="col-span-full rounded-lg border border-border bg-bg-secondary p-4 text-center">
                            <AppText variant="description">No groups available.</AppText>
                        </div>
                    ) : (
                        groups.map((group) => (
                            <HorizontalStatCardV2
                                key={group.id}
                                title={group.title}
                                description={`${group.operators} Operators • ${group.profiles} Profiles`}
                                descriptionSecs={`${group.supervisors} Supervisors`}
                                value={group.value}
                                lightColor={group.lightColor}
                                loadingEditBtn={isGroupDetailsPending && group.id === String(groupIdToEdit)}
                                onEdit={() => handleEditClick(group.id)}
                                onDelete={
                                    !isAdminView ? undefined
                                        : () => setGroupIdToDelete(group.id)
                                }
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
                description="This action cannot be undone."
                ariaLabel="Confirm delete group"
                isConfirming={isDeletingGroup}
                confirmLoadingText="Deleting..."
            />

            <CreateGroupModal
                open={createGroupModal.isOpen}
                onClose={createGroupModal.closeModal}
                onSubmit={handleCreateGroup}
            />

            <CreateGroupModal
                open={editGroupModal.isOpen}
                onClose={handleCloseEditModal}
                defaultValues={editDefaultValues}
                onSubmit={handleUpdateGroup}
            />
        </div>
    );
}
