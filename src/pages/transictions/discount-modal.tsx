import React from "react";
import { AppButton } from "../../components/button";
import { AppModal } from "../../components/modal";
import {
    SearchableDropdown,
    type SearchableDropdownOption,
} from "../../components/searchable-dropdown";
import { AppText } from "../../components/text";

export interface DiscountFormValues {
    operatorName: string;
    operatorId: string;
    groupName: string;
    reason: string;
    amount: string;
    issueDate: string;
}

export interface DiscountOperatorOption extends SearchableDropdownOption {
    operatorName: string;
    groupName: string;
}

interface DiscountModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (values: DiscountFormValues) => void;
    defaultValues?: Partial<DiscountFormValues>;
    operatorOptions: DiscountOperatorOption[];
}

const EMPTY_FORM: DiscountFormValues = {
    operatorName: "",
    operatorId: "",
    groupName: "",
    reason: "",
    amount: "",
    issueDate: "",
};

export function DiscountModal({
    open,
    onClose,
    onSubmit,
    defaultValues,
    operatorOptions,
}: DiscountModalProps) {
    const [formValues, setFormValues] = React.useState<DiscountFormValues>(EMPTY_FORM);

    React.useEffect(() => {
        if (!open) return;

        setFormValues({
            ...EMPTY_FORM,
            ...defaultValues,
        });
    }, [open, defaultValues]);

    const handleOperatorSelect = (operatorId: string) => {
        const selectedOperator = operatorOptions.find(
            (operator) => operator.value === operatorId,
        );

        setFormValues((prev) => ({
            ...prev,
            operatorId,
            operatorName: selectedOperator?.operatorName ?? prev.operatorName,
            groupName: selectedOperator?.groupName ?? prev.groupName,
        }));
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        onSubmit(formValues);
    };

    const primaryLabel = defaultValues ? "Save" : "Add Discounts";

    return (
        <AppModal
            open={open}
            onClose={onClose}
            showX
            ariaLabel="Discount form"
            contentClassName="max-w-3xl rounded-[22px] p-0"
        >
            <div className="border-b border-border px-6 pb-5 pt-6">
                <AppText variant="header">Discounts</AppText>
                <AppText variant="description" className="mt-1 text-3xl text-[#5E708A]">
                    Onboard a new curator into the Architect ecosystem.
                </AppText>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="space-y-6 px-6 py-6">
                    <div className="space-y-2">
                        <AppText variant="description" className="font-semibold text-text">
                            Operator Name
                        </AppText>
                        <input
                            type="text"
                            value={formValues.operatorName}
                            onChange={(event) =>
                                setFormValues((prev) => ({
                                    ...prev,
                                    operatorName: event.target.value,
                                }))
                            }
                            placeholder="Enter Profile name"
                            className="h-12 w-full rounded-lg border border-border bg-tab-bg px-4 text-base text-text-secondary outline-none focus:border-text-focus focus:bg-white"
                        />
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <SearchableDropdown
                            label="Operator Id"
                            value={formValues.operatorId}
                            options={operatorOptions}
                            onChange={handleOperatorSelect}
                            placeholder="Search operator id"
                            maxResults={5}
                        />

                        <div className="space-y-2">
                            <AppText variant="description" className="font-semibold text-text">
                                Group Name
                            </AppText>
                            <input
                                type="text"
                                value={formValues.groupName}
                                onChange={(event) =>
                                    setFormValues((prev) => ({
                                        ...prev,
                                        groupName: event.target.value,
                                    }))
                                }
                                placeholder="Enter Group Name"
                                className="h-10 w-full rounded-lg border border-border bg-tab-bg px-3 text-base text-text-secondary outline-none focus:border-text-focus focus:bg-white"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <AppText variant="description" className="font-semibold text-text">
                            Reason
                        </AppText>
                        <input
                            type="text"
                            value={formValues.reason}
                            onChange={(event) =>
                                setFormValues((prev) => ({
                                    ...prev,
                                    reason: event.target.value,
                                }))
                            }
                            placeholder="Enter Reason"
                            className="h-12 w-full rounded-lg border border-border bg-tab-bg px-4 text-base text-text-secondary outline-none focus:border-text-focus focus:bg-white"
                        />
                    </div>

                    <div className="space-y-2">
                        <AppText variant="description" className="font-semibold text-text">
                            Enter amount
                        </AppText>
                        <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={formValues.amount}
                            onChange={(event) =>
                                setFormValues((prev) => ({
                                    ...prev,
                                    amount: event.target.value,
                                }))
                            }
                            placeholder="Enter amount"
                            className="h-12 w-full rounded-lg border border-border bg-tab-bg px-4 text-base text-text-secondary outline-none focus:border-text-focus focus:bg-white"
                        />
                    </div>

                    <div className="space-y-2 md:w-[48%]">
                        <AppText variant="description" className="font-semibold text-text">
                            Issue Date
                        </AppText>
                        <input
                            type="date"
                            value={formValues.issueDate}
                            onChange={(event) =>
                                setFormValues((prev) => ({
                                    ...prev,
                                    issueDate: event.target.value,
                                }))
                            }
                            className="h-12 w-full rounded-lg border border-border bg-tab-bg px-4 text-base text-text-secondary outline-none focus:border-text-focus focus:bg-white"
                        />
                    </div>
                </div>

                <div className="flex items-center justify-end gap-3 bg-border px-6 py-4">
                    <AppButton type="button" variant="outline" size="md" onClick={onClose}>
                        Cancel
                    </AppButton>
                    <AppButton type="submit" variant="focus" size="md" className="min-w-40">
                        {primaryLabel}
                    </AppButton>
                </div>
            </form>
        </AppModal>
    );
}
