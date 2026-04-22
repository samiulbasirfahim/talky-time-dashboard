import React from "react";
import { isAxiosError } from "axios";
import { X } from "lucide-react";
import { AppInputField } from "../../components/form-field";
import { FormModalShell } from "../../components/form-modal-shell";
import {
    SearchableDropdown,
    type SearchableDropdownOption,
} from "../../components/searchable-dropdown";
import { AppText } from "../../components/text";
import { useDebounce } from "../../lib/hooks/debounce";
import { useSearchOperators, useSearchProfiles } from "../../lib/queries";
import type {
    OperatorResponse,
    ProfileResponse,
    ProfileReassignmentValidationErrors,
} from "../../type";

export interface ProfileReassignmentFormValues {
    profileIds: number[];
    operatorId: string;
    operatorName: string;
}

interface ProfileReassignmentModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (values: ProfileReassignmentFormValues) => void | Promise<void>;
}

type ReassignmentFieldErrors = {
    profileIds?: string;
    operatorId?: string;
    general?: string;
};

type SelectedProfileItem = {
    id: string;
    label: string;
    groupId: number | null;
    groupName: string;
};

const getFirstErrorMessage = (value: unknown): string | undefined => {
    if (Array.isArray(value)) {
        const firstValue = value.find((item): item is string => typeof item === "string" && item.trim().length > 0);
        return firstValue?.trim();
    }

    if (typeof value === "string") {
        const trimmed = value.trim();
        const pythonListLike = trimmed.match(/^\[\s*['\"](.+?)['\"]\s*\]$/);

        return pythonListLike?.[1] ?? (trimmed.length > 0 ? trimmed : undefined);
    }

    return undefined;
};

const getReassignmentErrorMessage = (error: unknown): string => {
    if (!isAxiosError<ProfileReassignmentValidationErrors>(error)) {
        return "Failed to reassign profiles. Please try again.";
    }

    const responseData = error.response?.data;
    const message =
        getFirstErrorMessage(responseData?.detail) ??
        getFirstErrorMessage(responseData?.non_field_errors) ??
        getFirstErrorMessage(responseData?.profile_id) ??
        getFirstErrorMessage(responseData?.new_operator_id);

    return message ?? "Failed to reassign profiles. Please try again.";
};

export function ProfileReassignmentModal({
    open,
    onClose,
    onSubmit,
}: ProfileReassignmentModalProps) {
    const [selectedProfiles, setSelectedProfiles] = React.useState<SelectedProfileItem[]>([]);
    const [selectedOperatorId, setSelectedOperatorId] = React.useState("");
    const [selectedOperatorName, setSelectedOperatorName] = React.useState("");
    const [operatorSearch, setOperatorSearch] = React.useState("");
    const [profileSearch, setProfileSearch] = React.useState("");
    const [profileDropdownKey, setProfileDropdownKey] = React.useState(0);
    const [fieldErrors, setFieldErrors] = React.useState<ReassignmentFieldErrors>({});
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    const debouncedOperatorSearch = useDebounce(operatorSearch, 500);
    const debouncedProfileSearch = useDebounce(profileSearch, 500);

    const selectedProfileGroupId = selectedProfiles[0]?.groupId ?? null;
    const selectedProfileGroupName = selectedProfiles[0]?.groupName ?? "";

    const operatorSearchQuery = selectedProfiles.length > 0 ? debouncedOperatorSearch : "";

    const {
        data: operatorsData,
        isPending: isOperatorsPending,
        isError: isOperatorsError,
    } = useSearchOperators(
        operatorSearchQuery,
        false,
        selectedProfileGroupId ?? undefined,
    );

    const shouldFetchProfiles = open;
    const {
        data: profilesData,
        isPending: isProfilesPending,
        isError: isProfilesError,
    } = useSearchProfiles({
        query: debouncedProfileSearch,
        groupId: selectedProfileGroupId ?? undefined,
        withoutOperatorOnSearch: true,
        enabled: shouldFetchProfiles,
        withoutGroupOnSearch: false,
    });

    React.useEffect(() => {
        if (!open) {
            return;
        }

        setSelectedProfiles([]);
        setSelectedOperatorId("");
        setSelectedOperatorName("");
        setOperatorSearch("");
        setProfileSearch("");
        setProfileDropdownKey(0);
        setFieldErrors({});
        setIsSubmitting(false);
    }, [open]);

    const operatorOptions = React.useMemo<SearchableDropdownOption[]>(() => {
        return (operatorsData?.results ?? []).map((operator: OperatorResponse) => ({
            value: String(operator.id),
            label: operator.full_name || operator.operator_name || `Operator #${operator.id}`,
            subtitle: `ID: ${operator.operator_id}`,
            keywords: [
                operator.operator_id,
                operator.operator_name,
                operator.full_name,
                operator.group_name,
                operator.shift_display,
            ],
        }));
    }, [operatorsData]);

    const selectedProfilesSet = React.useMemo(
        () => new Set(selectedProfiles.map((profile) => profile.id)),
        [selectedProfiles],
    );

    const profileOptions = React.useMemo<(SearchableDropdownOption & {
        groupId: number | null;
        groupName: string;
    })[]>(() => {
        return (profilesData?.results ?? []).map((profile: ProfileResponse) => {
            const groupId = profile.group ?? profile.group_id ?? profile.current_operator?.group_id ?? null;
            const groupName = profile.group_name ?? profile.current_operator?.group_name ?? "";

            return {
                value: String(profile.id),
                label: profile.profile_name || profile.name,
                subtitle: `ID: ${profile.profile_id}${groupName ? ` | ${groupName}` : ""}`,
                keywords: [
                    profile.profile_name,
                    profile.name,
                    String(profile.profile_id),
                    profile.operator,
                    groupName,
                ],
                groupId,
                groupName,
            };
        });
    }, [profilesData]);

    const availableProfileOptions = React.useMemo(() => {
        const filtered = profileOptions.filter((option) => !selectedProfilesSet.has(option.value));

        const selectedGroupId = selectedProfiles[0]?.groupId ?? null;
        if (selectedGroupId === null) {
            return filtered;
        }

        return filtered.filter((option) => option.groupId === selectedGroupId);
    }, [profileOptions, selectedProfiles, selectedProfilesSet]);

    const handleAddProfile = (profileId: string) => {
        if (!profileId) {
            return;
        }

        const selectedProfile =
            availableProfileOptions.find((option) => option.value === profileId) ??
            profileOptions.find((option) => option.value === profileId);

        if (!selectedProfile) {
            return;
        }

        setSelectedProfiles((prev) => {
            if (prev.some((item) => item.id === profileId)) {
                return prev;
            }

            if (prev.length > 0 && prev[0].groupId !== selectedProfile.groupId) {
                setFieldErrors((next) => ({
                    ...next,
                    profileIds: "Please select profiles from the same group.",
                }));
                return prev;
            }

            if (selectedProfiles.length > 0 && selectedProfileGroupId !== null && selectedProfile.groupId !== selectedProfileGroupId) {
                setFieldErrors((next) => ({
                    ...next,
                    profileIds: "Please select profiles from the same group.",
                }));
                return prev;
            }

            return [
                ...prev,
                {
                    id: profileId,
                    label: selectedProfile.label,
                    groupId: selectedProfile.groupId,
                    groupName: selectedProfile.groupName,
                },
            ];
        });

        setFieldErrors((prev) => ({ ...prev, profileIds: undefined, general: undefined }));
        setProfileDropdownKey((prev) => prev + 1);
        setProfileSearch("");
    };

    const handleRemoveProfile = (profileId: string) => {
        setSelectedProfiles((prev) => prev.filter((item) => item.id !== profileId));
        setSelectedOperatorId("");
        setSelectedOperatorName("");
        setProfileSearch("");
        setFieldErrors((prev) => ({ ...prev, operatorId: undefined, general: undefined }));
    };

    const handleOperatorChange = (operatorId: string) => {
        setSelectedOperatorId(operatorId);
        setFieldErrors((prev) => ({ ...prev, operatorId: undefined, general: undefined }));

        const selected = operatorOptions.find((option) => option.value === operatorId);
        setSelectedOperatorName(selected?.label ?? "");
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const nextErrors: ReassignmentFieldErrors = {};

        if (selectedProfiles.length === 0) {
            nextErrors.profileIds = "Please select at least one profile.";
        }

        if (!selectedOperatorId) {
            nextErrors.operatorId = "Please select an operator.";
        }

        if (Object.keys(nextErrors).length > 0) {
            setFieldErrors(nextErrors);
            return;
        }

        try {
            setIsSubmitting(true);
            setFieldErrors((prev) => ({ ...prev, general: undefined }));
            await onSubmit({
                profileIds: selectedProfiles.map((profile) => Number(profile.id)),
                operatorId: selectedOperatorId,
                operatorName: selectedOperatorName,
            });
            onClose();
        } catch (error) {
            setFieldErrors((prev) => ({
                ...prev,
                general: getReassignmentErrorMessage(error),
            }));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <FormModalShell
            open={open}
            onClose={onClose}
            onSubmit={handleSubmit}
            title="Emergency Reassignment"
            description="Profiles 'Sofia_VIP', 'Luna_Premium', 'Aria_Elite' are currently offline due to operator sickness."
            submitLabel={isSubmitting ? "Confirming..." : "Confirm Reassign"}
            ariaLabel="Emergency reassignment"
            contentClassName="max-w-4xl rounded-[22px] p-0"
            submitButtonDisabled={isSubmitting}
            submitButtonLoading={isSubmitting}
        >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <SearchableDropdown
                    key={profileDropdownKey}
                    label="Profile name"
                    value=""
                    options={availableProfileOptions}
                    onChange={handleAddProfile}
                    onSearchChange={setProfileSearch}
                    placeholder={
                        isProfilesPending ? "Searching profiles..." : "Search unassigned profile name/id"
                    }
                    emptyText={
                        isProfilesError
                            ? "Failed to load profiles."
                            : isProfilesPending
                                ? "Searching..."
                                : "No unassigned profiles found."
                    }
                    description={fieldErrors.profileIds}
                    descriptionClassName="text-red"
                />

                {selectedProfiles.length > 0 ? (
                    <SearchableDropdown
                        label="Assign To"
                        value={selectedOperatorId}
                        options={operatorOptions}
                        onChange={handleOperatorChange}
                        onSearchChange={setOperatorSearch}
                        placeholder={
                            isOperatorsPending ? "Searching operators..." : "Search operator id/name"
                        }
                        emptyText={
                            isOperatorsError
                                ? "Failed to load operators."
                                : isOperatorsPending
                                    ? "Searching..."
                                    : "No operators found in this group."
                        }
                        description={fieldErrors.operatorId}
                        descriptionClassName="text-red"
                    />
                ) : (
                    <AppInputField
                        label="Assign To"
                        value=""
                        placeholder="Select a profile first"
                        disabled
                        readOnly
                        description={fieldErrors.operatorId}
                        descriptionClassName="text-red"
                    />
                )}

                {selectedProfiles.length > 0 && (
                    <div className="flex max-h-24 flex-wrap gap-2 overflow-y-auto rounded-lg border border-border bg-bg-secondary p-2">
                        {selectedProfiles.map((profile) => (
                            <span
                                key={profile.id}
                                className="inline-flex items-center gap-1 rounded-md border border-border bg-bg px-2 py-1 text-sm text-text-secondary"
                            >
                                {profile.label}
                                <button
                                    type="button"
                                    onClick={() => handleRemoveProfile(profile.id)}
                                    className="inline-flex h-4 w-4 items-center justify-center rounded text-text-muted hover:bg-bg-secondary"
                                    aria-label={`Remove profile ${profile.id}`}
                                >
                                    <X size={12} />
                                </button>
                            </span>
                        ))}
                    </div>
                )}
            </div>

            {selectedProfileGroupId !== null && (
                <div className="rounded-2xl border border-border bg-bg-secondary px-4 py-3">
                    <AppText variant="description" className="font-medium text-text-secondary">
                        Operator group locked to {selectedProfileGroupName || `Group #${selectedProfileGroupId}`}.
                    </AppText>
                </div>
            )}

            <div className="rounded-full border border-green bg-green-light px-4 py-2 text-center">
                <AppText variant="description" className="font-medium text-green">
                    The new operator will earn everything from now forward.
                </AppText>
            </div>
        </FormModalShell>
    );
}
