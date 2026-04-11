import type { LucideIcon } from "lucide-react";
import { NavLink } from "react-router";

export type ButtonGroupProps = {
    buttons: Button[];
    label: string;
};

type Button = {
    label: string;
    route: string;
    icon: LucideIcon;
};

export function ButtonGroup({ buttons, label }: ButtonGroupProps) {
    return (
        <div
            className="mt-5 px-4 flex flex-col grow"
        >
            <div className="text-xs font-semibold text-text-secondary mb-2 opacity-70">
                {label}
            </div>
            <div className="flex flex-col space-y-1">
                {buttons.map((button) => (
                    <NavLink
                        key={button.route}
                        to={button.route}
                        className={({ isActive }) =>
                            `flex items-center px-3 py-2 rounded-md text-sm leading-tight font-medium ${!isActive
                                ? "bg-bg text-text-secondary"
                                : "text-text-focus bg-bg-focus"
                            }`
                        }
                    >
                        {({ isActive }) => {
                            return (
                                <>
                                    <button.icon className="w-4 h-4" />
                                    <span className="ml-2">{button.label}</span>
                                    {isActive && (
                                        <div className="bg-text-focus w-2 h-2 rounded-full ml-auto shrink-0" />
                                    )}
                                </>
                            );
                        }}
                    </NavLink>
                ))}
            </div>
        </div>
    );
}
