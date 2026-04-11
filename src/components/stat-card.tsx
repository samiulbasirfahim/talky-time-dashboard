import { type LucideIcon } from "lucide-react";
import { AppText } from "./text"; // Adjust path as needed

export type StatCardProps = {
    title: string; // e.g., "$2,550"
    description: string; // e.g., "Total Bonuses Today"
    cardBackground: string; // Tailwind class like "bg-blue-50/50"
    icon: LucideIcon;
    iconBackground: string;
    iconColor: string;
    badge?: string;
    badgeBackground?: string;
    badgeTextColor?: string;
    badgePrefixIcon?: LucideIcon;
};

export function StatCard({
    title,
    description,
    badge,
    badgeBackground,
    badgeTextColor,
    cardBackground,
    icon: Icon,
    iconBackground,
    iconColor,
    badgePrefixIcon: BadgeIcon,
}: StatCardProps) {
    return (
        <div
            className={`flex flex-col p-5 rounded-2xl border border-transparent transition-all hover:border-border/50 ${cardBackground}`}
        >
            <div className="flex items-start justify-between mb-6">
                <div className={`p-2.5 rounded-xl ${iconBackground} ${iconColor}`}>
                    <Icon size={22} strokeWidth={2.5} />
                </div>

                {badge && (
                    <div
                        className={`flex items-center px-2.5 py-1 rounded-full ${badgeBackground}`}
                    >
                        {BadgeIcon && (
                            <BadgeIcon size={13} className={`mr-1 ${badgeTextColor}`} />
                        )}
                        <p className={`text-xs ${badgeTextColor}`}>{badge}</p>
                    </div>
                )}
            </div>

            <div className="flex flex-col space-y-1">
                <AppText variant="header">{title}</AppText>
                <AppText variant="description">{description}</AppText>
            </div>
        </div>
    );
}
