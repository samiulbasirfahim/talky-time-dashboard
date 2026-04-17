import React from "react";
import { Info, X } from "lucide-react";
import { AppInputField } from "../../components/form-field";
import { FormModalShell } from "../../components/form-modal-shell";
import {
    SearchableDropdown,
    type SearchableDropdownOption,
} from "../../components/searchable-dropdown";
import { useDebounce } from "../../lib/hooks/debounce";
import { useSearchOperators, useSearchSupervisors } from "../../lib/queries";
import { AppText } from "../../components/text";

export interface CreateGroupFormValues {
    groupName: string;
    supervisorIds: string[];
    operatorIds: string[];
}

export type CreateGroupFormFieldErrors = Partial<
    Record<"groupName" | "supervisorIds" | "operatorIds", string>
>;

interface CreateGroupModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit?: (
        values: CreateGroupFormValues,
    ) => Promise<CreateGroupFormFieldErrors | null> | CreateGroupFormFieldErrors | null;
}


const EMPTY_FORM: CreateGroupFormValues = {
    groupName: "",
    supervisorIds: [],
    operatorIds: [],
};

export function CreateGroupModal({ open, onClose, onSubmit }: CreateGroupModalProps) {
    const [formValues, setFormValues] = React.useState<CreateGroupFormValues>(EMPTY_FORM);
    const [fieldErrors, setFieldErrors] = React.useState<CreateGroupFormFieldErrors>({});
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    const [supervisorSearch, setSupervisorSearch] = React.useState("");
    const debouncedSupervisorSearch = useDebounce(supervisorSearch, 500);
    const [operatorSearch, setOperatorSearch] = React.useState("");
    const debouncedOperatorSearch = useDebounce(operatorSearch, 500);

    const [supervisorSearchKey, setSupervisorSearchKey] = React.useState(0);
    const [operatorSearchKey, setOperatorSearchKey] = React.useState(0);

    const {
        data: supervisorsData,
        isPending: isSupervisorsPending,
    } = useSearchSupervisors(debouncedSupervisorSearch);
    const {
        data: operatorsData,
        isPending: isOperatorsPending,
    } = useSearchOperators(debouncedOperatorSearch);

    const allSupervisorResults = supervisorsData?.results ?? [];
    const allOperatorResults = operatorsData?.results ?? [];

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

    const supervisorLabelById = React.useMemo(() => {
        return Object.fromEntries(
            allSupervisorResults.map((supervisor) => [
                String(supervisor.id),
                supervisor.supervisor_name || supervisor.name || supervisor.supervisor_id || `ID: ${supervisor.id}`,
            ]),
        ) as Record<string, string>;
    }, [allSupervisorResults]);

    const operatorLabelById = React.useMemo(() => {
        return Object.fromEntries(
            allOperatorResults.map((operator) => [
                String(operator.id),
                operator.full_name || operator.operator_name || operator.operator_id || `ID: ${operator.id}`,
            ]),
        ) as Record<string, string>;
    }, [allOperatorResults]);

    React.useEffect(() => {
        if (!open) {
            return;
        }

        setFormValues(EMPTY_FORM);
        setFieldErrors({});
        setIsSubmitting(false);
        setSupervisorSearch("");
        setOperatorSearch("");
        setSupervisorSearchKey(0);
        setOperatorSearchKey(0);
    }, [open]);

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

    const submitLabel = isSubmitting ? "Creating..." : "Create Group";

    return (
        <FormModalShell
            open={open}
            onClose={onClose}
            onSubmit={handleSubmit}
            title="Create Group"
            description="Onboard a Supervisor into the Architect ecosystem."
            submitLabel={submitLabel}
            ariaLabel="Create group"
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

            <div className="flex items-start gap-3 rounded-lg border border-border bg-bg-secondary px-4 py-3">
                <Info size={24} className="mt-0.5 text-text-focus" />
                <AppText variant="description" className="text-base leading-7 text-text-secondary">
                    New operators will receive an automated invitation to set their initial
                    password and access the <span className="text-text-focus">Talkytime Dashboard</span>.
                </AppText>
            </div>
        </FormModalShell>
    );
}
