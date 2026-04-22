import type { LucideIcon } from "lucide-react";
import { AppText } from "./text";
import { AppButton } from "./button";
import type { ReactNode } from "react";
import { head } from "motion/react-client";

type Props = {
    title: string;
    description: string;
    buttons: {
        label: string;
        icon: LucideIcon;
        onClick: () => void;
        isLoading?: boolean;
        loadingLabel?: string;
        disabled?: boolean;
    }[];
    headerRight?: ReactNode;

};

export function HeaderSection({ title, description, buttons, headerRight }: Props) {
    return (
        <div className="flex flex-row justify-between items-center px-4 py-3">
            <div className="space-y-2 w-full">
                <AppText variant="largeHeader">{title}</AppText>
                <AppText className="w-2/3" variant="description">
                    {description}
                </AppText>
            </div>
            <div className="flex flex-row space-x-2 shrink-0">
                {headerRight ? (
                    <>{headerRight}</>
                ) : buttons.map((button, index) => (
                    <AppButton
                        variant={index % 2 === 0 ? "focus" : "outline"}
                        prefixIcon={button.icon}
                        onClick={button.onClick}
                        isLoading={button.isLoading}
                        loadingLabel={button.loadingLabel}
                        disabled={button.disabled}
                        key={index}
                    >
                        {button.label}
                    </AppButton>
                ))}
            </div>
        </div>
    );
}
