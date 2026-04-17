import React from "react";
import { Info, Moon, Sun } from "lucide-react";
import { AppText } from "../../components/text";
import { AppInputField } from "../../components/form-field";
import { SegmentedTabBar } from "../../components/segmented-tab-bar";
import { FormModalShell } from "../../components/form-modal-shell";
import {
    SearchableDropdown,
    type SearchableDropdownOption,
} from "../../components/searchable-dropdown";
import { useSearchGroups } from "../../lib/queries";
import { useDebounce } from "../../lib/hooks/debounce";

type ShiftType = "day" | "night";
type SupervisorModalMode = "create" | "edit";

export interface CreateSupervisorFormValues {
    supervisorName: string;
    supervisorId: string;
    email: string;
    password: string;
    groupId: string;
    operatorIds: string[];
    shift: ShiftType;
}

export type CreateSupervisorFormFieldErrors = Partial<
    Record<
        "supervisorName" | "supervisorId" | "email" | "password" | "groupId" | "shift" | "general",
        string
    >
>;

interface CreateSupervisorModalProps {
    open: boolean;
    onClose: () => void;
    mode?: SupervisorModalMode;
    initialValues?: Partial<CreateSupervisorFormValues>;
    onSubmit?: (
        values: CreateSupervisorFormValues,
    ) => Promise<CreateSupervisorFormFieldErrors | null> | CreateSupervisorFormFieldErrors | null;
}

const EMPTY_FORM: CreateSupervisorFormValues = {
    supervisorName: "",
    supervisorId: "",
    email: "",
    password: "",
    groupId: "",
    operatorIds: [],
    shift: "day",
};

export function CreateSupervisorModal({
    open,
    onClose,
    mode = "create",
    initialValues,
    onSubmit,
}: CreateSupervisorModalProps) {
    const [formValues, setFormValues] = React.useState<CreateSupervisorFormValues>(EMPTY_FORM);
    const [fieldErrors, setFieldErrors] = React.useState<CreateSupervisorFormFieldErrors>({});
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [groupSearch, setGroupSearch] = React.useState("");
    const debouncedGroupSearch = useDebounce(groupSearch, 500);
    const { data: groupsData, isPending: isGroupsPending } = useSearchGroups(debouncedGroupSearch);

    const groupOptions = React.useMemo<SearchableDropdownOption[]>(() => {
        return (groupsData?.results ?? []).map((group) => ({
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
    }, [groupsData]);

    React.useEffect(() => {
        if (!open) {
            return;
        }

        setFormValues({
            ...EMPTY_FORM,
            ...initialValues,
            password: "",
        });
        setFieldErrors({});
        setGroupSearch("");
    }, [initialValues, open]);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const nextErrors: CreateSupervisorFormFieldErrors = {};
        if (!formValues.supervisorName.trim()) {
            nextErrors.supervisorName = "Supervisor name is required.";
        }
        if (!formValues.supervisorId.trim()) {
            nextErrors.supervisorId = "Supervisor ID is required.";
        }
        if (!formValues.email.trim()) {
            nextErrors.email = "Email is required.";
        }
        if (mode === "create" && !formValues.password.trim()) {
            nextErrors.password = "Password is required.";
        }
        if (!formValues.groupId) {
            nextErrors.groupId = "Assigned group is required.";
        }

        if (Object.keys(nextErrors).length > 0) {
            setFieldErrors(nextErrors);
            return;
        }

        setIsSubmitting(true);
        let submitErrors: CreateSupervisorFormFieldErrors | null = null;
        try {
            submitErrors = (await onSubmit?.(formValues)) ?? null;
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

    const submitLabel =
        mode === "edit"
            ? isSubmitting
                ? "Saving..."
                : "Save Changes"
            : isSubmitting
                ? "Creating..."
                : "Create Supervisor";

    return (
        <FormModalShell
            open={open}
            onClose={onClose}
            onSubmit={handleSubmit}
            title={mode === "edit" ? "Edit Supervisor" : "Create Supervisor"}
            description={
                mode === "edit"
                    ? "Update supervisor details and assignment."
                    : "Onboard a Supervisor into the Architect ecosystem."
            }
            submitLabel={submitLabel}
            submitButtonDisabled={isSubmitting}
            submitButtonLoading={isSubmitting}
            ariaLabel={mode === "edit" ? "Edit supervisor" : "Create supervisor"}
            contentClassName="max-w-4xl rounded-[22px] p-0"
        >
            {fieldErrors.general && (
                <AppText variant="description" className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
                    {fieldErrors.general}
                </AppText>
            )}

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <AppInputField
                    label="Supervisor Name"
                    value={formValues.supervisorName}
                    onChange={(value) => {
                        setFormValues((prev) => ({ ...prev, supervisorName: value }));
                        setFieldErrors((prev) => ({ ...prev, supervisorName: undefined }));
                    }}
                    placeholder="Enter supervisor name"
                    description={fieldErrors.supervisorName}
                    descriptionClassName="text-red-500"
                />

                <AppInputField
                    label="Supervisor Id"
                    value={formValues.supervisorId}
                    onChange={(value) => {
                        setFormValues((prev) => ({ ...prev, supervisorId: value }));
                        setFieldErrors((prev) => ({ ...prev, supervisorId: undefined }));
                    }}
                    placeholder="Enter supervisor id"
                    description={fieldErrors.supervisorId}
                    descriptionClassName="text-red-500"
                />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <AppInputField
                    label="Email"
                    value={formValues.email}
                    onChange={(value) => {
                        setFormValues((prev) => ({ ...prev, email: value }));
                        setFieldErrors((prev) => ({ ...prev, email: undefined }));
                    }}
                    autoComplete="email"
                    type="email"
                    placeholder="Enter mail address"
                    description={fieldErrors.email}
                    descriptionClassName="text-red-500"
                />

                <AppInputField
                    label={mode === "edit" ? "Set Password (Optional)" : "Set Password"}
                    value={formValues.password}
                    onChange={(value) => {
                        setFormValues((prev) => ({ ...prev, password: value }));
                        setFieldErrors((prev) => ({ ...prev, password: undefined }));
                    }}
                    type="password"
                    autoComplete="new-password"
                    placeholder="Set a password"
                    description={fieldErrors.password}
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
                    placeholder={isGroupsPending ? "Searching groups..." : "Search group"}
                    emptyText={isGroupsPending ? "Searching..." : "No groups found."}
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
