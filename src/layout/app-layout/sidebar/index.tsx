import {
    CircleUser,
    CreditCard,
    DollarSign,
    History,
    LayoutDashboard,
    Scale,
    Settings,
    Upload,
    UsersRound,
} from "lucide-react";
import styles from "../layout.module.css";
import { ButtonGroup, type ButtonGroupProps } from "./button-group";
import { Logo } from "./logo";
import { AppText } from "../../../components/text";
import { AppButton } from "../../../components/button";

const BUTTONS_GROUP: ButtonGroupProps[] = [
    {
        label: "Overview",
        buttons: [
            {
                label: "Dashboard",
                route: "/",
                icon: LayoutDashboard,
            },
        ],
    },
    {
        label: "Operatons",
        buttons: [
            {
                label: "Supervisor",
                route: "/supervisor",
                icon: UsersRound,
            },
            {
                label: "Operators",
                route: "/operators",
                icon: CircleUser,
            },
            {
                label: "Profile",
                route: "/profile",
                icon: UsersRound,
            },
        ],
    },
    {
        label: "Data Management",
        buttons: [
            {
                label: "CSV Upload",
                route: "/csv-upload",
                icon: Upload,
            },
            {
                label: "Score Cutoffs",
                route: "/score-cutoffs",
                icon: CreditCard,
            },
        ],
    },
    {
        label: "Performance",
        buttons: [
            {
                label: "Bonus & Performance",
                route: "/bonus-performance",
                icon: DollarSign,
            },
            {
                label: "Report & History",
                route: "/report-history",
                icon: History,
            },
        ],
    },
    {
        label: "Finance",
        buttons: [
            {
                label: "Transactions",
                route: "/transactions",
                icon: DollarSign,
            },
            {
                label: "Payouts",
                route: "/payouts",
                icon: CreditCard,
            },
        ],
    },
    {
        label: "Compliance",
        buttons: [
            {
                label: "Discipline",
                route: "/discipline",
                icon: Scale,
            },
        ],
    },
    {
        label: "System",
        buttons: [
            {
                label: "Settings",
                route: "/settings",
                icon: Settings,
            },
        ],
    },
];

export function Sidebar() {
    return (
        <div className={styles.layoutSidebar}>
            <Logo
                logo="https://thumbs.dreamstime.com/b/vector-logo-colorful-design-41236752.jpg"
                subtitle="Logo Name"
                title="Multi-operator"
            />

            <div className="grow-0 flex flex-col overflow-y-auto custom-scrollbar pb-6">
                {BUTTONS_GROUP.map((group) => (
                    <ButtonGroup
                        key={group.label}
                        buttons={group.buttons}
                        label={group.label}
                    />
                ))}
            </div>
            <div className="flex-1"></div>

            <div className="shrink-0 border-t border-border p-4 py-6">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-text-focus" />
                    <div>
                        <AppText variant="body">John Doe</AppText>
                        <AppText variant="description">Admin User</AppText>
                    </div>
                    <AppButton className="ml-auto" variant="danger" size="sm">
                        Log Out
                    </AppButton>
                </div>
            </div>
        </div>
    );
}
