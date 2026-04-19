import React from "react";
import { Info } from "lucide-react";
import { AppButton } from "../../components/button";
import { AppInputField } from "../../components/form-field";
import { FormModalShell } from "../../components/form-modal-shell";
import { SegmentedTabBar } from "../../components/segmented-tab-bar";
import { AppText } from "../../components/text";
import type { ProfileOperatorSummary } from "../../type";

export type BonusPercentage = "21%" | "25%";

export interface ProfileFormValues {
    profileName: string;
    profileId: string;
    operatorId: string;
    bonusPercentage: BonusPercentage;
    supervisorName?: string;
}

interface ProfileFormModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (values: ProfileFormValues) => void | Promise<void>;
    defaultValues?: Partial<ProfileFormValues>;
    assignedOperator?: ProfileOperatorSummary | null;
    onDeleteAssignedOperator?: () => void | Promise<void>;
    isDeletingAssignedOperator?: boolean;
}

const EMPTY_FORM: ProfileFormValues = {
    profileName: "",
    profileId: "",
    operatorId: "",
    bonusPercentage: "21%",
    supervisorName: "",
};

export function ProfileFormModal({
    open,
    onClose,
    onSubmit,
    defaultValues,
    assignedOperator,
    onDeleteAssignedOperator,
    isDeletingAssignedOperator = false,
}: ProfileFormModalProps) {
    const [formValues, setFormValues] = React.useState<ProfileFormValues>(EMPTY_FORM);
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    React.useEffect(() => {
        if (!open) {
            return;
        }

        const nextValues = {
            ...EMPTY_FORM,
            ...defaultValues,
        };

        if (nextValues.bonusPercentage !== "21%" && nextValues.bonusPercentage !== "25%") {
            nextValues.bonusPercentage = "21%";
        }

        setFormValues(nextValues);
        setIsSubmitting(false);
    }, [open, defaultValues]);

    const isDetailsMode = Boolean(defaultValues);
    const hasSupervisor = Boolean(formValues.supervisorName?.trim());

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            setIsSubmitting(true);
            await onSubmit(formValues);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteAssignedOperator = async () => {
        if (!onDeleteAssignedOperator || !assignedOperator) {
            return;
        }

        await onDeleteAssignedOperator();
    };

    return (
        <FormModalShell
            open={open}
            onClose={onClose}
            onSubmit={handleSubmit}
            title={isDetailsMode ? "Profile Details" : "Create An Profile"}
            description={
                isDetailsMode
                    ? "Onboard a Supervisor into the Architect ecosystem."
                    : "Onboard a new curator into the Architect ecosystem."
            }
            submitLabel={isDetailsMode ? (isSubmitting ? "Saving..." : "Save") : "Create Profile"}
            ariaLabel={isDetailsMode ? "Profile details" : "Create profile"}
            contentClassName="max-w-4xl rounded-[22px] p-0"
            submitButtonDisabled={isSubmitting}
            submitButtonLoading={isSubmitting}
        >
            <AppInputField
                label="Profile Name"
                value={formValues.profileName}
                onChange={(value) =>
                    setFormValues((prev) => ({ ...prev, profileName: value }))
                }
                placeholder="Enter Profile name"
            />

            
                <div className="grid grid-cols-2 gap-4">
                    <AppInputField
                        label="Profile Id"
                        value={formValues.profileId}
                        onChange={(value) =>
                            setFormValues((prev) => ({ ...prev, profileId: value }))
                        }
                        placeholder="Enter Profile Id"
                    />
                                

            <div className="space-y-2">
                <AppText variant="description" className="font-semibold text-text">
                    Bonus Percentage
                </AppText>
                <SegmentedTabBar
                    value={formValues.bonusPercentage}
                    options={[
                        { value: "21%", label: "21%" },
                        { value: "25%", label: "25%" },
                    ]}
                    onChange={(value) =>
                        setFormValues((prev) => ({ ...prev, bonusPercentage: value }))
                    }
                />
            </div>
                </div>

            {isDetailsMode && (
                <div className="space-y-2">
                    <AppText variant="description" className="font-semibold text-text">
                        Assigned Operator
                    </AppText>

                    {assignedOperator ? (
                        <div className="overflow-hidden rounded-lg border border-border bg-white">
                            <div className="grid grid-cols-[1.2fr_2fr_2fr_auto] gap-3 bg-bg-secondary px-4 py-2">
                                <AppText variant="description" className="text-xs font-semibold uppercase text-text-muted">
                                    Operation Order
                                </AppText>
                                <AppText variant="description" className="text-xs font-semibold uppercase text-text-muted">
                                    Operator Name
                                </AppText>
                                <AppText variant="description" className="text-xs font-semibold uppercase text-text-muted">
                                    Operator Id
                                </AppText>
                                <AppText variant="description" className="text-xs font-semibold uppercase text-text-muted text-right">
                                    Action
                                </AppText>
                            </div>

                            <div className="grid grid-cols-[1.2fr_2fr_2fr_auto] items-center gap-3 px-4 py-3">
                                <AppText variant="body" className="font-semibold text-text">
                                    1
                                </AppText>
                                <AppText variant="body" className="font-semibold text-text">
                                    {assignedOperator.full_name}
                                </AppText>
                                <AppText variant="description" className="text-text-secondary">
                                    {assignedOperator.operator_id}
                                </AppText>
                                <div className="justify-self-end">
                                    <AppButton
                                        type="button"
                                        variant="danger"
                                        size="sm"
                                        className="min-w-24"
                                        onClick={handleDeleteAssignedOperator}
                                        isLoading={isDeletingAssignedOperator}
                                        loadingLabel="Deleting..."
                                    >
                                        Delete
                                    </AppButton>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <AppText variant="description" className="text-sm text-text-muted">
                            No assigned operator.
                        </AppText>
                    )}
                </div>
            )}


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
