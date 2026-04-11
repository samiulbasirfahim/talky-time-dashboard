import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
    Search as SearchIcon,
    LayoutDashboard,
    ShieldCheck,
    UsersRound,
    UserCircle,
    FileUp,
    Scissors,
    Trophy,
    ScrollText,
    Gavel,
    Settings,
    type LucideIcon,
    ChevronRight,
} from "lucide-react";
import { Link, useNavigate } from "react-router";
import { AppText } from "../../../components/text";

// ─── Types ────────────────────────────────────────────────────────────────────

type SearchItem = {
    title: string;
    description: string;
    route: string;
    keywords: string[];
    icon: LucideIcon;
}[];

// ─── Data ─────────────────────────────────────────────────────────────────────

const dummyDatas: SearchItem = [
    {
        title: "Dashboard",
        description:
            "Overview of key metrics, fleet status, and performance analytics.",
        route: "/",
        keywords: ["dashboard", "overview", "metrics", "performance"],
        icon: LayoutDashboard,
    },
    {
        title: "Supervisor",
        description:
            "Manage and oversee supervisor activities, permissions, and escalation logs.",
        route: "/supervisor",
        keywords: ["supervisor", "manage", "oversee"],
        icon: ShieldCheck,
    },
    {
        title: "Operators",
        description:
            "Configure operator profiles, track shifts, and assign active deployments.",
        route: "/operators",
        keywords: ["operators", "manage", "oversee"],
        icon: UsersRound,
    },
    {
        title: "Profile",
        description:
            "Adjust personal settings, notification preferences, and security credentials.",
        route: "/profile",
        keywords: ["profile", "view", "edit"],
        icon: UserCircle,
    },
    {
        title: "CSV Upload",
        description: "Upload CSV files for data management.",
        route: "/csv-upload",
        keywords: ["csv", "upload", "data management"],
        icon: FileUp,
    },
    {
        title: "Score Cutoffs",
        description: "Set and manage score cutoffs for performance evaluation.",
        route: "/score-cutoffs",
        keywords: ["score cutoffs", "performance evaluation"],
        icon: Scissors,
    },
    {
        title: "Bonus & Performance",
        description: "Manage bonus and performance metrics.",
        route: "/bonus-performance",
        keywords: ["bonus", "performance", "metrics"],
        icon: Trophy,
    },
    {
        title: "Report History",
        description: "View historical reports and performance data.",
        route: "/report-history",
        keywords: ["report history", "historical reports", "performance data"],
        icon: ScrollText,
    },
    {
        title: "Discipline",
        description: "Manage disciplinary actions and records.",
        route: "/discipline",
        keywords: ["discipline", "manage", "records"],
        icon: Gavel,
    },
    {
        title: "Settings",
        description: "Configure application settings and preferences.",
        route: "/settings",
        keywords: ["settings", "configure", "preferences"],
        icon: Settings,
    },
];

// ─── Component ────────────────────────────────────────────────────────────────

export function Search() {
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const searchResults = dummyDatas.filter((item) =>
        item.keywords.some((keyword) =>
            keyword.toLowerCase().includes(searchQuery.toLowerCase()),
        ),
    );

    const handleClose = () => {
        setShowModal(false);
        setSearchQuery("");
    };

    return (
        <>
            {/* Trigger */}
            <div
                className="flex items-center gap-2 border rounded-md px-2 py-1 border-border cursor-pointer"
                onClick={() => setShowModal(true)}
            >
                <SearchIcon size={16} className="text-text-muted" />
                <input
                    type="text"
                    placeholder="Search..."
                    readOnly
                    className="outline-none focus:outline-none border-none cursor-pointer"
                />
            </div>

            {/* Modal */}
            <AnimatePresence>
                {showModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 bg-text/30 backdrop-blur-sm flex items-center justify-center z-50"
                        onClick={handleClose}
                    >
                        {/* Dot grid background */}
                        <div
                            className="absolute inset-0 z-0 pointer-events-none"
                            style={{
                                backgroundImage: `radial-gradient(circle, var(--color-bg) 1px, transparent 1px)`,
                                backgroundSize: "8px 8px",
                                maskImage:
                                    "radial-gradient(ellipse at center, white, transparent 70%)",
                                WebkitMaskImage:
                                    "radial-gradient(ellipse at center, white, transparent 70%)",
                            }}
                        />

                        {/* Card */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.97, y: 8 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.97, y: 8 }}
                            transition={{ duration: 0.2 }}
                            className="relative p-4 rounded-xl w-2/5 bg-bg border border-border z-50 shadow-lg"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="w-full flex flex-row items-center gap-2 rounded-md px-3 py-2 border border-border focus-within:border-text-secondary transition-colors">
                                <SearchIcon size={16} className="text-text-muted shrink-0" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    autoFocus
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            e.preventDefault();
                                            if (searchResults.length > 0) {
                                                navigate(searchResults[0].route);
                                                handleClose();
                                            }
                                        }
                                        if (e.key === "Escape") handleClose();
                                    }}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search resources..."
                                    className="border-none outline-none focus:outline-none w-full text-sm"
                                />
                                <div className="text-xs font-semibold tracking-wide bg-bg-secondary text-text-secondary px-3 py-1 rounded-md shrink-0 uppercase">
                                    {searchResults.length} results
                                </div>
                            </div>

                            <div className="mt-3 h-72 overflow-y-auto overflow-x-hidden group custom-scrollbar pe-1">
                                {searchResults.length === 0 ? (
                                    <div className="flex items-center justify-center h-full text-sm text-text-muted">
                                        No results found.
                                    </div>
                                ) : (
                                    searchResults.map((item, index) => {
                                        const Icon = item.icon;
                                        const isFirst = index === 0;
                                        return (
                                            <Link
                                                to={item.route}
                                                key={item.route}
                                                onClick={handleClose}
                                            >
                                                <div
                                                    className={`
                                                        flex items-center gap-3 px-3 py-3 cursor-pointer
                                                        relative rounded-r-lg group/item transition-colors
                                                        ${isFirst
                                                            ? "bg-bg-focus group-hover:bg-transparent hover:bg-bg-focus!"
                                                            : "hover:bg-bg-focus"
                                                        }
                                                    `}
                                                >
                                                    <div
                                                        className={`
                                                            absolute left-0 top-0 bottom-0 w-1
                                                            bg-btn-primary transition-opacity
                                                            ${isFirst
                                                                ? "opacity-100 group-hover:opacity-0 group-hover/item:opacity-100!"
                                                                : "opacity-0 group-hover/item:opacity-100"
                                                            }
                                                        `}
                                                    />

                                                    {/* Icon box */}
                                                    <div
                                                        className={`
                                                            shrink-0 flex items-center justify-center
                                                            h-10 w-10 rounded-lg transition-colors
                                                            ${isFirst
                                                                ? "bg-btn-primary text-btn-primary-text group-hover:bg-bg-secondary group-hover:text-text-secondary group-hover/item:bg-btn-primary! group-hover/item:text-btn-primary-text!"
                                                                : "bg-bg-secondary text-text-secondary group-hover/item:bg-btn-primary group-hover/item:text-btn-primary-text"
                                                            }
                                                        `}
                                                    >
                                                        <Icon size={18} />
                                                    </div>

                                                    <div className="flex flex-col flex-1 min-w-0">
                                                        <AppText variant="body" className="font-semibold">
                                                            {item.title}
                                                        </AppText>
                                                        <AppText variant="description">
                                                            {item.description}
                                                        </AppText>
                                                    </div>

                                                    <ChevronRight
                                                        size={16}
                                                        className={`
                                                            shrink-0 transition-colors
                                                            ${isFirst
                                                                ? "text-text-focus group-hover:text-text-muted group-hover/item:text-text-focus!"
                                                                : "text-text-muted group-hover/item:text-text-focus"
                                                            }
                                                        `}
                                                    />
                                                </div>
                                            </Link>
                                        );
                                    })
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
