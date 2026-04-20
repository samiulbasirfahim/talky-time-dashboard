import { isAxiosError } from "axios";
import { UserPlus } from "lucide-react";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { HeaderSection } from "../../components/header-section";
import { useAppModal } from "../../hooks/useAppModal";
import { useCreateSupervisor, useDeleteSupervisor, useMe, useUpdateSupervisor } from "../../lib/queries";
import type {
    CreateSupervisorPayload,
    SupervisorCreateValidationErrors,
    SupervisorResponse,
    UpdateSupervisorPayload,
} from "../../type";
import {
    CreateSupervisorModal,
    type CreateSupervisorFormFieldErrors,
    type CreateSupervisorFormValues,
} from "./create-supervisor-modal";
import { SuperVisorsCard } from "./supervisors-card";
import { SupervisorsTable } from "./supervisors-table";
import { TotalGroup } from "./total-group";

function getFirstErrorMessage(value: unknown): string | undefined {
    if (Array.isArray(value) && value.length > 0 && typeof value[0] === "string") {
        return value[0];
    }
    if (typeof value === "string") {
        return value;
    }
    return undefined;
}

function splitName(fullName: string): { firstName: string; lastName: string } {
    const normalized = fullName.trim().replace(/\s+/g, " ");
    const parts = normalized.split(" ").filter(Boolean);

    if (parts.length === 0) {
        return { firstName: "", lastName: "" };
    }

    return {
        firstName: parts[0],
        lastName: parts.slice(1).join(" "),
    };
}

export function Supervisors() {
    const createSupervisorModal = useAppModal();
    const { mutateAsync: createSupervisor } = useCreateSupervisor();
    const { mutateAsync: updateSupervisor } = useUpdateSupervisor();
    const { mutateAsync: deleteSupervisor } = useDeleteSupervisor();

    const { data: me } = useMe();

    const [editingSupervisor, setEditingSupervisor] = useState<SupervisorResponse | null>(null);

    const isEditMode = Boolean(editingSupervisor);

    const modalInitialValues = useMemo<CreateSupervisorFormValues | undefined>(() => {
        if (!editingSupervisor) {
            return undefined;
        }

        const supervisorName =
            editingSupervisor.supervisor_name ||
            editingSupervisor.name ||
            `${editingSupervisor.first_name} ${editingSupervisor.last_name}`.trim();

        return {
            supervisorName,
            supervisorId: editingSupervisor.supervisor_id,
            email: editingSupervisor.email,
            password: "",
            groupId: String(editingSupervisor.assigned_group ?? ""),
            operatorIds: (editingSupervisor.operators ?? []).map((operatorId) => String(operatorId)),
            shift: editingSupervisor.shift === "NIGHT" ? "night" : "day",
        };
    }, [editingSupervisor]);

    const openCreateSupervisorModal = () => {
        setEditingSupervisor(null);
        createSupervisorModal.openModal();
    };

    const handleEditSupervisor = (supervisor: SupervisorResponse) => {
        setEditingSupervisor(supervisor);
        createSupervisorModal.openModal();
    };

    const handleCloseSupervisorModal = () => {
        createSupervisorModal.closeModal();
        setEditingSupervisor(null);
    };

    const handleDeleteSupervisor = async (id: number) => {
        try {
            await deleteSupervisor(id);
            toast.success("Supervisor deleted successfully.");

            if (editingSupervisor?.id === id) {
                handleCloseSupervisorModal();
            }
        } catch {
            toast.error("Failed to delete supervisor. Please try again.");
        }
    };

    const handleCreateSupervisor = async (
        values: CreateSupervisorFormValues,
    ): Promise<CreateSupervisorFormFieldErrors | null> => {
        const localErrors: CreateSupervisorFormFieldErrors = {};

        if (!values.supervisorName.trim()) {
            localErrors.supervisorName = "Supervisor name is required.";
        }
        if (!values.email.trim()) {
            localErrors.email = "Email is required.";
        }
        if (!isEditMode && !values.password.trim()) {
            localErrors.password = "Password is required.";
        }
        if (!values.supervisorId.trim()) {
            localErrors.supervisorId = "Supervisor ID is required.";
        }
        if (!values.groupId) {
            localErrors.groupId = "Assigned group is required.";
        }

        if (Object.keys(localErrors).length > 0) {
            return localErrors;
        }

        const assignedGroup = Number(values.groupId);
        if (Number.isNaN(assignedGroup)) {
            return {
                groupId: "Assigned group must be a valid ID.",
            };
        }

        const parsedName = splitName(values.supervisorName);
        const operatorIds = values.operatorIds
            .map((id) => Number(id))
            .filter((id) => Number.isFinite(id));

        try {
            if (editingSupervisor) {
                const payload: UpdateSupervisorPayload = {
                    name: values.supervisorName.trim(),
                    supervisor_name: values.supervisorName.trim(),
                    first_name: parsedName.firstName,
                    email: values.email.trim(),
                    supervisor_id: values.supervisorId.trim(),
                    assigned_group: assignedGroup,
                    shift: values.shift === "day" ? "DAY" : "NIGHT",
                    operators: operatorIds,
                };

                if (values.password.trim()) {
                    payload.password = values.password;
                }

                await updateSupervisor({
                    id: editingSupervisor.id,
                    payload,
                });

                toast.success("Supervisor updated successfully.");
            } else {
                const payload: CreateSupervisorPayload = {
                    name: values.supervisorName.trim(),
                    supervisor_name: values.supervisorName.trim(),
                    first_name: parsedName.firstName,
                    last_name: parsedName.lastName,
                    email: values.email.trim(),
                    password: values.password,
                    supervisor_id: values.supervisorId.trim(),
                    assigned_group: assignedGroup,
                    shift: values.shift === "day" ? "DAY" : "NIGHT",
                    operators: operatorIds,
                };

                await createSupervisor(payload);
                toast.success("Supervisor created successfully.");
            }

            return null;
        } catch (error) {
            if (isAxiosError<SupervisorCreateValidationErrors>(error)) {
                const apiErrors = error.response?.data;
                const mappedErrors: CreateSupervisorFormFieldErrors = {};

                if (apiErrors && typeof apiErrors === "object") {
                    mappedErrors.email = getFirstErrorMessage(apiErrors.email);
                    mappedErrors.password = getFirstErrorMessage(apiErrors.password);
                    mappedErrors.supervisorId = getFirstErrorMessage(apiErrors.supervisor_id);
                    mappedErrors.groupId = getFirstErrorMessage(apiErrors.assigned_group);
                    mappedErrors.shift = getFirstErrorMessage(apiErrors.shift);
                    mappedErrors.supervisorName =
                        getFirstErrorMessage(apiErrors.name) ??
                        getFirstErrorMessage(apiErrors.supervisor_name) ??
                        getFirstErrorMessage(apiErrors.first_name) ??
                        getFirstErrorMessage(apiErrors.last_name);
                    mappedErrors.general =
                        getFirstErrorMessage(apiErrors.detail) ??
                        getFirstErrorMessage(apiErrors.non_field_errors);
                }

                if (Object.keys(mappedErrors).length > 0) {
                    return mappedErrors;
                }
            }

            toast.error(
                isEditMode
                    ? "Failed to update supervisor. Please try again."
                    : "Failed to create supervisor. Please try again.",
            );
            return {
                general: isEditMode
                    ? "Failed to update supervisor. Please try again."
                    : "Failed to create supervisor. Please try again.",
            };
        }
    };

    return (
        <div>
            <HeaderSection
                title="Supervisors"
                description={`Orchestrate your operator teams and leadership hierarchy.`}
                buttons={
                    me?.data.is_supervisor ? []
                        : [
                            {
                                label: "Create Supervisor",
                                icon: UserPlus,
                                onClick: openCreateSupervisorModal,
                            },
                        ]
                }
            />
            <SuperVisorsCard />
            <SupervisorsTable
                onEditSupervisor={handleEditSupervisor}
                onDeleteSupervisor={handleDeleteSupervisor}
            />
            <TotalGroup isAdminView={!me?.data.is_supervisor}  />

            <CreateSupervisorModal
                open={createSupervisorModal.isOpen}
                onClose={handleCloseSupervisorModal}
                mode={isEditMode ? "edit" : "create"}
                initialValues={modalInitialValues}
                onSubmit={handleCreateSupervisor}
            />
        </div>
    );
}
