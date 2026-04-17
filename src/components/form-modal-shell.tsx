import type React from "react";
import { AppButton } from "./button";
import { AppModal } from "./modal";
import { AppText } from "./text";

interface FormModalShellProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
    title: string;
    description: string;
    submitLabel: string;
    cancelLabel?: string;
    ariaLabel: string;
    children: React.ReactNode;
    contentClassName?: string;
    bodyClassName?: string;
    footerClassName?: string;
    submitButtonClassName?: string;
    submitButtonDisabled?: boolean;
    submitButtonLoading?: boolean;
}

export function FormModalShell({
    open,
    onClose,
    onSubmit,
    title,
    description,
    submitLabel,
    cancelLabel = "Cancel",
    ariaLabel,
    children,
    contentClassName = "max-w-3xl rounded-[22px] p-0",
    bodyClassName = "space-y-6 px-6 py-6",
    footerClassName = "flex items-center justify-end gap-3 bg-border px-6 py-4 rounded-b-xl",
    submitButtonClassName = "min-w-40",
    submitButtonDisabled = false,
    submitButtonLoading = false,
}: FormModalShellProps) {
    return (
        <AppModal
            open={open}
            onClose={onClose}
            showX
            ariaLabel={ariaLabel}
            contentClassName={contentClassName}
        >
            <div className="border-b border-border px-6 pb-5 pt-6">
                <AppText variant="header">{title}</AppText>
                <AppText variant="description" className="mt-1 text-3xl text-[#5E708A]">
                    {description}
                </AppText>
            </div>

            <form onSubmit={onSubmit}>
                <div className={bodyClassName}>{children}</div>

                <div className={footerClassName}>
                    <AppButton type="button" variant="outline" size="md" onClick={onClose}>
                        {cancelLabel}
                    </AppButton>
                    <AppButton
                        type="submit"
                        variant="focus"
                        size="md"
                        className={submitButtonClassName}
                        disabled={submitButtonDisabled}
                        isLoading={submitButtonLoading}
                        loadingLabel={submitLabel}
                    >
                        {submitLabel}
                    </AppButton>
                </div>
            </form>
        </AppModal>
    );
}
