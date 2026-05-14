import { UserPlus } from "lucide-react";
import { isAxiosError } from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { HeaderSection } from "../../components/header-section";
import { useAppModal } from "../../hooks/useAppModal";
import { useCreateAdmin, useDeleteAdmin, useMe } from "../../lib/queries";
import { isReadOnlyRole } from "../../lib/access-control";
import type { AdminCreateValidationErrors } from "../../type";
import { CreateAdminModal, type CreateAdminFormValues } from "./create-admin-modal";
import { ManagementTable, type ManagementRow } from "./managemenet-table";

export function ManagementPage() {
    const adminModal = useAppModal();
    const [editingAdmin, setEditingAdmin] = useState<ManagementRow | null>(null);
    const { data: meData } = useMe();
    const isReadOnly = isReadOnlyRole(meData?.data.role);
    const { mutateAsync: createAdmin } = useCreateAdmin();
    const { mutateAsync: deleteAdmin } = useDeleteAdmin()

    const getFirstErrorMessage = (value: unknown): string | undefined => {
        if (Array.isArray(value) && value.length > 0 && typeof value[0] === "string") {
            return value[0];
        }

        if (typeof value === "string") {
            return value;
        }

        return undefined;
    };

    const handleOpenCreateAdmin = () => {
        setEditingAdmin(null);
        adminModal.openModal();
    };

    const handleEditAdmin = (admin: ManagementRow) => {
        setEditingAdmin(admin);
        adminModal.openModal();
    };

    const handleCloseAdminModal = () => {
        adminModal.closeModal();
        setEditingAdmin(null);
    };

    const handleCreateAdmin = async (values: CreateAdminFormValues) => {
        if (editingAdmin) {
            toast.success("Admin updated successfully.");
            return null;
        }

        try {
            await createAdmin({
                full_name: values.fullName.trim(),
                email: values.email.trim(),
                password: values.password,
            });

            toast.success("Admin created successfully.");
            return null;
        } catch (error) {
            if (isAxiosError<AdminCreateValidationErrors>(error)) {
                const apiErrors = error.response?.data;
                const emailError = getFirstErrorMessage(apiErrors?.email);
                const normalizedEmailError = emailError?.toLowerCase() ?? "";
                const isUniqueEmailError =
                    normalizedEmailError.includes("already") ||
                    normalizedEmailError.includes("exists") ||
                    normalizedEmailError.includes("unique");

                return {
                    fullName: getFirstErrorMessage(apiErrors?.full_name),
                    email: isUniqueEmailError ? "This email is already in use." : emailError,
                    password: getFirstErrorMessage(apiErrors?.password),
                    general:
                        getFirstErrorMessage(apiErrors?.detail) ??
                        getFirstErrorMessage(apiErrors?.non_field_errors),
                };
            }

            return {
                general: "Failed to create admin. Please try again.",
            };
        }
    };

    return <div>
        <HeaderSection title="Management" description="Manage system administrators and security settings"
            buttons={
                isReadOnly
                    ? []
                    : [
                        {
                            label: "Create New Admin",
                            icon: UserPlus,
                            onClick: handleOpenCreateAdmin,
                        },
                    ]
            }
        />
        <div className="p-4">
            <ManagementTable
                showActions={!isReadOnly}
                onEditAdmin={isReadOnly ? undefined : handleEditAdmin}
                onDeleteAdmin={
                    isReadOnly
                        ? undefined
                        : (ID) => {
                            deleteAdmin(ID.id);
                        }
                }
            />
        </div>

        <CreateAdminModal
            open={adminModal.isOpen}
            onClose={handleCloseAdminModal}
            mode={editingAdmin ? "edit" : "create"}
            initialValues={editingAdmin ? { fullName: editingAdmin.name, email: editingAdmin.email } : undefined}
            onSubmit={handleCreateAdmin}
        />
    </div>
}