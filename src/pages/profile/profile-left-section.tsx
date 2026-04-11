import { useState } from "react";
import { ExternalLink } from "lucide-react";
import { AppButton } from "../../components/button";
import { ErrorActionBanner } from "../../components/error-action-banner";
import { AppText } from "../../components/text";
import {
    AppTable,
    TableActions,
    type TableColumn,
} from "../../components/table";

type ProfileRow = {
    profileId: string;
    name: string;
    threshold: string;
    operator: string;
    isAssigned: boolean;
    monEarning: string;
};

const INITIAL_PROFILE_ROWS: ProfileRow[] = [
    {
        profileId: "#DB-1-6",
        name: "Sofia_VIP",
        threshold: "25%",
        operator: "Akash.65",
        isAssigned: true,
        monEarning: "Cop$ 2,155",
    },
    {
        profileId: "#DB-2-12",
        name: "Luna_Pre",
        threshold: "21%",
        operator: "Unassigned",
        isAssigned: false,
        monEarning: "Cop$ 2,155",
    },
    {
        profileId: "#DB-1-9",
        name: "Aria_Elite",
        threshold: "25%",
        operator: "Unassigned",
        isAssigned: false,
        monEarning: "Cop$ 2,155",
    },
    {
        profileId: "#DB-4-2",
        name: "Diamond_ELT",
        threshold: "21%",
        operator: "Julian.m",
        isAssigned: true,
        monEarning: "Cop$ 2,155",
    },
    {
        profileId: "#DB-5-7",
        name: "Nova_Core",
        threshold: "23%",
        operator: "Hasan.11",
        isAssigned: true,
        monEarning: "Cop$ 2,090",
    },
    {
        profileId: "#DB-7-3",
        name: "Luma_Gold",
        threshold: "22%",
        operator: "Unassigned",
        isAssigned: false,
        monEarning: "Cop$ 1,980",
    },
    {
        profileId: "#DB-9-8",
        name: "Orion_Max",
        threshold: "25%",
        operator: "Rafi.22",
        isAssigned: true,
        monEarning: "Cop$ 2,210",
    },
];

const PAGE_SIZE = 4;

const buildProfileColumns = (
    onEdit: (row: ProfileRow) => void,
    onDelete: (profileId: string) => void,
): TableColumn<ProfileRow>[] => [
        {
            key: "profileId",
            header: "Profile ID",
            className: "text-sm text-text-secondary",
        },
        {
            key: "name",
            header: "Name",
            render: (row) => (
                <AppText variant="body" className="text-sm font-bold">
                    {row.name}
                </AppText>
            ),
        },
        {
            key: "threshold",
            header: "21/25%",
            render: (row) => (
                <AppText variant="body" className="text-sm font-bold">
                    {row.threshold}
                </AppText>
            ),
        },
        {
            key: "operator",
            header: "Operator",
            render: (row) => (
                <div className="flex items-center gap-2">
                    <span
                        className={`inline-block h-2 w-2 rounded-full ${row.isAssigned ? "bg-green" : "bg-red"}`}
                    />
                    <AppText
                        variant="description"
                        className={`text-sm ${
                            row.isAssigned
                                ? "font-medium text-text-secondary"
                                : "italic text-text-muted"
                        }`}
                    >
                        {row.operator}
                    </AppText>
                </div>
            ),
        },
        {
            key: "monEarning",
            header: "Mon Earning",
            align: "right",
            render: (row) => (
                <AppText variant="body" className="text-sm font-bold">
                    {row.monEarning}
                </AppText>
            ),
        },
        {
            key: "action",
            header: "Action",
            align: "right",
            render: (row) => (
                <TableActions
                    onEdit={() => onEdit(row)}
                    onDelete={() => onDelete(row.profileId)}
                />
            ),
        },
    ];

export function ProfileLeftSection() {
    const [profiles, setProfiles] = useState<ProfileRow[]>(INITIAL_PROFILE_ROWS);
    const [currentPage, setCurrentPage] = useState(1);

    const handleEdit = (row: ProfileRow) => {
        console.log("edit", row);
    };

    const handleDelete = (profileId: string) => {
        setProfiles((prev) => {
            const updated = prev.filter((profile) => profile.profileId !== profileId);
            const newTotalPages = Math.max(1, Math.ceil(updated.length / PAGE_SIZE));
            if (currentPage > newTotalPages) setCurrentPage(newTotalPages);
            return updated;
        });
    };

    const paginatedData = profiles.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE,
    );

    const profileColumns = buildProfileColumns(handleEdit, handleDelete);

    return (
        <div className="space-y-4">
            <ErrorActionBanner
                text="Reassignment Required"
                description="Profiles 'Sofia_VIP', 'Luna_Premium', 'Aria_Elite' are currently offline due to operator sickness."
                buttonText="Reassign now"
                onPress={() => { }}
            />

            <AppTable
                columns={profileColumns}
                data={paginatedData}
                rowKey={(row) => row.profileId}
                emptyText="No profiles found."
                tableAdditionalHeader={
                    <div className="flex items-center justify-between px-6 py-5">
                        <AppText variant="smallHeader" className="text-base font-bold">
                            All Profiles
                        </AppText>
                        <AppButton
                            variant="link"
                            size="sm"
                            suffixIcon={ExternalLink}
                            className="p-0 text-sm font-bold"
                        >
                            View Full Report
                        </AppButton>
                    </div>
                }
                pagination={{
                    currentPage,
                    totalItems: profiles.length,
                    pageSize: PAGE_SIZE,
                    onPageChange: setCurrentPage,
                    itemLabel: "profiles",
                }}
            />
        </div>
    );
}
