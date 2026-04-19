import React from "react";
import { AppInputField } from "../../components/form-field";
import { FormModalShell } from "../../components/form-modal-shell";
import {
    SearchableDropdown,
    type SearchableDropdownOption,
} from "../../components/searchable-dropdown";
import { useDebounce } from "../../lib/hooks/debounce";
import { useSearchOperators } from "../../lib/queries";

export interface CashAdvanceFormValues {
    operatorDbId: string;
    operatorName: string;
    operatorId: string;
    groupName: string;
    reason: string;
    advancedAmount: string;
    paidAmount: string;
    issueDate: string;
}

interface CashAdvanceModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (values: CashAdvanceFormValues) => void | Promise<void>;
    defaultValues?: Partial<CashAdvanceFormValues>;
}

type CashAdvanceFieldErrors = Partial<Record<"operatorDbId" | "reason" | "advancedAmount" | "paidAmount" | "issueDate", string>>;

const EMPTY_FORM: CashAdvanceFormValues = {
    operatorDbId: "",
    operatorName: "",
    operatorId: "",
    groupName: "",
    reason: "",
    advancedAmount: "",
    paidAmount: "",
    issueDate: "",
};

export function CashAdvanceModal({
    open,
    onClose,
    onSubmit,
    defaultValues,
}: CashAdvanceModalProps) {
    const [formValues, setFormValues] = React.useState<CashAdvanceFormValues>(EMPTY_FORM);
    const [operatorSearch, setOperatorSearch] = React.useState("");
    const [fieldErrors, setFieldErrors] = React.useState<CashAdvanceFieldErrors>({});
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const debouncedOperatorSearch = useDebounce(operatorSearch, 500);
    const { data: operatorsData, isPending: isOperatorsPending } = useSearchOperators(
        debouncedOperatorSearch,
    );

    React.useEffect(() => {
        if (!open) return;

        setFormValues({
            ...EMPTY_FORM,
            ...defaultValues,
        });
        setFieldErrors({});
        setOperatorSearch("");
        setIsSubmitting(false);
    }, [open, defaultValues]);

    const operatorOptions = React.useMemo<SearchableDropdownOption[]>(() => {
        const baseOptions = (operatorsData?.results ?? []).map((operator) => ({
            value: String(operator.id),
            label: operator.full_name || operator.operator_name || `Operator #${operator.id}`,
            subtitle: `ID: ${operator.operator_id} | ${operator.group_name}`,
            keywords: [
                operator.operator_id,
                operator.operator_name,
                operator.full_name,
                operator.group_name,
                operator.shift_display,
            ],
        }));

        if (
            !formValues.operatorDbId ||
            baseOptions.some((option) => option.value === formValues.operatorDbId)
        ) {
            return baseOptions;
        }

        return [
            {
                value: formValues.operatorDbId,
                label: formValues.operatorName,
                subtitle: `ID: ${formValues.operatorId} | ${formValues.groupName}`,
                keywords: [formValues.operatorName, formValues.operatorId, formValues.groupName],
            },
            ...baseOptions,
        ];
    }, [operatorsData, formValues]);

    const handleOperatorSelect = (operatorDbId: string) => {
        const selectedOperator = (operatorsData?.results ?? []).find(
            (operator) => String(operator.id) === operatorDbId,
        );

        if (!selectedOperator) {
            return;
        }

        setFormValues((prev) => ({
            ...prev,
            operatorDbId,
            operatorName:
                selectedOperator.full_name || selectedOperator.operator_name || prev.operatorName,
            operatorId: selectedOperator.operator_id,
            groupName: selectedOperator.group_name,
        }));

        setFieldErrors((prev) => ({ ...prev, operatorDbId: undefined }));
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const nextErrors: CashAdvanceFieldErrors = {};

        if (!formValues.operatorDbId) {
            nextErrors.operatorDbId = "Operator is required.";
        }

        if (!formValues.reason.trim()) {
            nextErrors.reason = "Reason is required.";
        }

        if (!formValues.advancedAmount || Number(formValues.advancedAmount) <= 0) {
            nextErrors.advancedAmount = "Advanced amount must be greater than 0.";
        }

        if (formValues.paidAmount && Number(formValues.paidAmount) < 0) {
            nextErrors.paidAmount = "Paid amount cannot be negative.";
        }

        if (!formValues.issueDate) {
            nextErrors.issueDate = "Issue date is required.";
        }

        if (Object.keys(nextErrors).length > 0) {
            setFieldErrors(nextErrors);
            return;
        }

        try {
            setIsSubmitting(true);
            await onSubmit(formValues);
        } finally {
            setIsSubmitting(false);
        }
    };

    const primaryLabel = defaultValues ? "Save" : "Create Cash Advance";

    return (
        <FormModalShell
            open={open}
            onClose={onClose}
            onSubmit={handleSubmit}
            title="Cash Advances"
            description="Manage operator cash advances and adjustments."
            submitLabel={isSubmitting ? `${primaryLabel}...` : primaryLabel}
            ariaLabel="Cash advance form"
            contentClassName="max-w-3xl rounded-[22px] p-0"
            submitButtonDisabled={isSubmitting}
            submitButtonLoading={isSubmitting}
        >
            <SearchableDropdown
                label="Operator Name"
                value={formValues.operatorDbId}
                options={operatorOptions}
                onChange={handleOperatorSelect}
                onSearchChange={setOperatorSearch}
                placeholder={isOperatorsPending ? "Searching operators..." : "Search operator name/id"}
                emptyText={isOperatorsPending ? "Searching..." : "No operators found."}
                description={fieldErrors.operatorDbId}
                descriptionClassName="text-red"
            />

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <AppInputField
                    label="Operator Id"
                    value={formValues.operatorId}
                    onChange={(value) => setFormValues((prev) => ({ ...prev, operatorId: value }))}
                    readOnly
                />

                <AppInputField
                    label="Group Name"
                    value={formValues.groupName}
                    onChange={(value) => setFormValues((prev) => ({ ...prev, groupName: value }))}
                    readOnly
                />
            </div>

            <AppInputField
                label="Reason"
                value={formValues.reason}
                onChange={(value) => {
                    setFormValues((prev) => ({ ...prev, reason: value }));
                    setFieldErrors((prev) => ({ ...prev, reason: undefined }));
                }}
                placeholder="Enter reason"
                description={fieldErrors.reason}
                descriptionClassName="text-red"
            />

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <AppInputField
                    label="Advanced Amount"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formValues.advancedAmount}
                    onChange={(value) => {
                        setFormValues((prev) => ({ ...prev, advancedAmount: value }));
                        setFieldErrors((prev) => ({ ...prev, advancedAmount: undefined }));
                    }}
                    placeholder="Enter advanced amount"
                    description={fieldErrors.advancedAmount}
                    descriptionClassName="text-red"
                />

                <AppInputField
                    label="Paid Amount"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formValues.paidAmount}
                    onChange={(value) => {
                        setFormValues((prev) => ({ ...prev, paidAmount: value }));
                        setFieldErrors((prev) => ({ ...prev, paidAmount: undefined }));
                    }}
                    placeholder="Enter paid amount"
                    description={fieldErrors.paidAmount}
                    descriptionClassName="text-red"
                />
            </div>

            <AppInputField
                label="Issue Date"
                type="date"
                value={formValues.issueDate}
                onChange={(value) => {
                    setFormValues((prev) => ({ ...prev, issueDate: value }));
                    setFieldErrors((prev) => ({ ...prev, issueDate: undefined }));
                }}
                description={fieldErrors.issueDate}
                descriptionClassName="text-red"
            />
        </FormModalShell>
    );
}
