import React from "react";
import { isAxiosError } from "axios";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import { AppButton } from "../../components/button";
import { AppInputField } from "../../components/form-field";
import {
    SearchableDropdown,
    type SearchableDropdownOption,
} from "../../components/searchable-dropdown";
import { AppText } from "../../components/text";
import { useDebounce } from "../../lib/hooks/debounce";
import {
    useIssueDisciplinaryWarning,
    useRecentDisciplinaryReprimands,
    useSearchOperators,
} from "../../lib/queries";
import type { IssueDisciplinaryWarningValidationErrors } from "../../type";

type ReprimandHistoryRow = {
    operator: string;
    month: string;
    deduction: string;
};

function formatMonth(dateOrMonth?: string): string {
    if (!dateOrMonth) {
        return "-";
    }

    const parsedDate = new Date(dateOrMonth);
    if (Number.isNaN(parsedDate.getTime())) {
        return dateOrMonth;
    }

    return parsedDate.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
    });
}

function formatCopAmount(value: unknown): string {
    const numeric = typeof value === "number" ? value : Number(value);
    if (!Number.isFinite(numeric)) {
        return "-";
    }

    return `-${numeric.toLocaleString("en-US", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    })} COP`;
}

type WarningFormErrors = {
    operatorId?: string;
    actionDate?: string;
    reason?: string;
    general?: string;
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

export function DisciplineIssueWarningSection() {
    const navigate = useNavigate();
    const [selectedOperatorId, setSelectedOperatorId] = React.useState("");
    const [operatorSearch, setOperatorSearch] = React.useState("");
    const [actionDate, setActionDate] = React.useState(() => new Date().toISOString().slice(0, 10));
    const [reason, setReason] = React.useState("");
    const [fieldErrors, setFieldErrors] = React.useState<WarningFormErrors>({});

    const debouncedOperatorSearch = useDebounce(operatorSearch, 500);
    const { data: operatorsData, isPending: isOperatorsPending } = useSearchOperators(debouncedOperatorSearch);
    const {
        mutateAsync: issueDisciplinaryWarning,
        isPending: isIssuingWarning,
    } = useIssueDisciplinaryWarning();
    const {
        data: recentReprimandsData,
        isLoading: isRecentReprimandsLoading,
        isError: isRecentReprimandsError,
    } = useRecentDisciplinaryReprimands(2);

    const operatorOptions = React.useMemo<SearchableDropdownOption[]>(() => {
        return (operatorsData?.results ?? []).map((operator) => ({
            value: String(operator.id),
            label: `${operator.operator_id} - ${operator.operator_name}`,
            subtitle: `${operator.group_name} | ${operator.shift_display}`,
            keywords: [
                operator.operator_id,
                operator.operator_name,
                operator.full_name,
                operator.group_name,
                operator.shift_display,
            ],
        }));
    }, [operatorsData]);

    const reprimandHistoryRows = React.useMemo<ReprimandHistoryRow[]>(() => {
        return (recentReprimandsData?.results ?? []).map((item) => ({
            operator: item.operator_name,
            month: formatMonth(item.month ?? item.date ?? item.created_at),
            deduction: formatCopAmount(
                item.total_deduction ?? item.amount_cop ?? item.deduction_amount,
            ),
        }));
    }, [recentReprimandsData]);

    const handleViewAllFinancialDeductions = () => {
        navigate("/transactions#reprimands");
    };

    const handleSubmitWarning = async () => {
        const nextErrors: WarningFormErrors = {};

        if (!selectedOperatorId) {
            nextErrors.operatorId = "Operator is required.";
        }

        if (!actionDate) {
            nextErrors.actionDate = "Action date is required.";
        }

        if (!reason.trim()) {
            nextErrors.reason = "Reason is required.";
        }

        if (Object.keys(nextErrors).length > 0) {
            setFieldErrors(nextErrors);
            return;
        }

        const parsedOperatorId = Number(selectedOperatorId);
        if (!Number.isInteger(parsedOperatorId) || parsedOperatorId <= 0) {
            setFieldErrors({ operatorId: "Please select a valid operator." });
            return;
        }

        try {
            await issueDisciplinaryWarning({
                operator_id: parsedOperatorId,
                action_date: actionDate,
                reason: reason.trim(),
            });

            toast.success("Warning issued successfully.");
            setReason("");
            setFieldErrors({});
        } catch (error) {
            if (isAxiosError<IssueDisciplinaryWarningValidationErrors>(error)) {
                const apiErrors = error.response?.data;

                const mappedErrors: WarningFormErrors = {
                    operatorId: getFirstErrorMessage(apiErrors?.operator_id),
                    actionDate: getFirstErrorMessage(apiErrors?.action_date),
                    reason: getFirstErrorMessage(apiErrors?.reason),
                    general:
                        getFirstErrorMessage(apiErrors?.detail) ??
                        getFirstErrorMessage(apiErrors?.non_field_errors),
                };

                setFieldErrors(mappedErrors);

                if (mappedErrors.general) {
                    toast.error(mappedErrors.general);
                    return;
                }
            }

            toast.error("Failed to issue warning. Please try again.");
        }
    };

    return (
        <div className="p-4">
            <div className="grid grid-cols-1 items-start gap-4 xl:grid-cols-2">
                <div className="h-fit w-full space-y-5 rounded-md p-4 shadow-border shadow-xs  border border-border">
                        <AppText variant="smallHeader" className="font-semibold text-text">
                            Issue Warning
                        </AppText>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <SearchableDropdown
                                    label="Operator ID / Name"
                                    value={selectedOperatorId}
                                    options={operatorOptions}
                                    onChange={(value) => {
                                        setSelectedOperatorId(value);
                                        setFieldErrors((prev) => ({ ...prev, operatorId: undefined }));
                                    }}
                                    onSearchChange={setOperatorSearch}
                                    placeholder={isOperatorsPending ? "Searching operators..." : "Search operator"}
                                    emptyText={isOperatorsPending ? "Searching..." : "No operators found."}
                                    description={fieldErrors.operatorId}
                                    descriptionClassName="text-red"
                                />
                            </div>

                            <div className="space-y-2">
                                <AppInputField
                                    label="Date"
                                    type="date"
                                    value={actionDate}
                                    onChange={(value) => {
                                        setActionDate(value);
                                        setFieldErrors((prev) => ({ ...prev, actionDate: undefined }));
                                    }}
                                    description={fieldErrors.actionDate}
                                    descriptionClassName="text-red"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <AppInputField
                                label="Reason for Warning"
                                type="text"
                                value={reason}
                                onChange={(value) => {
                                    setReason(value);
                                    setFieldErrors((prev) => ({ ...prev, reason: undefined }));
                                }}
                                placeholder="Describe the violation in detail..."
                                description={fieldErrors.reason}
                                descriptionClassName="text-red"
                                inputClassName="h-11"
                            />
                        </div>

                        <AppButton
                            type="button"
                            variant="focus"
                            fullWidth
                            className="h-12 rounded-lg text-base font-semibold"
                            onClick={handleSubmitWarning}
                            isLoading={isIssuingWarning}
                            loadingLabel="Issuing..."
                            disabled={isIssuingWarning}
                        >
                            Issue Warning
                        </AppButton>
                </div>

                <div className="h-fit w-full space-y-5 rounded-md p-4 shadow-border shadow-xs  border border-border">
                        <AppText variant="smallHeader" className="font-semibold text-text">
                            Reprimand History
                        </AppText>

                        <div className="grid grid-cols-3 gap-4 pb-1">
                            <AppText variant="description" className="text-xs font-bold uppercase tracking-[0.14em] text-text-muted">
                                Operator
                            </AppText>
                            <AppText variant="description" className="text-xs font-bold uppercase tracking-[0.14em] text-text-muted">
                                Month
                            </AppText>
                            <AppText variant="description" className="text-right text-xs font-bold uppercase tracking-[0.14em] text-text-muted">
                                Deduction
                            </AppText>
                        </div>

                        <div className="space-y-5">
                            {isRecentReprimandsLoading ? (
                                <AppText variant="description" className="text-sm text-text-muted">
                                    Loading reprimands...
                                </AppText>
                            ) : isRecentReprimandsError ? (
                                <AppText variant="description" className="text-sm text-red">
                                    Failed to load reprimands.
                                </AppText>
                            ) : reprimandHistoryRows.length === 0 ? (
                                <AppText variant="description" className="text-sm text-text-muted">
                                    No reprimands found.
                                </AppText>
                            ) : (
                                reprimandHistoryRows.map((entry) => (
                                    <div key={`${entry.operator}-${entry.month}`} className="grid grid-cols-3 gap-4">
                                        <AppText variant="body" className="text-base font-semibold text-text">
                                            {entry.operator}
                                        </AppText>
                                        <AppText variant="description" className="text-base text-text-secondary">
                                            {entry.month}
                                        </AppText>
                                        <span className="text-right text-base font-semibold text-red">
                                            {entry.deduction}
                                        </span>
                                    </div>
                                ))
                            )}
                        </div>

                        <button
                            type="button"
                            onClick={handleViewAllFinancialDeductions}
                            className="ml-auto flex items-center gap-2 text-sm font-semibold text-text-secondary hover:text-text-focus"
                        >
                            View All Financial Deductions
                            <ArrowRight size={16} />
                        </button>
                </div>
            </div>
        </div>
    );
}
