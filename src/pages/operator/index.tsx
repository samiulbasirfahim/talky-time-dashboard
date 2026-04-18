import React from "react";
import { isAxiosError } from "axios";
import { UserPlus } from "lucide-react";
import toast from "react-hot-toast";
import { HeaderSection } from "../../components/header-section";
import { useAppModal } from "../../hooks/useAppModal";
import {
    useCreateOperator,
    useDeleteOperator,
    useUpdateOperator,
} from "../../lib/queries";
import type {
    CreateOperatorPayload,
    OperatorCreateValidationErrors,
    OperatorResponse,
    UpdateOperatorPayload,
} from "../../type";
import {
    OperatorFormModal,
    type OperatorFormFieldErrors,
    type OperatorFormValues,
} from "./operator-form-modal";
import { OperatorCards } from "./operator-cards";
import {
    OperatorsTable,
} from "./operataor-table";

function getFirstErrorMessage(value: unknown): string | undefined {
    if (Array.isArray(value) && value.length > 0 && typeof value[0] === "string") {
        return value[0];
    }
    if (typeof value === "string") {
        return value;
    }
    return undefined;
}

type OperatorDeleteErrorResponse = {
    detail?: string | string[];
    non_field_errors?: string[];
};

export function Operator() {
    const operatorModal = useAppModal();
    const { mutateAsync: createOperator } = useCreateOperator();
    const { mutateAsync: updateOperator } = useUpdateOperator();
    const { mutateAsync: deleteOperator } = useDeleteOperator();
    const [editingOperator, setEditingOperator] = React.useState<OperatorResponse | null>(null);

    const handleOpenCreateOperator = () => {
        setEditingOperator(null);
        operatorModal.openModal();
    };

    const handleOpenEditOperator = (operator: OperatorResponse) => {
        setEditingOperator(operator);
        operatorModal.openModal();
    };

    const handleCloseOperatorModal = () => {
        operatorModal.closeModal();
        setEditingOperator(null);
    };

    const handleDeleteOperator = async (operatorId: number) => {
        try {
            await deleteOperator(operatorId);
            toast.success("Operator deleted successfully.");

            if (editingOperator?.id === operatorId) {
                handleCloseOperatorModal();
            }
        } catch (error) {
            if (isAxiosError<OperatorDeleteErrorResponse>(error)) {
                const apiMessage =
                    getFirstErrorMessage(error.response?.data?.detail) ??
                    getFirstErrorMessage(error.response?.data?.non_field_errors);

                if (apiMessage) {
                    toast.error(apiMessage);
                    return;
                }
            }

            toast.error("Failed to delete operator. Please try again.");
        }
    };

    const handleSubmitOperator = async (
        values: OperatorFormValues,
    ): Promise<OperatorFormFieldErrors | null> => {
        const localValidationErrors: OperatorFormFieldErrors = {};
        if (!values.operatorName.trim()) {
            localValidationErrors.operatorName = "Operator name is required.";
        }
        if (!values.operatorId.trim()) {
            localValidationErrors.operatorId = "Operator ID is required.";
        }
        if (!values.groupId) {
            localValidationErrors.groupId = "Please select a group.";
        }

        if (Object.keys(localValidationErrors).length > 0) {
            return localValidationErrors;
        }

        const groupAsNumber = Number(values.groupId);
        if (Number.isNaN(groupAsNumber)) {
            return {
                groupId: "Please select a valid group.",
            };
        }

        try {
            if (editingOperator) {
                const payload: UpdateOperatorPayload = {
                    operator_id: values.operatorId.trim(),
                    full_name: values.operatorName.trim(),
                    group: groupAsNumber,
                    shift: values.shift === "day" ? "DAY" : "NIGHT",
                };

                await updateOperator({
                    id: editingOperator.id,
                    payload,
                });

                toast.success("Operator updated successfully.");
            } else {
                const payload: CreateOperatorPayload = {
                    operator_id: values.operatorId.trim(),
                    full_name: values.operatorName.trim(),
                    group: groupAsNumber,
                    shift: values.shift === "day" ? "DAY" : "NIGHT",
                };

                await createOperator(payload);
                toast.success("Operator created successfully.");
            }

            return null;
        } catch (error) {
            if (isAxiosError<OperatorCreateValidationErrors>(error)) {
                const apiErrors = error.response?.data;
                const mappedErrors: OperatorFormFieldErrors = {};

                if (apiErrors && typeof apiErrors === "object") {
                    mappedErrors.operatorId = getFirstErrorMessage(apiErrors.operator_id);
                    mappedErrors.operatorName = getFirstErrorMessage(apiErrors.full_name);
                    mappedErrors.groupId = getFirstErrorMessage(apiErrors.group);
                    mappedErrors.shift = getFirstErrorMessage(apiErrors.shift);
                }

                if (Object.keys(mappedErrors).length > 0) {
                    return mappedErrors;
                }
            }

            toast.error(
                editingOperator
                    ? "Failed to update operator. Please try again."
                    : "Failed to create operator. Please try again.",
            );
            return {
                operatorId: editingOperator
                    ? "Failed to update operator. Please try again."
                    : "Failed to create operator. Please try again.",
            };
        }
    };

    const defaultValues: Partial<OperatorFormValues> | undefined = editingOperator
        ? {
            operatorName: editingOperator.full_name || editingOperator.operator_name,
            operatorId: editingOperator.operator_id,
            groupId: String(editingOperator.group ?? ""),
            shift: editingOperator.shift === "NIGHT" ? "night" : "day",
            supervisorName: "",
        }
        : undefined;

    return (
        <>
            <HeaderSection
                title="Operator"
                description={`Manage, monitor, and optimize your global workforce.`}
                buttons={[
                    {
                        label: "Add New Operator",
                        icon: UserPlus,
                        onClick: handleOpenCreateOperator,
                    },
                ]}
            />
            <OperatorCards />

            <OperatorsTable
                onEditOperator={handleOpenEditOperator}
                onDeleteOperator={handleDeleteOperator}
            />

            <OperatorFormModal
                open={operatorModal.isOpen}
                onClose={handleCloseOperatorModal}
                onSubmit={handleSubmitOperator}
                mode={editingOperator ? "edit" : "create"}
                defaultValues={defaultValues}
            />
        </>
    );
}
