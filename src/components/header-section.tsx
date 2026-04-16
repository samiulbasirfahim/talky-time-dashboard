import type { LucideIcon } from "lucide-react";
import { AppText } from "./text";
import { AppButton } from "./button";

type Props = {
    title: string;
    description: string;
    buttons: {
        label: string;
        icon: LucideIcon;
        onClick: () => void;
    }[];
};

export function HeaderSection({ title, description, buttons }: Props) {
    return (
        <div className="flex flex-row justify-between items-center px-4 py-3">
            <div className="space-y-2 w-full">
                <AppText variant="largeHeader">{title}</AppText>
                <AppText className="w-2/3" variant="description">
                    {description}
                </AppText>
            </div>
            <div className="flex flex-row space-x-2 shrink-0">
                {buttons.map((button, index) => (
                    <AppButton
                        variant={index % 2 === 0 ? "focus" : "outline"}
                        prefixIcon={button.icon}
                        onClick={button.onClick}
                        key={index}
                    >
                        {button.label}
                    </AppButton>
                ))}
            </div>
        </div>
    );
}
