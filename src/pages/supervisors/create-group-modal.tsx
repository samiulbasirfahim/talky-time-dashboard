import React from "react";
import { Info, X } from "lucide-react";
import { AppInputField } from "../../components/form-field";
import { FormModalShell } from "../../components/form-modal-shell";
import {
    SearchableDropdown,
    type SearchableDropdownOption,
} from "../../components/searchable-dropdown";
import { useDebounce } from "../../lib/hooks/debounce";
import {
    useSearchOperators,
    useSearchSupervisors,
    useSearchProfilesForGroup,
} from "../../lib/queries";
import { AppText } from "../../components/text";

export interface CreateGroupFormValues {
    groupName: string;
    supervisorIds: string[];
    operatorIds: string[];
    profileIds: string[];
}

export type CreateGroupFormFieldErrors = Partial<
    Record<"groupName" | "supervisorIds" | "operatorIds" | "profileIds", string>
>;

/** Pre-seeded label maps so chips render correctly when editing */
export interface CreateGroupDefaultValues {
    groupName: string;
    supervisorIds: string[];
    operatorIds: string[];
    profileIds: string[];
    /** Display labels keyed by id, used to show chips before search results load */
    supervisorLabels?: Record<string, string>;
    operatorLabels?: Record<string, string>;
    profileLabels?: Record<string, string>;
}

interface CreateGroupModalProps {
    open: boolean;
    onClose: () => void;
    defaultValues?: CreateGroupDefaultValues | null;
    onSubmit?: (
        values: CreateGroupFormValues,
    ) => Promise<CreateGroupFormFieldErrors | null> | CreateGroupFormFieldErrors | null;
}

const EMPTY_FORM: CreateGroupFormValues = {
    groupName: "",
    supervisorIds: [],
    operatorIds: [],
    profileIds: [],
};

export function CreateGroupModal({ open, onClose, onSubmit, defaultValues }: CreateGroupModalProps) {
    const isEditMode = Boolean(defaultValues);

    const [formValues, setFormValues] = React.useState<CreateGroupFormValues>(EMPTY_FORM);
    const [fieldErrors, setFieldErrors] = React.useState<CreateGroupFormFieldErrors>({});
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    const [supervisorSearch, setSupervisorSearch] = React.useState("");
    const debouncedSupervisorSearch = useDebounce(supervisorSearch, 500);
    const [operatorSearch, setOperatorSearch] = React.useState("");
    const debouncedOperatorSearch = useDebounce(operatorSearch, 500);
    const [profileSearch, setProfileSearch] = React.useState("");
    const debouncedProfileSearch = useDebounce(profileSearch, 500);

    const [supervisorSearchKey, setSupervisorSearchKey] = React.useState(0);
    const [operatorSearchKey, setOperatorSearchKey] = React.useState(0);
    const [profileSearchKey, setProfileSearchKey] = React.useState(0);

    // Seed labels from defaultValues so chips render immediately when modal opens
    const [supervisorLabelOverrides, setSupervisorLabelOverrides] = React.useState<Record<string, string>>({});
    const [operatorLabelOverrides, setOperatorLabelOverrides] = React.useState<Record<string, string>>({});
    const [profileLabelOverrides, setProfileLabelOverrides] = React.useState<Record<string, string>>({});

    const {
        data: supervisorsData,
        isPending: isSupervisorsPending,
    } = useSearchSupervisors(debouncedSupervisorSearch, true);
    const {
        data: operatorsData,
        isPending: isOperatorsPending,
    } = useSearchOperators(debouncedOperatorSearch, true);
    const {
        data: profilesData,
        isPending: isProfilesPending,
    } = useSearchProfilesForGroup({
        query: debouncedProfileSearch,
        withoutGroup: true,
    });

    const allSupervisorResults = supervisorsData?.results ?? [];
    const allOperatorResults = operatorsData?.results ?? [];
    const allProfileResults = profilesData?.results ?? [];

    const supervisorOptions = React.useMemo<SearchableDropdownOption[]>(() => {
        const selectedSet = new Set(formValues.supervisorIds);

        return allSupervisorResults
            .filter((supervisor) => !selectedSet.has(String(supervisor.id)))
            .map((supervisor) => ({
                value: String(supervisor.id),
                label: supervisor.supervisor_name || supervisor.name || `Supervisor #${supervisor.id}`,
                subtitle: `ID: ${supervisor.supervisor_id}`,
                keywords: [supervisor.email, supervisor.first_name, supervisor.last_name],
            }));
    }, [allSupervisorResults, formValues.supervisorIds]);

    const operatorOptions = React.useMemo<SearchableDropdownOption[]>(() => {
        const selectedSet = new Set(formValues.operatorIds);

        return allOperatorResults
            .filter((operator) => !selectedSet.has(String(operator.id)))
            .map((operator) => ({
                value: String(operator.id),
                label: operator.full_name || operator.operator_name || `Operator #${operator.id}`,
                subtitle: `ID: ${operator.operator_id}`,
                keywords: [operator.group_name, operator.shift_display],
            }));
    }, [allOperatorResults, formValues.operatorIds]);

    const profileOptions = React.useMemo<SearchableDropdownOption[]>(() => {
        const selectedSet = new Set(formValues.profileIds);

        return allProfileResults
            .filter((profile) => !selectedSet.has(String(profile.id)))
            .map((profile) => ({
                value: String(profile.id),
                label: profile.profile_name || `Profile #${profile.id}`,
                subtitle: `ID: ${profile.profile_id}`,
                keywords: [profile.operator ?? ""],
            }));
    }, [allProfileResults, formValues.profileIds]);

    // Merge API results into label maps
    const supervisorLabelById = React.useMemo(() => {
        const fromResults = Object.fromEntries(
            allSupervisorResults.map((supervisor) => [
                String(supervisor.id),
                supervisor.supervisor_name || supervisor.name || supervisor.supervisor_id || `ID: ${supervisor.id}`,
            ]),
        ) as Record<string, string>;
        return { ...supervisorLabelOverrides, ...fromResults };
    }, [allSupervisorResults, supervisorLabelOverrides]);

    const operatorLabelById = React.useMemo(() => {
        const fromResults = Object.fromEntries(
            allOperatorResults.map((operator) => [
                String(operator.id),
                operator.full_name || operator.operator_name || operator.operator_id || `ID: ${operator.id}`,
            ]),
        ) as Record<string, string>;
        return { ...operatorLabelOverrides, ...fromResults };
    }, [allOperatorResults, operatorLabelOverrides]);

    const profileLabelById = React.useMemo(() => {
        const fromResults = Object.fromEntries(
            allProfileResults.map((profile) => [
                String(profile.id),
                profile.profile_name || `Profile #${profile.id}`,
            ]),
        ) as Record<string, string>;
        return { ...profileLabelOverrides, ...fromResults };
    }, [allProfileResults, profileLabelOverrides]);

    React.useEffect(() => {
        if (!open) {
            return;
        }

        if (defaultValues) {
            setFormValues({
                groupName: defaultValues.groupName,
                supervisorIds: defaultValues.supervisorIds,
                operatorIds: defaultValues.operatorIds,
                profileIds: defaultValues.profileIds,
            });
            setSupervisorLabelOverrides(defaultValues.supervisorLabels ?? {});
            setOperatorLabelOverrides(defaultValues.operatorLabels ?? {});
            setProfileLabelOverrides(defaultValues.profileLabels ?? {});
        } else {
            setFormValues(EMPTY_FORM);
            setSupervisorLabelOverrides({});
            setOperatorLabelOverrides({});
            setProfileLabelOverrides({});
        }

        setFieldErrors({});
        setIsSubmitting(false);
        setSupervisorSearch("");
        setOperatorSearch("");
        setProfileSearch("");
        setSupervisorSearchKey(0);
        setOperatorSearchKey(0);
        setProfileSearchKey(0);
    }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

    const handleAddSupervisor = (supervisorId: string) => {
        setFormValues((prev) => {
            if (prev.supervisorIds.includes(supervisorId)) {
                return prev;
            }

            return {
                ...prev,
                supervisorIds: [...prev.supervisorIds, supervisorId],
            };
        });
        setFieldErrors((prev) => ({ ...prev, supervisorIds: undefined }));
        setSupervisorSearchKey((prev) => prev + 1);
    };

    const handleAddOperator = (operatorId: string) => {
        setFormValues((prev) => {
            if (prev.operatorIds.includes(operatorId)) {
                return prev;
            }

            return {
                ...prev,
                operatorIds: [...prev.operatorIds, operatorId],
            };
        });
        setFieldErrors((prev) => ({ ...prev, operatorIds: undefined }));
        setOperatorSearchKey((prev) => prev + 1);
    };

    const handleAddProfile = (profileId: string) => {
        setFormValues((prev) => {
            if (prev.profileIds.includes(profileId)) {
                return prev;
            }

            return {
                ...prev,
                profileIds: [...prev.profileIds, profileId],
            };
        });
        setFieldErrors((prev) => ({ ...prev, profileIds: undefined }));
        setProfileSearchKey((prev) => prev + 1);
    };

    const handleRemoveSupervisor = (supervisorId: string) => {
        setFormValues((prev) => ({
            ...prev,
            supervisorIds: prev.supervisorIds.filter((id) => id !== supervisorId),
        }));
        setFieldErrors((prev) => ({ ...prev, supervisorIds: undefined }));
    };

    const handleRemoveOperator = (operatorId: string) => {
        setFormValues((prev) => ({
            ...prev,
            operatorIds: prev.operatorIds.filter((id) => id !== operatorId),
        }));
        setFieldErrors((prev) => ({ ...prev, operatorIds: undefined }));
    };

    const handleRemoveProfile = (profileId: string) => {
        setFormValues((prev) => ({
            ...prev,
            profileIds: prev.profileIds.filter((id) => id !== profileId),
        }));
        setFieldErrors((prev) => ({ ...prev, profileIds: undefined }));
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const nextErrors: CreateGroupFormFieldErrors = {};
        if (!formValues.groupName.trim()) {
            nextErrors.groupName = "Group name is required.";
        }

        if (Object.keys(nextErrors).length > 0) {
            setFieldErrors(nextErrors);
            return;
        }

        setIsSubmitting(true);
        let submitErrors: CreateGroupFormFieldErrors | null = null;
        try {
            submitErrors = (await onSubmit?.(formValues)) ?? null;
        } finally {
            setIsSubmitting(false);
        }

        if (submitErrors && Object.keys(submitErrors).length > 0) {
            setFieldErrors(submitErrors);
            return;
        }

        onClose();
    };

    const submitLabel = isSubmitting
        ? isEditMode ? "Saving..." : "Creating..."
        : isEditMode ? "Save Changes" : "Create Group";

    return (
        <FormModalShell
            open={open}
            onClose={onClose}
            onSubmit={handleSubmit}
            title={isEditMode ? "Edit Group" : "Create Group"}
            description={
                isEditMode
                    ? "Update the group details, members, and profiles."
                    : "Onboard a Supervisor into the Architect ecosystem."
            }
            submitLabel={submitLabel}
            ariaLabel={isEditMode ? "Edit group" : "Create group"}
            contentClassName="max-w-4xl rounded-[22px] p-0"
            submitButtonDisabled={isSubmitting}
            submitButtonLoading={isSubmitting}
        >
            <AppInputField
                label="Group Name"
                value={formValues.groupName}
                onChange={(value) => {
                    setFormValues((prev) => ({ ...prev, groupName: value }));
                    setFieldErrors((prev) => ({ ...prev, groupName: undefined }));
                }}
                placeholder="Enter Group name"
                description={fieldErrors.groupName}
                descriptionClassName="text-red-500"
            />

            <div className="space-y-2 w-full">
                <SearchableDropdown
                    key={supervisorSearchKey}
                    label="Add Supervisor"
                    value=""
                    options={supervisorOptions}
                    onChange={handleAddSupervisor}
                    onSearchChange={setSupervisorSearch}
                    placeholder="Enter supervisor name"
                    emptyText={isSupervisorsPending ? "Searching..." : "No supervisors found."}
                    description={fieldErrors.supervisorIds}
                    descriptionClassName="text-red-500"
                />

                {formValues.supervisorIds.length > 0 && (
                    <div className="flex flex-wrap gap-2 rounded-lg border border-border bg-bg-secondary p-2 max-h-16 overflow-y-auto">
                        {formValues.supervisorIds.map((supervisorId) => (
                            <span
                                key={supervisorId}
                                className="inline-flex items-center gap-1 rounded-md border border-border bg-bg px-2 py-1 text-sm text-text-secondary"
                            >
                                {supervisorLabelById[supervisorId] ?? `ID: ${supervisorId}`}
                                <button
                                    type="button"
                                    onClick={() => handleRemoveSupervisor(supervisorId)}
                                    className="inline-flex h-4 w-4 items-center justify-center rounded text-text-muted hover:bg-bg-secondary"
                                    aria-label={`Remove supervisor ${supervisorId}`}
                                >
                                    <X size={12} />
                                </button>
                            </span>
                        ))}
                    </div>
                )}
            </div>

            <div className="space-y-2 w-full">
                <SearchableDropdown
                    key={operatorSearchKey}
                    label="Add Operator"
                    value=""
                    options={operatorOptions}
                    onChange={handleAddOperator}
                    onSearchChange={setOperatorSearch}
                    placeholder="Enter Operator name"
                    emptyText={isOperatorsPending ? "Searching..." : "No operators found."}
                    description={fieldErrors.operatorIds}
                    descriptionClassName="text-red-500"
                />

                {formValues.operatorIds.length > 0 && (
                    <div className="flex flex-wrap gap-2 rounded-lg border border-border bg-bg-secondary p-2 max-h-16 overflow-y-auto">
                        {formValues.operatorIds.map((operatorId) => (
                            <span
                                key={operatorId}
                                className="inline-flex items-center gap-1 rounded-md border border-border bg-bg px-2 py-1 text-sm text-text-secondary"
                            >
                                {operatorLabelById[operatorId] ?? `ID: ${operatorId}`}
                                <button
                                    type="button"
                                    onClick={() => handleRemoveOperator(operatorId)}
                                    className="inline-flex h-4 w-4 items-center justify-center rounded text-text-muted hover:bg-bg-secondary"
                                    aria-label={`Remove operator ${operatorId}`}
                                >
                                    <X size={12} />
                                </button>
                            </span>
                        ))}
                    </div>
                )}
            </div>

            <div className="space-y-2 w-full">
                <SearchableDropdown
                    key={profileSearchKey}
                    label="Add Profile"
                    value=""
                    options={profileOptions}
                    onChange={handleAddProfile}
                    onSearchChange={setProfileSearch}
                    placeholder="Search profile name or ID"
                    emptyText={isProfilesPending ? "Searching..." : "No profiles found."}
                    description={fieldErrors.profileIds}
                    descriptionClassName="text-red-500"
                />

                {formValues.profileIds.length > 0 && (
                    <div className="flex flex-wrap gap-2 rounded-lg border border-border bg-bg-secondary p-2 max-h-16 overflow-y-auto">
                        {formValues.profileIds.map((profileId) => (
                            <span
                                key={profileId}
                                className="inline-flex items-center gap-1 rounded-md border border-border bg-bg px-2 py-1 text-sm text-text-secondary"
                            >
                                {profileLabelById[profileId] ?? `ID: ${profileId}`}
                                <button
                                    type="button"
                                    onClick={() => handleRemoveProfile(profileId)}
                                    className="inline-flex h-4 w-4 items-center justify-center rounded text-text-muted hover:bg-bg-secondary"
                                    aria-label={`Remove profile ${profileId}`}
                                >
                                    <X size={12} />
                                </button>
                            </span>
                        ))}
                    </div>
                )}
            </div>

            {!isEditMode && (
                <div className="flex items-start gap-3 rounded-lg border border-border bg-bg-secondary px-4 py-3">
                    <Info size={24} className="mt-0.5 text-text-focus" />
                    <AppText variant="description" className="text-base leading-7 text-text-secondary">
                        New operators will receive an automated invitation to set their initial
                        password and access the <span className="text-text-focus">Talkytime Dashboard</span>.
                    </AppText>
                </div>
            )}
        </FormModalShell>
    );
}
