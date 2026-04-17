import { AppButton } from "./button";
import { AppModal } from "./modal";
import { AppText } from "./text";

interface DeleteConfirmModalProps {
    open: boolean;
    onCancel: () => void;
    onConfirm: () => void | Promise<void>;
    title?: string;
    description?: string;
    confirmText?: string;
    confirmLoadingText?: string;
    cancelText?: string;
    ariaLabel?: string;
    contentClassName?: string;
    isConfirming?: boolean;
}

export function DeleteConfirmModal({
    open,
    onCancel,
    onConfirm,
    title = "Delete this row?",
    description = "This action cannot be undone.",
    confirmText = "Confirm",
    confirmLoadingText = "Deleting...",
    cancelText = "Cancel",
    ariaLabel = "Confirm delete",
    contentClassName = "max-w-sm p-5",
    isConfirming = false,
}: DeleteConfirmModalProps) {
    return (
        <AppModal
            open={open}
            onClose={isConfirming ? () => { } : onCancel}
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
                    disabled={isConfirming}
                >
                    {cancelText}
                </AppButton>
                <AppButton
                    type="button"
                    onClick={onConfirm}
                    variant="danger"
                    size="sm"
                    isLoading={isConfirming}
                    loadingLabel={confirmLoadingText}
                >
                    {confirmText}
                </AppButton>
            </div>
        </AppModal>
    );
}
