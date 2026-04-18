import React from "react";
import { isAxiosError } from "axios";
import { Users } from "lucide-react";
import toast from "react-hot-toast";
import { AppButton } from "../../components/button";
import { DeleteConfirmModal } from "../../components/delete-confirm-modal";
import { HorizontalStatCardV2 } from "../../components/horizontal-stat-card-v2";
import { useAppModal } from "../../hooks/useAppModal";
import { useAllGroups, useCreateGroup, useDeleteGroup } from "../../lib/queries";
import type {
    GroupCreateValidationErrors,
    GroupCreationPayload,
} from "../../type";
import { AppText } from "../../components/text";
import {
    CreateGroupModal,
    type CreateGroupFormFieldErrors,
    type CreateGroupFormValues,
} from "./create-group-modal";

interface GroupItem {
    id: string;
    title: string;
    operators: number;
    supervisors: number;
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

export function TotalGroup() {
    const { mutateAsync: createGroup } = useCreateGroup();
    const { mutateAsync: deleteGroup } = useDeleteGroup();
    const {
        data: groupsData,
        isPending: isGroupsPending,
        isError: isGroupsError,
    } = useAllGroups();

    const [groupIdToDelete, setGroupIdToDelete] = React.useState<string | null>(null);
    const [isDeletingGroup, setIsDeletingGroup] = React.useState(false);
    const createGroupModal = useAppModal();

    const groups = React.useMemo<GroupItem[]>(() => {
        return (groupsData?.results ?? []).map((group, index) => ({
            id: String(group.id),
            title: group.name,
            operators: group.operator_count,
            supervisors: group.supervisor_count,
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

        const normalizedSupervisorIds = [...new Set(normalizedSupervisorIdsRaw)];
        const normalizedOperatorIds = [...new Set(normalizedOperatorIdsRaw)];

        if (normalizedSupervisorIds.length > 0) {
            payload.supervisors = normalizedSupervisorIds;
        }
        if (normalizedOperatorIds.length > 0) {
            payload.operators = normalizedOperatorIds;
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

    return (
        <div id="total-groups" className="p-4">
            <div className="shadow-border border-border border shadow-xs rounded-md w-full space-y-4 p-4">
                <div className="flex justify-between items-center">
                    <AppText variant="header">Total Group</AppText>
                    <AppButton prefixIcon={Users} onClick={createGroupModal.openModal}>
                        Create Group
                    </AppButton>
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
        </div>
    );
}
