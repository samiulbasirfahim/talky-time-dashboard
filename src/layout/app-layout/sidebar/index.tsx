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
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import { ButtonGroup, type ButtonGroupProps } from "./button-group";
import { Logo } from "../../../components/logo";
import { AppText } from "../../../components/text";
import { AppButton } from "../../../components/button";
import { DeleteConfirmModal } from "../../../components/delete-confirm-modal";
import { useAppModal } from "../../../hooks/useAppModal";
import { useLogout, useMe } from "../../../lib/queries";
import { useMemo } from "react";
import { SUPERVISOR_ALLOWED_ROUTES } from "../../../lib/access-control";

const BUTTONS_GROUP_ADMIN: ButtonGroupProps[] = [
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
const SUPERVISOR_ALLOWED_ROUTE_SET = new Set<string>(SUPERVISOR_ALLOWED_ROUTES);

export function Sidebar() {
    const navigate = useNavigate();
    const logoutModal = useAppModal();
    const { mutate: logout, isPending } = useLogout();

    const { data } = useMe();
    const user = data?.data;

    const sidebarItems = useMemo(() => {
        if (!user?.role) {
            return [];
        }

        if (user.role === "ADMIN") {
            return BUTTONS_GROUP_ADMIN;
        }

        if (user.role === "SUPERVISOR") {
            return BUTTONS_GROUP_ADMIN
                .map((group) => ({
                    ...group,
                    buttons: group.buttons.filter((button) =>
                        SUPERVISOR_ALLOWED_ROUTE_SET.has(button.route),
                    ),
                }))
                .filter((group) => group.buttons.length > 0);
        }

        return [];
    }, [user?.role]);

    const handleConfirmLogout = () => {
        logout(undefined, {
            onSuccess: () => {
                toast.success("Logged out successfully.");
                logoutModal.closeModal();
                navigate("/login", { replace: true });
            },
            onError: (error) => {
                toast.error("Logout failed. Please try again.");
                console.error("Logout error:", error);
            },
        });
    };

    return (
        <div className={styles.layoutSidebar}>
            <Logo
                hasBorder={true}
                logo="https://thumbs.dreamstime.com/b/vector-logo-colorful-design-41236752.jpg"
                subtitle="Logo Name"
                title="Multi-operator"
            />

            <div className="grow-0 flex flex-col overflow-y-auto custom-scrollbar pb-6">
                {sidebarItems.map((group) => (
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
                        <AppText variant="body">
                            {user?.username || user?.email || "User"}
                        </AppText>
                        <AppText variant="description">
                            {user?.role || "Unknown Role"}
                        </AppText>
                    </div>
                    <AppButton
                        className="ml-auto"
                        variant="danger"
                        size="sm"
                        onClick={logoutModal.openModal}
                        disabled={isPending}
                    >
                        Log Out
                    </AppButton>
                </div>
            </div>

            <DeleteConfirmModal
                open={logoutModal.isOpen}
                onCancel={logoutModal.closeModal}
                onConfirm={handleConfirmLogout}
                title="Log out of your account?"
                description="You will need to sign in again to access the dashboard."
                confirmText={isPending ? "Logging out..." : "Log Out"}
                cancelText="Stay Signed In"
                ariaLabel="Confirm logout"
            />
        </div>
    );
}
