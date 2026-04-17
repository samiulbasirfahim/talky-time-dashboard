import React from "react";
import { isAxiosError } from "axios";
import { UserPlus } from "lucide-react";
import toast from "react-hot-toast";
import { HeaderSection } from "../../components/header-section";
import { useAppModal } from "../../hooks/useAppModal";
import { useCreateOperator } from "../../lib/queries";
import type {
    CreateOperatorPayload,
    OperatorCreateValidationErrors,
} from "../../type";
import {
    OperatorFormModal,
    type OperatorFormFieldErrors,
    type OperatorFormValues,
} from "./operator-form-modal";
import { OperatorCards } from "./operator-cards";
import {
    INITIAL_OPERATOR_DATA,
    OperatorsTable,
    type Operator,
} from "./operataor-table";

const GROUP_ID_TO_LABEL: Record<string, Operator["group"]> = {
    medellin: "Medellin",
    bogota: "Bogota",
    remote: "Remote",
};

const GROUP_LABEL_TO_ID: Record<string, string> = {
    medellin: "medellin",
    bogota: "bogota",
    remote: "remote",
};

const GROUP_COLOR_BY_ID: Record<string, Operator["groupColor"]> = {
    medellin: "blue",
    bogota: "blue-light",
    remote: "gray",
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

function mapGroupColor(groupName: string): Operator["groupColor"] {
    const normalized = groupName.toLowerCase();
    if (normalized.includes("medellin")) {
        return "blue";
    }
    if (normalized.includes("bogota")) {
        return "blue-light";
    }
    return "gray";
}

function mapStatus(status: string): Operator["status"] {
    if (status === "active" || status === "inactive" || status === "pending") {
        return status;
    }
    return "inactive";
}

export function Operator() {
    const operatorModal = useAppModal();
    const { mutateAsync: createOperator } = useCreateOperator();
    const [operators, setOperators] = React.useState<Operator[]>(INITIAL_OPERATOR_DATA);
    const [editingOperator, setEditingOperator] = React.useState<Operator | null>(null);

    const handleOpenCreateOperator = () => {
        setEditingOperator(null);
        operatorModal.openModal();
    };

    const handleOpenEditOperator = (operator: Operator) => {
        setEditingOperator(operator);
        operatorModal.openModal();
    };

    const handleCloseOperatorModal = () => {
        operatorModal.closeModal();
        setEditingOperator(null);
    };

    const handleDeleteOperator = (operatorId: string) => {
        setOperators((prev) => prev.filter((operator) => operator.id !== operatorId));
        toast.success("Operator removed successfully.");
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

        const normalizedGroupId = values.groupId || "remote";
        const updatedFields = {
            name: values.operatorName,
            id: values.operatorId || `OP-${Math.floor(Math.random() * 9000) + 1000}`,
            group: GROUP_ID_TO_LABEL[normalizedGroupId] || "Remote",
            groupColor: GROUP_COLOR_BY_ID[normalizedGroupId] || "gray",
            shift: values.shift,
            supervisorName: values.supervisorName || "",
        };

        if (editingOperator) {
            setOperators((prev) =>
                prev.map((operator) =>
                    operator.id === editingOperator.id
                        ? { ...operator, ...updatedFields }
                        : operator,
                ),
            );
            toast.success("Operator updated successfully.");
            return null;
        }

        const groupAsNumber = Number(values.groupId);
        if (Number.isNaN(groupAsNumber)) {
            return {
                groupId: "Please select a valid group.",
            };
        }

        const payload: CreateOperatorPayload = {
            operator_id: values.operatorId.trim(),
            full_name: values.operatorName.trim(),
            group: groupAsNumber,
            shift: values.shift === "day" ? "DAY" : "NIGHT",
        };

        try {
            const createdOperator = await createOperator(payload);
            const nextOperator: Operator = {
                id: createdOperator.operator_id,
                name: createdOperator.full_name || createdOperator.operator_name,
                group: createdOperator.group_name || "Unknown Group",
                groupColor: mapGroupColor(createdOperator.group_name || ""),
                shift: createdOperator.shift === "DAY" ? "day" : "night",
                supervisorName: "",
                activeProfiles: [],
                totalBonuses: createdOperator.total_bonus_usd ?? 0,
                status: mapStatus(createdOperator.status),
            };

            setOperators((prev) => [nextOperator, ...prev]);
            toast.success("Operator created successfully.");
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

            toast.error("Failed to create operator. Please try again.");
            return {
                operatorId: "Failed to create operator. Please try again.",
            };
        }
    };

    const defaultValues: Partial<OperatorFormValues> | undefined = editingOperator
        ? {
            operatorName: editingOperator.name,
            operatorId: editingOperator.id,
            groupId:
                GROUP_LABEL_TO_ID[editingOperator.group.toLowerCase()] || "remote",
            shift: editingOperator.shift,
            supervisorName: editingOperator.supervisorName || "",
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
                operators={operators}
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
