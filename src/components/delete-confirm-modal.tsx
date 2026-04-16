import { AppButton } from "./button";
import { AppModal } from "./modal";
import { AppText } from "./text";

interface DeleteConfirmModalProps {
    open: boolean;
    onCancel: () => void;
    onConfirm: () => void;
    title?: string;
    description?: string;
    confirmText?: string;
    cancelText?: string;
    ariaLabel?: string;
    contentClassName?: string;
}

export function DeleteConfirmModal({
    open,
    onCancel,
    onConfirm,
    title = "Delete this row?",
    description = "This action cannot be undone.",
    confirmText = "Confirm",
    cancelText = "Cancel",
    ariaLabel = "Confirm delete",
    contentClassName = "max-w-sm p-5",
}: DeleteConfirmModalProps) {
    return (
        <AppModal
            open={open}
            onClose={onCancel}
            ariaLabel={ariaLabel}
            contentClassName={contentClassName}
        >
            <AppText variant="smallHeader" className="text-center text-lg">
                {title}
            </AppText>
            <AppText variant="description" className="mt-2 text-center">
                {description}
            </AppText>

            <div className="mt-5 flex items-center justify-center gap-2">
                <AppButton
                    type="button"
                    onClick={onCancel}
                    variant="outline"
                    size="sm"
                >
                    {cancelText}
                </AppButton>
                <AppButton
                    type="button"
                    onClick={onConfirm}
                    variant="danger"
                    size="sm"
                >
                    {confirmText}
                </AppButton>
            </div>
        </AppModal>
    );
}
