import React from "react";
import { Info, Moon, Sun } from "lucide-react";
import { AppInputField } from "../../components/form-field";
import { FormModalShell } from "../../components/form-modal-shell";
import {
    SearchableDropdown,
    type SearchableDropdownOption,
} from "../../components/searchable-dropdown";
import { SegmentedTabBar } from "../../components/segmented-tab-bar";
import { AppText } from "../../components/text";
import { useSearchGroups } from "../../lib/queries";
import { useDebounce } from "../../lib/hooks/debounce";

export type OperatorShiftType = "day" | "night";

export interface OperatorFormValues {
    operatorName: string;
    operatorId: string;
    groupId: string;
    shift: OperatorShiftType;
    supervisorName?: string;
}

export type OperatorFormFieldErrors = Partial<
    Record<"operatorName" | "operatorId" | "groupId" | "shift", string>
>;

interface OperatorFormModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (
        values: OperatorFormValues,
    ) => Promise<OperatorFormFieldErrors | null> | OperatorFormFieldErrors | null;
    mode: "create" | "edit";
    defaultValues?: Partial<OperatorFormValues>;
}

const EMPTY_FORM: OperatorFormValues = {
    operatorName: "",
    operatorId: "",
    groupId: "",
    shift: "day",
    supervisorName: "",
};

export function OperatorFormModal({
    open,
    onClose,
    onSubmit,
    mode,
    defaultValues,
}: OperatorFormModalProps) {
    const [formValues, setFormValues] = React.useState<OperatorFormValues>(EMPTY_FORM);
    const [fieldErrors, setFieldErrors] = React.useState<OperatorFormFieldErrors>({});
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [groupSearch, setGroupSearch] = React.useState("");
    const debouncedGroupSearch = useDebounce(groupSearch, 500);
    const { data, isPending } = useSearchGroups(debouncedGroupSearch);



    const groupOptions = React.useMemo<SearchableDropdownOption[]>(() => {
        return (data?.results ?? []).map((group) => ({
            value: String(group.id),
            label: group.name,
            subtitle: `Operators: ${group.operator_count} | Supervisors: ${group.supervisor_count}`,
            keywords: [
                `Total: ${group.operators_summary.total}`,
                `Day: ${group.operators_summary.day_shift}`,
                `Night: ${group.operators_summary.night_shift}`,
                ...group.supervisors.map(
                    (supervisor) => supervisor.supervisor_name || supervisor.name,
                ),
            ],
        }));
    }, [data]);

    React.useEffect(() => {
        if (!open) {
            return;
        }

        setFormValues({
            ...EMPTY_FORM,
            ...defaultValues,
        });
        setFieldErrors({});
    }, [open, defaultValues]);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const nextErrors: OperatorFormFieldErrors = {};
        if (!formValues.operatorName.trim()) {
            nextErrors.operatorName = "Operator name is required.";
        }
        if (!formValues.operatorId.trim()) {
            nextErrors.operatorId = "Operator ID is required.";
        }
        if (!formValues.groupId) {
            nextErrors.groupId = "Please select a group.";
        }

        if (Object.keys(nextErrors).length > 0) {
            setFieldErrors(nextErrors);
            return;
        }

        setIsSubmitting(true);
        let submitErrors: OperatorFormFieldErrors | null = null;
        try {
            submitErrors = await onSubmit(formValues);
        } finally {
            setIsSubmitting(false);
        }

        if (submitErrors && Object.keys(submitErrors).length > 0) {
            setFieldErrors(submitErrors);
            return;
        }

        setFieldErrors({});
        onClose();
    };

    const hasSupervisor = Boolean(formValues.supervisorName?.trim());
    const baseSubmitLabel = mode === "create" ? "Create Operator" : "Save";
    const submitLabel = isSubmitting
        ? mode === "create"
            ? "Creating..."
            : "Saving..."
        : baseSubmitLabel;
    const title = mode === "create" ? "Add New Operator" : "Operator Details";
    const description =
        mode === "create"
            ? "Onboard a new curator into the Architect ecosystem."
            : "Onboard a Supervisor into the Architect ecosystem.";

    return (
        <FormModalShell
            open={open}
            onClose={onClose}
            onSubmit={handleSubmit}
            title={title}
            description={description}
            submitLabel={submitLabel}
            submitButtonDisabled={isSubmitting}
            submitButtonLoading={isSubmitting}
            ariaLabel={mode === "create" ? "Create operator" : "Operator details"}
            contentClassName="max-w-4xl rounded-[22px] p-0"
        >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <AppInputField
                    label="Operator Name"
                    value={formValues.operatorName}
                    onChange={(value) => {
                        setFormValues((prev) => ({ ...prev, operatorName: value }));
                        setFieldErrors((prev) => ({ ...prev, operatorName: undefined }));
                    }}
                    placeholder="Enter Operator name"
                    description={fieldErrors.operatorName}
                    descriptionClassName="text-red-500"
                />

                <AppInputField
                    label="Operator Id"
                    value={formValues.operatorId}
                    onChange={(value) => {
                        setFormValues((prev) => ({ ...prev, operatorId: value }));
                        setFieldErrors((prev) => ({ ...prev, operatorId: undefined }));
                    }}
                    placeholder="Enter Operator id"
                    description={fieldErrors.operatorId}
                    descriptionClassName="text-red-500"
                />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <SearchableDropdown
                    label="Select Group"
                    value={formValues.groupId}
                    options={groupOptions}
                    onChange={(value) => {
                        setFormValues((prev) => ({ ...prev, groupId: value }));
                        setFieldErrors((prev) => ({ ...prev, groupId: undefined }));
                    }}
                    onSearchChange={setGroupSearch}
                    placeholder={isPending ? "Searching groups..." : "Search group"}
                    emptyText={isPending ? "Searching..." : "No groups found."}
                    maxResults={8}
                    description={fieldErrors.groupId}
                    descriptionClassName="text-red-500"
                />

                <div className="space-y-2">
                    <AppText variant="description" className="font-semibold text-text">
                        Shift Type
                    </AppText>
                    <SegmentedTabBar
                        value={formValues.shift}
                        options={[
                            { value: "day", icon: Sun, label: "DAY" },
                            { value: "night", icon: Moon, label: "NIGHT" },
                        ]}
                        onChange={(value) => {
                            setFormValues((prev) => ({ ...prev, shift: value }));
                            setFieldErrors((prev) => ({ ...prev, shift: undefined }));
                        }}
                    />
                    {fieldErrors.shift && (
                        <AppText variant="description" className="text-xs text-red-500">
                            {fieldErrors.shift}
                        </AppText>
                    )}
                </div>
            </div>

            {hasSupervisor && (
                <AppInputField
                    label="Supervisor Name"
                    value={formValues.supervisorName || ""}
                    disabled
                    readOnly
                />
            )}

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
