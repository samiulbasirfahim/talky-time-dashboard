import { useCallback, useState } from "react";

export function useAppModal(defaultOpen = false) {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    const openModal = useCallback(() => {
        setIsOpen(true);
    }, []);

    const closeModal = useCallback(() => {
        setIsOpen(false);
    }, []);

    return {
        isOpen,
        openModal,
        closeModal,
        setIsOpen,
    };
}
