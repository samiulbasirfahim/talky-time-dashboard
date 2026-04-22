import React, { useState, useEffect } from "react";
import { isAxiosError } from "axios";
import { Info } from "lucide-react";
import { FormModalShell } from "../../components/form-modal-shell";
import { AppInputField } from "../../components/form-field";
import { AppPasswordField } from "../../components/password-input-field";
import { AppText } from "../../components/text";
import { useCreateGeneralManager, useUpdateGeneralManager } from "../../lib/queries";
import type { GeneralManagerValidationErrors, GeneralManagerResponse } from "../../type";

export interface GeneralManagerFormValues {
    gmId: string;
    fullName: string;
    email: string;
    password: string;
}

interface GeneralManagerModalProps {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
    editingGm?: GeneralManagerResponse | null;
}

export type GeneralManagerFieldErrors = Partial<
    Record<"gmId" | "fullName" | "email" | "password" | "general", string>
>;

const getFirstErrorMessage = (value: unknown): string | undefined => {
    if (Array.isArray(value) && value.length > 0 && typeof value[0] === "string") {
        return value[0].trim();
    }
    if (typeof value === "string") {
        return value.trim() || undefined;
    }
    return undefined;
};

export function GeneralManagerModal({
    open,
    onClose,
    onSuccess,
    editingGm,
}: GeneralManagerModalProps) {
    const isEditMode = Boolean(editingGm?.id);
    const [formValues, setFormValues] = useState<GeneralManagerFormValues>({
        gmId: "",
        fullName: "",
        email: "",
        password: "",
    });
    const [fieldErrors, setFieldErrors] = useState<GeneralManagerFieldErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { mutateAsync: createGM } = useCreateGeneralManager();
    const { mutateAsync: updateGM } = useUpdateGeneralManager();

    useEffect(() => {
        if (open && editingGm) {
            setFormValues({
                gmId: editingGm.general_manager_id,
                fullName: editingGm.name,
                email: editingGm.email,
                password: "",
            });
        } else if (open) {
            setFormValues({
                gmId: "",
                fullName: "",
                email: "",
                password: "",
            });
        }
        setFieldErrors({});
    }, [open, editingGm]);

    const validateForm = (): boolean => {
        const errors: GeneralManagerFieldErrors = {};

        if (!formValues.gmId.trim()) {
            errors.gmId = "GM ID is required";
        }

        if (!formValues.fullName.trim()) {
            errors.fullName = "General manager name is required";
        }

        if (!formValues.email.trim()) {
            errors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formValues.email)) {
            errors.email = "Please enter a valid email address";
        }

        if (!isEditMode && !formValues.password) {
            errors.password = "Password is required";
        }

        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        try {
            if (isEditMode && editingGm) {
                const payload: {
                    general_manager_id: string;
                    name: string;
                    email: string;
                    new_password?: string;
                    confirm_new_password?: string;
                } = {
                    general_manager_id: formValues.gmId.trim(),
                    name: formValues.fullName.trim(),
                    email: formValues.email.trim(),
                };

                if (formValues.password.trim()) {
                    payload.new_password = formValues.password.trim();
                    payload.confirm_new_password = formValues.password.trim();
                }

                await updateGM({
                    id: editingGm.id,
                    payload,
                });
            } else {
                await createGM({
                    general_manager_id: formValues.gmId.trim(),
                    name: formValues.fullName.trim(),
                    email: formValues.email.trim(),
                    password: formValues.password.trim(),
                });
            }

            setFieldErrors({});
            onSuccess();
            onClose();
        } catch (error) {
            if (isAxiosError<GeneralManagerValidationErrors>(error)) {
                const responseData = error.response?.data;
                const errorMsg =
                    getFirstErrorMessage(responseData?.detail) ??
                    getFirstErrorMessage(responseData?.non_field_errors) ??
                    getFirstErrorMessage(responseData?.general_manager_id) ??
                    getFirstErrorMessage(responseData?.name) ??
                    getFirstErrorMessage(responseData?.email) ??
                    getFirstErrorMessage(responseData?.password) ??
                    getFirstErrorMessage(responseData?.new_password) ??
                    getFirstErrorMessage(responseData?.confirm_new_password);

                if (errorMsg) {
                    setFieldErrors({ general: errorMsg });
                    return;
                }
            }

            setFieldErrors({
                general: isEditMode ? "Failed to update general manager" : "Failed to create general manager",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <FormModalShell
            open={open}
            onClose={onClose}
            onSubmit={handleSubmit}
            title={isEditMode ? "Edit General Manager" : "Create General Manager"}
            description={
                isEditMode
                    ? "Update the general manager information."
                    : "Onboard a General manager into the Architect ecosystem."
            }
            submitLabel={isEditMode ? (isSubmitting ? "Saving..." : "Update General Manager") : (isSubmitting ? "Creating..." : "Create General Manager")}
            submitButtonDisabled={isSubmitting}
            submitButtonLoading={isSubmitting}
            ariaLabel={isEditMode ? "Edit general manager" : "Create general manager"}
            contentClassName="max-w-3xl rounded-[22px] p-0"
        >
            {fieldErrors.general && (
                <AppText
                    variant="description"
                    className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600"
                >
                    {fieldErrors.general}
                </AppText>
            )}

            <div className="grid grid-cols-2 gap-4">
                <AppInputField
                    label="GM Id"
                    placeholder="Enter general manager id"
                    value={formValues.gmId}
                    onChange={(value) => {
                        setFormValues({ ...formValues, gmId: value });
                        setFieldErrors({ ...fieldErrors, gmId: undefined });
                    }}
                    description={fieldErrors.gmId}
                    descriptionClassName="text-red-500"
                    disabled={isEditMode}
                />

                <AppInputField
                    label="General manager Name"
                    placeholder="Enter general manager name"
                    value={formValues.fullName}
                    onChange={(value) => {
                        setFormValues({ ...formValues, fullName: value });
                        setFieldErrors({ ...fieldErrors, fullName: undefined });
                    }}
                    description={fieldErrors.fullName}
                    descriptionClassName="text-red-500"
                />
            </div>

            <AppInputField
                label="Email"
                placeholder="Enter email address"
                type="email"
                value={formValues.email}
                onChange={(value) => {
                    setFormValues({ ...formValues, email: value });
                    setFieldErrors({ ...fieldErrors, email: undefined });
                }}
                description={fieldErrors.email}
                descriptionClassName="text-red-500"
            />

            {!isEditMode && (
                <AppPasswordField
                    label="Set Password"
                    placeholder="Set a password"
                    value={formValues.password}
                    onChange={(value) => {
                        setFormValues({ ...formValues, password: value });
                        setFieldErrors({ ...fieldErrors, password: undefined });
                    }}
                    description={fieldErrors.password}
                    descriptionClassName="text-red-500"
                />
            )}

            {isEditMode && (
                <AppPasswordField
                    label="Set New Password (optional)"
                    placeholder="Leave empty to keep current password"
                    value={formValues.password}
                    onChange={(value) => {
                        setFormValues({ ...formValues, password: value });
                        setFieldErrors({ ...fieldErrors, password: undefined });
                    }}
                    description={fieldErrors.password}
                    descriptionClassName="text-red-500"
                />
            )}

            <div className="flex items-start gap-3 rounded-lg border border-border bg-bg-secondary px-4 py-3">
                <Info size={24} className="mt-0.5 text-text-focus" />
                <AppText variant="description" className="text-base leading-7 text-text-secondary">
                    {isEditMode
                        ? "Leave password field empty to keep the current password."
                        : "General managers will receive an automated invitation to set their initial password and access the Talkytime Dashboard."}
                </AppText>
            </div>
        </FormModalShell>
    );
}
