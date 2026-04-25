// components/table.tsx

import {
    ChevronLeft,
    ChevronRight,
    SquarePen,
    Trash2,
    type LucideIcon,
} from "lucide-react";
import React from "react";
import { DeleteConfirmModal } from "./delete-confirm-modal";

export interface TableColumn<T> {
    key: string;
    header: string;
    align?: "left" | "center" | "right";
    render?: (row: T, index: number) => React.ReactNode;
    className?: string;
    headerClassName?: string;
}

export interface PaginationState {
    currentPage: number;
    totalItems: number;
    pageSize: number;
}

export interface PaginationProps extends PaginationState {
    onPageChange: (page: number) => void;
    itemLabel?: string;
    siblingCount?: number;
}

const buildPageRange = (
    currentPage: number,
    totalPages: number,
    siblingCount: number,
): (number | "...")[] => {
    const delta = siblingCount;
    const range: number[] = [];

    const left = Math.max(2, currentPage - delta);
    const right = Math.min(totalPages - 1, currentPage + delta);

    for (let i = left; i <= right; i++) range.push(i);

    const pages: (number | "...")[] = [1];
    if (left > 2) pages.push("...");
    pages.push(...range);
    if (right < totalPages - 1) pages.push("...");
    if (totalPages > 1) pages.push(totalPages);

    return pages;
};

export const TablePagination = ({
    currentPage,
    totalItems,
    pageSize,
    onPageChange,
    itemLabel = "items",
    siblingCount = 1,
}: PaginationProps) => {
    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
    const from = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
    const to = Math.min(currentPage * pageSize, totalItems);
    const pages = buildPageRange(currentPage, totalPages, siblingCount);

    const NavButton = ({
        onClick,
        disabled,
        children,
        "aria-label": ariaLabel,
    }: {
        onClick: () => void;
        disabled: boolean;
        children: React.ReactNode;
        "aria-label": string;
    }) => (
        <button
            onClick={onClick}
            disabled={disabled}
            aria-label={ariaLabel}
            className="
                flex h-8 w-8 items-center justify-center rounded-md
                border border-border text-text-secondary
                transition-colors hover:bg-bg-secondary hover:text-text
                disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer
            "
        >
            {children}
        </button>
    );

    return (
        <div className="flex items-center justify-between border-t border-border bg-bg-secondary px-6 py-3 rounded-b-xl overflow-hidden">
            <p className="text-xs text-text-secondary">
                Showing <span className="font-medium text-text">{from}</span> to{" "}
                <span className="font-medium text-text">{to}</span> of{" "}
                <span className="font-medium text-text">{totalItems}</span> {itemLabel}
            </p>

            <div className="flex items-center gap-1">
                <NavButton
                    aria-label="Previous page"
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    <ChevronLeft size={14} />
                </NavButton>

                {pages.map((page, i) =>
                    page === "..." ? (
                        <span
                            key={`ellipsis-${i}`}
                            className="flex h-8 w-8 items-center justify-center text-xs text-text-muted"
                        >
                            …
                        </span>
                    ) : (
                        <button
                            key={page}
                            onClick={() => onPageChange(page)}
                            aria-label={`Page ${page}`}
                            aria-current={page === currentPage ? "page" : undefined}
                            className={`
                                flex h-8 w-8 items-center justify-center rounded-md
                                text-xs font-medium transition-colors cursor-pointer
                                ${page === currentPage
                                    ? "bg-btn-primary text-btn-primary-text"
                                    : "border border-border text-text-secondary hover:bg-bg-secondary hover:text-text"
                                }
                            `}
                        >
                            {page}
                        </button>
                    ),
                )}

                <NavButton
                    aria-label="Next page"
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    <ChevronRight size={14} />
                </NavButton>
            </div>
        </div>
    );
};

// ─── AppTable ─────────────────────────────────────────────────────────────────

interface AppTableProps<T> {
    columns: TableColumn<T>[];
    data: T[];
    rowKey: (row: T) => string | number;
    className?: string;
    emptyText?: string;
    pagination?: PaginationProps;
    tableAdditionalHeader?: React.ReactNode;
}

export function AppTable<T>({
    columns,
    data,
    rowKey,
    className = "",
    emptyText = "No data available.",
    pagination,
    tableAdditionalHeader,
}: AppTableProps<T>) {
    const alignClass = {
        left: "text-left",
        center: "text-center",
        right: "text-right",
    };

    return (
        <div
            className={`w-full rounded-xl border border-border bg-bg ${className}`}
        >
            {tableAdditionalHeader && (
                <div className="border-b border-border rounded-t-xl">{tableAdditionalHeader}</div>
            )}

            <table className="w-full border-collapse">
                <thead>
                    <tr className=" rounded-t-xl overflow-hidden">
                        {columns.map((col) => (
                            <th
                                key={col.key}
                                className={`
                                    px-6 py-3 text-xs font-semibold tracking-wider
                                    text-text-secondary uppercase
                                    ${alignClass[col.align ?? "left"]}
                                    ${col.headerClassName ?? ""}
                                `}
                            >
                                {col.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.length === 0 ? (
                        <tr>
                            <td
                                colSpan={columns.length}
                                className="px-6 py-10 text-center text-sm text-text-muted"
                            >
                                {emptyText}
                            </td>
                        </tr>
                    ) : (
                        data.map((row, i) => (
                            <tr
                                key={rowKey(row)}
                                className="border-t border-border transition-colors hover:bg-bg-secondary/50"
                            >
                                {columns.map((col) => (
                                    <td
                                        key={col.key}
                                        className={`
                                            px-6 py-4
                                            ${alignClass[col.align ?? "left"]}
                                            ${col.className ?? ""}
                                        `}
                                    >
                                        {col.render
                                            ? col.render(row, i)
                                            : String((row as Record<string, unknown>)[col.key] ?? "")}
                                    </td>
                                ))}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            {pagination && <TablePagination {...pagination} />}
        </div>
    );
}

// ─── Cell Sub-Components ──────────────────────────────────────────────────────

// 1. TableIdentity — name + sub-label  e.g. "Rasel Jr. / ID: #0001"
interface TableIdentityProps {
    name: string;
    sub: string;
}
export const TableIdentity = ({ name, sub }: TableIdentityProps) => (
    <div className="flex flex-col">
        <span className="text-sm font-semibold text-text">{name}</span>
        <span className="text-xs text-text-muted">{sub}</span>
    </div>
);

// 2. TableGroupLabel — colored dot + plain text  e.g. "● Medellin"
interface TableGroupLabelProps {
    label: string;
    dotColor?: string;
}
export const TableGroupLabel = ({
    label,
    dotColor = "var(--color-purple)",
}: TableGroupLabelProps) => (
    <div className="flex items-center gap-2">
        <span
            className="inline-block h-2 w-2 shrink-0 rounded-full"
            style={{ backgroundColor: dotColor }}
        />
        <span className="text-sm text-text-secondary">{label}</span>
    </div>
);

// 3. TableGroupBadge — solid filled pill  e.g. "Medellin" / "Bogota" / "Remote"
type TableGroupBadgeColor = "blue" | "blue-light" | "gray";
interface TableGroupBadgeProps {
    label: string;
    color?: TableGroupBadgeColor;
}
export const TableGroupBadge = ({
    label,
    color = "blue",
}: TableGroupBadgeProps) => {
    const variants: Record<TableGroupBadgeColor, string> = {
        blue: "bg-btn-primary text-btn-primary-text",
        "blue-light": "bg-bg-focus text-text-focus",
        gray: "bg-bg-secondary text-text-secondary",
    };
    return (
        <span
            className={`
                inline-flex items-center rounded-full px-4 py-1.5
                text-xs font-semibold ${variants[color]}
            `}
        >
            {label}
        </span>
    );
};

// 4. TableBadge — subtle pill  e.g. "12 Active"
type TableBadgeVariant = "default" | "success" | "warning" | "danger";
interface TableBadgeProps {
    label: string;
    variant?: TableBadgeVariant;
}
export const TableBadge = ({ label, variant = "default" }: TableBadgeProps) => {
    const variants: Record<TableBadgeVariant, string> = {
        default: "bg-bg-secondary text-text-secondary",
        success: "bg-green-light text-green",
        warning: "bg-yellow-light text-yellow",
        danger: "bg-red-light text-red",
    };
    return (
        <span
            className={`
                inline-flex items-center rounded-full px-3 py-1
                text-xs font-medium ${variants[variant]}
            `}
        >
            {label}
        </span>
    );
};

// 5. TableNumericCell — plain or accent-coloured number
type TableNumericVariant = "default" | "accent";
interface TableNumericCellProps {
    value: number | string;
    variant?: TableNumericVariant;
    format?: (v: number | string) => string;
}
export const TableNumericCell = ({
    value,
    variant = "default",
    format,
}: TableNumericCellProps) => {
    const display = format ? format(value) : String(value);
    return (
        <span
            className={`text-sm font-semibold ${variant === "accent" ? "text-text-focus" : "text-text"
                }`}
        >
            {display}
        </span>
    );
};



interface AvatarItem {
    initials: string;
    name?: string;
    color?: string;
}
interface TableAvatarStackProps {
    avatars: AvatarItem[];
    max?: number;
}
const AVATAR_PALETTE = [
    { bg: "#3b5bdb", text: "#fff" },
    { bg: "#f59f00", text: "#fff" },
    { bg: "#e67700", text: "#fff" },
    { bg: "#2f9e44", text: "#fff" },
    { bg: "#c2255c", text: "#fff" },
    { bg: "#9c36b5", text: "#fff" },
];
export const TableAvatarStack = ({
    avatars,
    max = 2,
}: TableAvatarStackProps) => {
    const visible = avatars.slice(0, max);
    const overflow = avatars.length - max;

    return (
        <div className="group relative flex items-center">
            {visible.map((av, i) => {
                const palette = AVATAR_PALETTE[i % AVATAR_PALETTE.length];
                return (
                    <span
                        key={i}
                        title={av.name || av.initials}
                        style={{
                            backgroundColor: av.color ?? palette.bg,
                            color: palette.text,
                            marginLeft: i === 0 ? 0 : "-6px",
                            zIndex: visible.length - i,
                        }}
                        className="
                            relative inline-flex h-7 w-7 shrink-0
                            items-center justify-center rounded-full
                            border-2 border-bg text-[10px] font-semibold
                        "
                    >
                        {av.initials}
                    </span>
                );
            })}
            {overflow > 0 && (
                <span
                    style={{ marginLeft: "-6px", zIndex: 0 }}
                    className="
                        relative inline-flex h-7 w-7 shrink-0
                        items-center justify-center rounded-full
                        border-2 border-bg bg-yellow-light
                        text-yellow text-[10px] font-semibold
                    "
                >
                    +{overflow}
                </span>
            )}

            {avatars.length > 0 && (
                <div className="absolute bottom-full left-1/2 z-50 mb-2 hidden -translate-x-1/2 flex-col rounded-lg border border-border bg-white p-3 shadow-lg group-hover:flex min-w-[160px] max-h-48 overflow-y-auto">
                    <span className="mb-2 text-xs font-semibold uppercase tracking-wider text-text-muted">
                        Active Profiles
                    </span>
                    <ul className="flex flex-col gap-1.5">
                        {avatars.map((av, idx) => (
                            <li key={idx} className="flex items-center gap-2 text-sm text-text-secondary">
                                <span
                                    className="inline-block h-2 w-2 shrink-0 rounded-full"
                                    style={{
                                        backgroundColor: av.color ?? AVATAR_PALETTE[idx % AVATAR_PALETTE.length].bg,
                                    }}
                                />
                                <span className="truncate">{av.name || av.initials}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

// 8. TableStatus — dot + label  e.g. "● Active"
type StatusVariant = "active" | "inactive" | "pending";
interface TableStatusProps {
    status: StatusVariant;
    label?: string;
}
export const TableStatus = ({ status, label }: TableStatusProps) => {
    const variants: Record<StatusVariant, { dot: string; text: string }> = {
        active: { dot: "bg-green", text: "text-green" },
        inactive: { dot: "bg-text-muted", text: "text-text-muted" },
        pending: { dot: "bg-yellow", text: "text-yellow" },
    };
    const display = label ?? status.charAt(0).toUpperCase() + status.slice(1);
    return (
        <div className="flex items-center gap-2">
            <span
                className={`inline-block h-2 w-2 shrink-0 rounded-full ${variants[status].dot}`}
            />
            <span className={`text-sm font-medium ${variants[status].text}`}>
                {display}
            </span>
        </div>
    );
};

interface TableActionsProps {
    onEdit?: () => void;
    onDelete?: () => void | Promise<void>;
    editIcon?: LucideIcon;
    deleteIcon?: LucideIcon;
}

export const TableActions = ({
    onEdit,
    onDelete,
    editIcon: EditIcon = SquarePen,
    deleteIcon: DeleteIcon = Trash2,
}: TableActionsProps) => {
    const [showDeleteModal, setShowDeleteModal] = React.useState(false);
    const [isDeleting, setIsDeleting] = React.useState(false);

    const handleOpenDeleteModal = () => setShowDeleteModal(true);
    const handleCloseDeleteModal = () => {
        if (isDeleting) {
            return;
        }
        setShowDeleteModal(false);
    };

    const handleConfirmDelete = async () => {
        if (!onDelete) {
            setShowDeleteModal(false);
            return;
        }

        try {
            setIsDeleting(true);
            await onDelete();
            setShowDeleteModal(false);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <>
            <div className="flex items-center justify-end gap-3">
                {onEdit && (
                    <button
                        onClick={onEdit}
                        className="text-text-focus transition-opacity hover:opacity-60 cursor-pointer"
                        aria-label="Edit"
                    >
                        <EditIcon size={22} />
                    </button>
                )}
                {onDelete && (
                    <button
                        onClick={handleOpenDeleteModal}
                        disabled={isDeleting}
                        className="text-text-muted transition-opacity hover:opacity-60 cursor-pointer"
                        aria-label="Delete"
                    >
                        <DeleteIcon size={22} />
                    </button>
                )}
            </div>

            <DeleteConfirmModal
                open={showDeleteModal}
                onCancel={handleCloseDeleteModal}
                onConfirm={handleConfirmDelete}
                isConfirming={isDeleting}
                confirmLoadingText="Deleting..."
            />
        </>
    );
};
