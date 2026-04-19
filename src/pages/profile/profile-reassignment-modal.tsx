import React from "react";
import { X } from "lucide-react";
import { FormModalShell } from "../../components/form-modal-shell";
import {
    SearchableDropdown,
    type SearchableDropdownOption,
} from "../../components/searchable-dropdown";
import { AppText } from "../../components/text";
import { useDebounce } from "../../lib/hooks/debounce";
import { useSearchOperators } from "../../lib/queries";

export interface ProfileReassignmentFormValues {
    profileIds: string[];
    operatorId: string;
    operatorName: string;
}

interface ProfileReassignmentModalProps {
    open: boolean;
    onClose: () => void;
    profileOptions: SearchableDropdownOption[];
    onSubmit: (values: ProfileReassignmentFormValues) => void | Promise<void>;
}

type ReassignmentFieldErrors = {
    profileIds?: string;
    operatorId?: string;
};

export function ProfileReassignmentModal({
    open,
    onClose,
    profileOptions,
    onSubmit,
}: ProfileReassignmentModalProps) {
    const [selectedProfileIds, setSelectedProfileIds] = React.useState<string[]>([]);
    const [selectedOperatorId, setSelectedOperatorId] = React.useState("");
    const [selectedOperatorName, setSelectedOperatorName] = React.useState("");
    const [operatorSearch, setOperatorSearch] = React.useState("");
    const [profileDropdownKey, setProfileDropdownKey] = React.useState(0);
    const [fieldErrors, setFieldErrors] = React.useState<ReassignmentFieldErrors>({});
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    const debouncedOperatorSearch = useDebounce(operatorSearch, 500);
    const { data: operatorsData, isPending: isOperatorsPending } = useSearchOperators(
        debouncedOperatorSearch,
    );

    React.useEffect(() => {
        if (!open) {
            return;
        }

        setSelectedProfileIds([]);
        setSelectedOperatorId("");
        setSelectedOperatorName("");
        setOperatorSearch("");
        setProfileDropdownKey(0);
        setFieldErrors({});
        setIsSubmitting(false);
    }, [open]);

    const selectedProfilesSet = React.useMemo(
        () => new Set(selectedProfileIds),
        [selectedProfileIds],
    );

    const availableProfileOptions = React.useMemo(() => {
        return profileOptions.filter((option) => !selectedProfilesSet.has(option.value));
    }, [profileOptions, selectedProfilesSet]);

    const profileLabelById = React.useMemo(() => {
        return Object.fromEntries(
            profileOptions.map((option) => [option.value, option.label]),
        ) as Record<string, string>;
    }, [profileOptions]);

    const operatorOptions = React.useMemo<SearchableDropdownOption[]>(() => {
        return (operatorsData?.results ?? []).map((operator) => ({
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

    const handleAddProfile = (profileId: string) => {
        if (!profileId) {
            return;
        }

        setSelectedProfileIds((prev) => {
            if (prev.includes(profileId)) {
                return prev;
            }

            return [...prev, profileId];
        });

        setFieldErrors((prev) => ({ ...prev, profileIds: undefined }));
        setProfileDropdownKey((prev) => prev + 1);
    };

    const handleRemoveProfile = (profileId: string) => {
        setSelectedProfileIds((prev) => prev.filter((id) => id !== profileId));
    };

    const handleOperatorChange = (operatorId: string) => {
        setSelectedOperatorId(operatorId);
        setFieldErrors((prev) => ({ ...prev, operatorId: undefined }));

        const selected = operatorOptions.find((option) => option.value === operatorId);
        setSelectedOperatorName(selected?.label ?? "");
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const nextErrors: ReassignmentFieldErrors = {};

        if (selectedProfileIds.length === 0) {
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
            await onSubmit({
                profileIds: selectedProfileIds,
                operatorId: selectedOperatorId,
                operatorName: selectedOperatorName,
            });
            onClose();
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
                <div className="space-y-2">
                    <SearchableDropdown
                        key={profileDropdownKey}
                        label="Profile name"
                        value=""
                        options={availableProfileOptions}
                        onChange={handleAddProfile}
                        placeholder="Search profile name/id"
                        emptyText="No profiles found."
                        description={fieldErrors.profileIds}
                        descriptionClassName="text-red"
                    />

                    {selectedProfileIds.length > 0 && (
                        <div className="flex max-h-24 flex-wrap gap-2 overflow-y-auto rounded-lg border border-border bg-bg-secondary p-2">
                            {selectedProfileIds.map((profileId) => (
                                <span
                                    key={profileId}
                                    className="inline-flex items-center gap-1 rounded-md border border-border bg-bg px-2 py-1 text-sm text-text-secondary"
                                >
                                    {profileLabelById[profileId] ?? profileId}
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

                <SearchableDropdown
                    label="Assign To"
                    value={selectedOperatorId}
                    options={operatorOptions}
                    onChange={handleOperatorChange}
                    onSearchChange={setOperatorSearch}
                    placeholder={
                        isOperatorsPending ? "Searching operators..." : "Search operator id/name"
                    }
                    emptyText={isOperatorsPending ? "Searching..." : "No operators found."}
                    description={fieldErrors.operatorId}
                    descriptionClassName="text-red"
                />
            </div>

            <div className="rounded-full border border-green bg-green-light px-4 py-2 text-center">
                <AppText variant="description" className="font-medium text-green">
                    The new operator will earn everything from now forward.
                </AppText>
            </div>
        </FormModalShell>
    );
}
