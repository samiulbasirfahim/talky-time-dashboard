import React from "react";
import { AppInputField } from "../../components/form-field";
import { FormModalShell } from "../../components/form-modal-shell";
import { AppPasswordField } from "../../components/password-input-field";
import { AppText } from "../../components/text";

export interface CreateAdminFormValues {
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
}

export type CreateAdminFormErrors = Partial<Record<"fullName" | "email" | "password" | "confirmPassword" | "general", string>>;

type CreateAdminModalMode = "create" | "edit";

type CreateAdminModalInitialValues = Pick<CreateAdminFormValues, "fullName" | "email">;

interface CreateAdminModalProps {
    open: boolean;
    onClose: () => void;
    mode?: CreateAdminModalMode;
    initialValues?: Partial<CreateAdminModalInitialValues>;
    onSubmit?: (values: CreateAdminFormValues) => Promise<CreateAdminFormErrors | null> | CreateAdminFormErrors | null;
}

const INITIAL_VALUES: CreateAdminFormValues = {
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function CreateAdminModal({ open, onClose, mode = "create", initialValues, onSubmit }: CreateAdminModalProps) {
    const [formValues, setFormValues] = React.useState<CreateAdminFormValues>(INITIAL_VALUES);
    const [fieldErrors, setFieldErrors] = React.useState<CreateAdminFormErrors>({});
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    React.useEffect(() => {
        if (!open) {
            return;
        }

        setFormValues({
            ...INITIAL_VALUES,
            fullName: initialValues?.fullName ?? "",
            email: initialValues?.email ?? "",
        });
        setFieldErrors({});
    }, [initialValues, open]);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const nextErrors: CreateAdminFormErrors = {};

        if (!formValues.fullName.trim()) {
            nextErrors.fullName = "Full name is required.";
        }

        if (!formValues.email.trim()) {
            nextErrors.email = "Email is required.";
        } else if (!EMAIL_REGEX.test(formValues.email)) {
            nextErrors.email = "Please enter a valid email address.";
        }

        const isEditMode = mode === "edit";
        const hasPasswordValue = Boolean(formValues.password.trim());
        const hasConfirmPasswordValue = Boolean(formValues.confirmPassword.trim());

        if (!isEditMode && !hasPasswordValue) {
            nextErrors.password = "Password is required.";
        }

        if (hasPasswordValue && !hasConfirmPasswordValue) {
            nextErrors.confirmPassword = "Please confirm your password.";
        }

        if (!hasPasswordValue && hasConfirmPasswordValue) {
            nextErrors.password = "Enter a password first.";
        }

        if (hasPasswordValue && hasConfirmPasswordValue && formValues.password !== formValues.confirmPassword) {
            nextErrors.confirmPassword = "Passwords do not match.";
        }

        if (Object.keys(nextErrors).length > 0) {
            setFieldErrors(nextErrors);
            return;
        }

        setIsSubmitting(true);
        let submitErrors: CreateAdminFormErrors | null = null;
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

    return (
        <FormModalShell
            open={open}
            onClose={onClose}
            onSubmit={handleSubmit}
            title={mode === "edit" ? "Edit Admin" : "Create New Admin"}
            description={
                mode === "edit"
                    ? "Update administrator identity and access credentials."
                    : "Configure system access and identity for a new administrator."
            }
            submitLabel={
                mode === "edit"
                    ? (isSubmitting ? "Saving..." : "Save Changes")
                    : (isSubmitting ? "Creating..." : "Create Admin")
            }
            submitButtonDisabled={isSubmitting}
            submitButtonLoading={isSubmitting}
            ariaLabel={mode === "edit" ? "Edit admin" : "Create admin"}
            contentClassName="max-w-4xl rounded-[22px] p-0"
        >
            {fieldErrors.general && (
                <AppText variant="description" className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
                    {fieldErrors.general}
                </AppText>
            )}

            <div className="grid grid-cols-1 gap-4">
                <AppInputField
                    label="Full Name"
                    value={formValues.fullName}
                    onChange={(value) => {
                        setFormValues((prev) => ({ ...prev, fullName: value }));
                        setFieldErrors((prev) => ({ ...prev, fullName: undefined }));
                    }}
                    placeholder="Enter administrator name"
                    description={fieldErrors.fullName}
                    descriptionClassName="text-red-500"
                    inputClassName="h-11"
                />

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
                    inputClassName="h-11"
                />

                <AppPasswordField
                    label={mode === "edit" ? "Set Password (Optional)" : "Password"}
                    value={formValues.password}
                    onChange={(value) => {
                        setFormValues((prev) => ({ ...prev, password: value }));
                        setFieldErrors((prev) => ({ ...prev, password: undefined }));
                    }}
                    autoComplete="new-password"
                    placeholder="Set your password"
                    description={fieldErrors.password}
                    descriptionClassName="text-red-500"
                    inputClassName="h-11"
                    toggleAriaLabel="Toggle admin password visibility"
                />

                <AppPasswordField
                    label={mode === "edit" ? "Confirm Password (Optional)" : "Confirm Password"}
                    value={formValues.confirmPassword}
                    onChange={(value) => {
                        setFormValues((prev) => ({ ...prev, confirmPassword: value }));
                        setFieldErrors((prev) => ({ ...prev, confirmPassword: undefined }));
                    }}
                    autoComplete="new-password"
                    placeholder="Confirm your password"
                    description={fieldErrors.confirmPassword}
                    descriptionClassName="text-red-500"
                    inputClassName="h-11"
                    toggleAriaLabel="Toggle admin confirm password visibility"
                />
            </div>
        </FormModalShell>
    );
}