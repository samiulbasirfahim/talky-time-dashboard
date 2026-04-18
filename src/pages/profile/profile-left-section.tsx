import { useEffect, useMemo, useState } from "react";
import { isAxiosError } from "axios";
import { ArrowRight, ExternalLink, History } from "lucide-react";
import toast from "react-hot-toast";
import { AppButton } from "../../components/button";
import { ErrorActionBanner } from "../../components/error-action-banner";
import { ProfileTrendChart, type ProfileTrendTimeframe } from "../../components/profile-trend-chart";
import { SegmentedTabBar } from "../../components/segmented-tab-bar";
import { AppText } from "../../components/text";
import { useAppModal } from "../../hooks/useAppModal";
import {
    ProfileFormModal,
    type BonusPercentage,
    type ProfileFormValues,
} from "./profile-form-modal";
import {
    AppTable,
    TableActions,
    type TableColumn,
} from "../../components/table";
import {
    useCreateProfile,
    PROFILES_PAGE_LIMIT,
    useDeleteProfile,
    usePaginatedProfiles,
    useProfileDetails,
    useUpdateProfile,
} from "../../lib/queries";
import type {
    ProfileResponse,
    ProfileValidationErrors,
    UpdateProfilePayload,
} from "../../type";

type ProfileRow = {
    id: number;
    profileId: string;
    name: string;
    threshold: string;
    operator: string;
    supervisorName?: string;
    isAssigned: boolean;
    monEarning: string;
};

type LastReassignment = {
    profileName: string;
    profileId: string;
    assignedTo: string;
    time: string;
};

const LAST_REASSIGNMENTS: LastReassignment[] = [
    {
        profileName: "Maya_Gold",
        profileId: "prf4",
        assignedTo: "Akash.65",
        time: "11:03am",
    },
    {
        profileName: "Diamond_Elite",
        profileId: "prf9",
        assignedTo: "Julian.m",
        time: "10:45am",
    },
];

const buildProfileColumns = (
    onEdit: (row: ProfileRow) => void,
    onDelete: (row: ProfileRow) => Promise<void>,
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
                    onDelete={() => onDelete(row)}
                />
            ),
        },
    ];

interface ProfileLeftSectionProps {
    isCreateProfileModalOpen: boolean;
    onCloseCreateProfileModal: () => void;
}

export function ProfileLeftSection({
    isCreateProfileModalOpen,
    onCloseCreateProfileModal,
}: ProfileLeftSectionProps) {
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedTrendTab, setSelectedTrendTab] = useState<ProfileTrendTimeframe>("weekly");
    const [profiles, setProfiles] = useState<ProfileRow[]>([]);
    const {
        data: profileData,
        isPending: isProfilesPending,
        isError: isProfilesError,
    } = usePaginatedProfiles(currentPage);
    const { mutateAsync: createProfile } = useCreateProfile();
    const { mutateAsync: updateProfile } = useUpdateProfile();
    const { mutateAsync: deleteProfile } = useDeleteProfile();

    const mappedProfiles = useMemo<ProfileRow[]>(() => {
        return (profileData?.results ?? []).map((profile: ProfileResponse) => {
            const resolvedOperatorName =
                profile.current_operator?.full_name ||
                profile.operator ||
                "Unassigned";

            return {
                id: profile.id,
                profileId: String(profile.profile_id),
                name: profile.profile_name || profile.name,
                threshold: profile.bonus_percentage_display || `${profile.bonus_percentage}%`,
                operator: resolvedOperatorName,
                supervisorName: "",
                isAssigned: Boolean(profile.current_operator || profile.operator),
                monEarning: Number(profile.monthly_earning ?? 0).toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                }),
            };
        });
    }, [profileData]);

    const totalProfiles = profileData?.total_profiles ?? profileData?.count ?? 0;

    const tableEmptyText = isProfilesPending
        ? "Loading profiles..."
        : isProfilesError
            ? "Failed to load profiles."
            : "No profiles found.";
    const {
        isOpen: isEditProfileModalOpen,
        openModal: openEditProfileModal,
        closeModal: closeEditProfileModal,
    } = useAppModal();
    const [editingProfile, setEditingProfile] = useState<ProfileRow | null>(null);
    const [editingProfileId, setEditingProfileId] = useState<number | null>(null);
    const { data: editingProfileDetails } = useProfileDetails(editingProfileId);
    const isProfileModalOpen = isCreateProfileModalOpen || isEditProfileModalOpen;

    useEffect(() => {
        setProfiles(mappedProfiles);
    }, [mappedProfiles]);

    const handleEdit = (row: ProfileRow) => {
        setEditingProfile(row);
        setEditingProfileId(row.id);
        openEditProfileModal();
    };

    const getFirstErrorMessage = (value: unknown): string | undefined => {
        if (Array.isArray(value) && value.length > 0 && typeof value[0] === "string") {
            return value[0];
        }
        if (typeof value === "string") {
            return value;
        }
        return undefined;
    };

    const handleDelete = async (row: ProfileRow) => {
        try {
            await deleteProfile(row.id);
            setProfiles((prev) => prev.filter((profile) => profile.id !== row.id));
            toast.success("Profile deleted successfully.");
        } catch (error) {
            if (isAxiosError<ProfileValidationErrors>(error)) {
                const apiMessage =
                    getFirstErrorMessage(error.response?.data?.detail) ??
                    getFirstErrorMessage(error.response?.data?.non_field_errors);

                if (apiMessage) {
                    toast.error(apiMessage);
                    return;
                }
            }

            toast.error("Failed to delete profile. Please try again.");
        }
    };

    const handleCloseProfileModal = () => {
        closeEditProfileModal();
        onCloseCreateProfileModal();
        setEditingProfile(null);
        setEditingProfileId(null);
    };

    const handleSubmitProfile = async (values: ProfileFormValues) => {
        const isDetailsMode = Boolean(editingProfile);

        const trimmedProfileName = values.profileName.trim();
        const trimmedProfileId = values.profileId.trim();

        if (!trimmedProfileName) {
            toast.error("Profile name is required.");
            return;
        }

        if (!trimmedProfileId) {
            toast.error("Profile ID is required.");
            return;
        }

        if (!/^\d+$/.test(trimmedProfileId)) {
            toast.error("Profile ID must be numeric.");
            return;
        }

        if (isDetailsMode && editingProfile) {
            const payload: UpdateProfilePayload = {
                profile_name: trimmedProfileName,
                bonus_percentage: Number(values.bonusPercentage.replace("%", "")),
                profile_id: trimmedProfileId,
            };

            try {
                await updateProfile({
                    id: editingProfile.id,
                    payload,
                });

                setProfiles((prev) =>
                    prev.map((profile) => {
                        if (profile.id !== editingProfile.id) {
                            return profile;
                        }

                        return {
                            ...profile,
                            profileId: values.profileId,
                            name: values.profileName,
                            threshold: values.bonusPercentage,
                            supervisorName: values.supervisorName || "",
                        };
                    }),
                );
                toast.success("Profile updated successfully.");
            } catch (error) {
                if (isAxiosError<ProfileValidationErrors>(error)) {
                    const apiMessage =
                        getFirstErrorMessage(error.response?.data?.detail) ??
                        getFirstErrorMessage(error.response?.data?.profile_name) ??
                        getFirstErrorMessage(error.response?.data?.name) ??
                        getFirstErrorMessage(error.response?.data?.profile_id) ??
                        getFirstErrorMessage(error.response?.data?.bonus_percentage) ??
                        getFirstErrorMessage(error.response?.data?.non_field_errors);

                    if (apiMessage) {
                        toast.error(apiMessage);
                        return;
                    }
                }

                toast.error("Failed to update profile. Please try again.");
                return;
            }

            handleCloseProfileModal();
            return;
        }

        try {
            await createProfile({
                profile_id: trimmedProfileId,
                profile_name: trimmedProfileName,
                bonus_percentage: Number(values.bonusPercentage.replace("%", "")),
                is_active: true,
            });

            toast.success("Profile created successfully.");
            setCurrentPage(1);
            handleCloseProfileModal();
        } catch (error) {
            if (isAxiosError<ProfileValidationErrors>(error)) {
                const apiMessage =
                    getFirstErrorMessage(error.response?.data?.detail) ??
                    getFirstErrorMessage(error.response?.data?.profile_id) ??
                    getFirstErrorMessage(error.response?.data?.profile_name) ??
                    getFirstErrorMessage(error.response?.data?.name) ??
                    getFirstErrorMessage(error.response?.data?.bonus_percentage) ??
                    getFirstErrorMessage(error.response?.data?.non_field_errors);

                if (apiMessage) {
                    toast.error(apiMessage);
                    return;
                }
            }

            toast.error("Failed to create profile. Please try again.");
        }
    };

    const modalDefaultValues: Partial<ProfileFormValues> | undefined = editingProfile
        ? {
            profileName:
                editingProfileDetails?.profile_name ||
                editingProfileDetails?.name ||
                editingProfile.name,
            profileId: String(editingProfileDetails?.profile_id ?? editingProfile.profileId),
            bonusPercentage:
                editingProfileDetails?.bonus_percentage === 25
                    ? "25%"
                    : editingProfileDetails?.bonus_percentage === 21
                        ? "21%"
                        : (editingProfile.threshold as BonusPercentage),
            supervisorName: editingProfile.supervisorName || "",
        }
        : undefined;

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
                data={profiles}
                rowKey={(row) => row.profileId}
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
                    totalItems: totalProfiles,
                    pageSize: PROFILES_PAGE_LIMIT,
                    onPageChange: setCurrentPage,
                    itemLabel: "profiles",
                }}
                emptyText={tableEmptyText}
            />

            <section className="rounded-3xl border hidden border-border bg-bg px-6 py-5 shadow-xs">
                <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                    <AppText variant="smallHeader" className="font-semibold text-text">
                        Profile Trend Distribution
                    </AppText>
                    <SegmentedTabBar
                        value={selectedTrendTab}
                        options={[
                            { label: "Weekly", value: "weekly" },
                            { label: "Monthly", value: "monthly" },
                        ]}
                        onChange={setSelectedTrendTab}
                    />
                </div>

                <div className="h-82.5 w-full">
                    <ProfileTrendChart timeframe={selectedTrendTab} className="h-full w-full" />
                </div>
            </section>

            <section className="rounded-3xl bg-[#F9FBFE] px-6 py-5 shadow-xs">
                <div className="mb-6 flex items-center gap-2.5">
                    <History className="text-text-focus" size={22} strokeWidth={2.2} />
                    <AppText variant="smallHeader" className="font-semibold text-text">
                        Last Reassignments
                    </AppText>
                </div>

                <div className="space-y-8">
                    {LAST_REASSIGNMENTS.map((entry) => (
                        <div key={entry.profileId} className="flex items-start justify-between gap-4">
                            <div>
                                <AppText variant="description" className="font-semibold text-text">
                                    {entry.profileName}
                                </AppText>
                                <AppText variant="description" className="mt-1 text-text-secondary">
                                    ID: {entry.profileId}
                                </AppText>
                            </div>

                            <div className="text-right">
                                <div className="flex items-center justify-end gap-1 text-green">
                                    <ArrowRight size={18} strokeWidth={2.2} />
                                    <AppText variant="description" className="font-semibold text-green">
                                        {entry.assignedTo}
                                    </AppText>
                                </div>
                                <AppText variant="description" className="mt-1 text-[#8A9CB3]">
                                    {entry.time}
                                </AppText>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <ProfileFormModal
                open={isProfileModalOpen}
                onClose={handleCloseProfileModal}
                onSubmit={handleSubmitProfile}
                defaultValues={modalDefaultValues}
            />
        </div>
    );
}
