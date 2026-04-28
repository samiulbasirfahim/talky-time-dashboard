import { useEffect, useMemo, useState } from "react";
import { isAxiosError } from "axios";
import { ArrowRight, History } from "lucide-react";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import { ErrorActionBanner } from "../../components/error-action-banner";
import { ProfileTrendChart, type ProfileTrendTimeframe } from "../../components/profile-trend-chart";
import { SegmentedTabBar } from "../../components/segmented-tab-bar";
import { AppText } from "../../components/text";
import { CompactSearchableDropdown } from "../../components/searchable-dropdown";
import { useAppModal } from "../../hooks/useAppModal";
import { useDebounce } from "../../lib/hooks/debounce";
import {
    ProfileFormModal,
    type BonusPercentage,
    type ProfileFormValues,
} from "./profile-form-modal";
import {
    ProfileReassignmentModal,
    type ProfileReassignmentFormValues,
} from "./profile-reassignment-modal";
import {
    AppTable,
    TableActions,
    type TableColumn,
} from "../../components/table";
import {
    useCreateProfile,
    PROFILES_PAGE_LIMIT,
    useDeleteProfile,
    useLatestReassignments,
    usePaginatedProfiles,
    useProfileDetails,
    useReassignProfiles,
    useUpdateProfile,
    useMe,
    useSearchProfiles,
    useSearchGroups,
} from "../../lib/queries";
import type {
    LatestReassignmentItem,
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

const buildProfileColumns = (
    onEdit: (row: ProfileRow) => void,
    onDelete: (row: ProfileRow) => Promise<void>,
    isAdminView: boolean,
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
                        className={`text-sm ${row.isAssigned
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
        ...(isAdminView
            ? [
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
                } as TableColumn<ProfileRow>,
            ]
            : [])
    ];

interface ProfileLeftSectionProps {
    isCreateProfileModalOpen: boolean;
    onCloseCreateProfileModal: () => void;
}

export function ProfileLeftSection({
    isCreateProfileModalOpen,
    onCloseCreateProfileModal,
}: ProfileLeftSectionProps) {
    const navigate = useNavigate();
    const { data: userData } = useMe();
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedTrendTab, setSelectedTrendTab] = useState<ProfileTrendTimeframe>("weekly");
    const [selectedGroupId, setSelectedGroupId] = useState("");
    const [groupSearch, setGroupSearch] = useState("");
    const [profiles, setProfiles] = useState<ProfileRow[]>([]);
    const debouncedGroupSearch = useDebounce(groupSearch, 500);
    const { data: groupsData } = useSearchGroups(debouncedGroupSearch);
    const {
        data: profileData,
        isPending: isProfilesPending,
        isError: isProfilesError,
    } = usePaginatedProfiles(currentPage, selectedGroupId ? selectedGroupId : undefined);
    const {
        data: latestReassignmentsData,
        isPending: isLatestReassignmentsPending,
        isError: isLatestReassignmentsError,
    } = useLatestReassignments(3);
    const {
        data: profilesWithoutOperatorData,
        isPending: isProfilesWithoutOperatorPending,
    } = useSearchProfiles({
        query: "",
        withoutOperatorOnSearch: true,
        enabled: true,
        refetchInterval: 10000,
    });
    const {
        data: profilesWithoutGroupData,
        isPending: isProfilesWithoutGroupPending,
    } = useSearchProfiles({
        query: "",
        withoutGroupOnSearch: true,
        enabled: true,
        refetchInterval: 10000,
    });
    const { mutateAsync: createProfile } = useCreateProfile();
    const { mutateAsync: updateProfile } = useUpdateProfile();
    const { mutateAsync: reassignProfiles } = useReassignProfiles();
    const {
        mutateAsync: removeAssignedOperatorFromProfile,
        isPending: isRemovingAssignedOperator,
    } = useUpdateProfile();
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

    const groupOptions = useMemo(() => {
        const fetchedOptions = (groupsData?.results ?? []).map((group) => ({
            value: String(group.id),
            label: group.name,
            subtitle: `Operators: ${group.operator_count ?? 0} | Supervisors: ${group.supervisor_count ?? 0}`,
            keywords: [
                `Total: ${group.operators_summary?.total ?? 0}`,
                `Day: ${group.operators_summary?.day_shift ?? 0}`,
                `Night: ${group.operators_summary?.night_shift ?? 0}`,
                ...(group.supervisors ?? []).map(
                    (supervisor) => supervisor.supervisor_name || supervisor.name,
                ),
            ],
        }));

        return [{ label: "All Groups", value: "" }, ...fetchedOptions];
    }, [groupsData]);

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
    const {
        isOpen: isReassignmentModalOpen,
        openModal: openReassignmentModal,
        closeModal: closeReassignmentModal,
    } = useAppModal();
    const [editingProfile, setEditingProfile] = useState<ProfileRow | null>(null);
    const [editingProfileId, setEditingProfileId] = useState<number | null>(null);
    const {
        data: editingProfileDetails,
        refetch: refetchEditingProfileDetails,
    } = useProfileDetails(editingProfileId);
    const isProfileModalOpen = isCreateProfileModalOpen || isEditProfileModalOpen;

    useEffect(() => {
        setProfiles(mappedProfiles);
    }, [mappedProfiles]);

    useEffect(() => {
        setCurrentPage(1);
    }, [selectedGroupId]);

    const handleEdit = (row: ProfileRow) => {
        setEditingProfile(row);
        setEditingProfileId(row.id);
        openEditProfileModal();
    };

    const handleDeleteAssignedOperator = async () => {
        const profileId = editingProfile?.id ?? editingProfileDetails?.id;

        if (!profileId) {
            toast.error("No profile selected.");
            return;
        }

        try {
            await removeAssignedOperatorFromProfile({
                id: profileId,
                payload: {
                    remove_operator: true,
                },
            });

            setProfiles((prev) =>
                prev.map((profile) => {
                    if (profile.id !== editingProfile?.id) {
                        return profile;
                    }

                    return {
                        ...profile,
                        operator: "Unassigned",
                        isAssigned: false,
                    };
                }),
            );

            await refetchEditingProfileDetails();
            toast.success("Assigned operator removed successfully.");
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

            toast.error("Failed to remove assigned operator. Please try again.");
        }
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
                group: values.group ? Number(values.group) : undefined,
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
                group: values.group ? Number(values.group) : undefined,
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
            group: String(editingProfileDetails?.group_id ?? editingProfileDetails?.group ?? ""),
        }
        : undefined;

    const profileColumns = buildProfileColumns(handleEdit, handleDelete, userData?.data.is_admin ?? false);

    const handleSubmitReassignment = async (values: ProfileReassignmentFormValues) => {
        const reassignedOperatorName = values.operatorName.trim() || "Assigned Operator";

        await reassignProfiles({
            profile_id: values.profileIds,
            new_operator_id: Number(values.operatorId),
        });

        setProfiles((prev) =>
            prev.map((profile) => {
                if (!values.profileIds.includes(profile.id)) {
                    return profile;
                }

                return {
                    ...profile,
                    operator: reassignedOperatorName,
                    isAssigned: true,
                };
            }),
        );

        toast.success(`Reassigned ${values.profileIds.length} profile(s) successfully.`);
    };

    const formatReassignmentTime = (item: LatestReassignmentItem): string => {
        const sourceDate = item.end_at || item.created_at;
        const date = new Date(sourceDate);

        if (Number.isNaN(date.getTime())) {
            return sourceDate;
        }

        return date.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        }).toLowerCase();
    };

    const latestReassignments = latestReassignmentsData?.results ?? [];
    const profilesWithoutOperator = profilesWithoutOperatorData?.results ?? [];
    const profilesWithoutGroup = profilesWithoutGroupData?.results ?? [];

    const buildProfileSummary = (profilesList: ProfileResponse[], noun: string, callToAction: string) => {
        if (profilesList.length === 0) {
            return "";
        }

        const maxVisible = 3;
        const visibleNames = profilesList.slice(0, maxVisible).map((profile) => profile.profile_name || profile.name);
        const hiddenCount = profilesList.length - visibleNames.length;

        const head = visibleNames.length === 1
            ? visibleNames[0]
            : visibleNames.length === 2
                ? `${visibleNames[0]} and ${visibleNames[1]}`
                : `${visibleNames.slice(0, -1).join(", ")}, and ${visibleNames[visibleNames.length - 1]}`;

        const tail = hiddenCount > 0 ? ` and ${hiddenCount} more profiles are currently ${noun}.` : ` are currently ${noun}.`;

        return `${head}${tail} ${callToAction}`;
    };

    const withoutOperatorMessage = buildProfileSummary(
        profilesWithoutOperator,
        "without an operator",
        "Please reassign them to an operator from the Reassign now flow.",
    );

    const withoutGroupMessage = buildProfileSummary(
        profilesWithoutGroup,
        "without a group",
        "Please assign them to a group from the Supervisors page group section.",
    );

    return (
        <div className="space-y-4">
            {profilesWithoutOperator.length > 0 && !isProfilesWithoutOperatorPending && (
                <ErrorActionBanner
                    text="Profiles need reassignment"
                    description={withoutOperatorMessage}
                    buttonText="Reassign now"
                    onPress={openReassignmentModal}
                />
            )}

            {profilesWithoutGroup.length > 0 && !isProfilesWithoutGroupPending && (
                <ErrorActionBanner
                    text="Profiles without a group"
                    description={withoutGroupMessage}
                    buttonText="Go to groups"
                    onPress={() => navigate("/supervisor")}
                />
            )}

            <AppTable
                columns={profileColumns}
                data={profiles}
                rowKey={(row) => row.profileId}
                tableAdditionalHeader={
                    <div className="flex items-center justify-between px-6 py-5 gap-4">
                        <AppText variant="smallHeader" className="text-base font-bold">
                            All Profiles
                        </AppText>
                        <div className="w-48">
                            <CompactSearchableDropdown
                                options={groupOptions}
                                value={selectedGroupId}
                                onChange={setSelectedGroupId}
                                onSearchChange={setGroupSearch}
                                placeholder="Filter by group..."
                            />
                        </div>
                        {/* <AppButton
                            variant="link"
                            size="sm"
                            suffixIcon={ExternalLink}
                            className="p-0 text-sm font-bold"
                        >
                            View Full Report
                        </AppButton> */}
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
                        onChange={(value) => setSelectedTrendTab(value as ProfileTrendTimeframe)}
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
                    {isLatestReassignmentsPending ? (
                        <AppText variant="description" className="text-text-muted">
                            Loading reassignments...
                        </AppText>
                    ) : isLatestReassignmentsError ? (
                        <AppText variant="description" className="text-red">
                            Failed to load latest reassignments.
                        </AppText>
                    ) : latestReassignments.length === 0 ? (
                        <AppText variant="description" className="text-text-muted">
                            No recent reassignments found.
                        </AppText>
                    ) : (
                        latestReassignments.map((entry) => (
                            <div key={entry.id} className="flex items-start justify-between gap-4">
                                <div>
                                    <AppText variant="description" className="font-semibold text-text">
                                        {entry.profile_name}
                                    </AppText>
                                    <AppText variant="description" className="mt-1 text-text-secondary">
                                        ID: {entry.profile_id_value}
                                    </AppText>
                                </div>

                                <div className="text-right">
                                    <div className="flex items-center justify-end gap-1 text-green">
                                        <ArrowRight size={18} strokeWidth={2.2} />
                                        <AppText variant="description" className="font-semibold text-green">
                                            {entry.operator_name}
                                        </AppText>
                                    </div>
                                    <AppText variant="description" className="mt-1 text-[#8A9CB3]">
                                        {formatReassignmentTime(entry)}
                                    </AppText>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </section>

            <ProfileFormModal
                open={isProfileModalOpen}
                onClose={handleCloseProfileModal}
                onSubmit={handleSubmitProfile}
                defaultValues={modalDefaultValues}
                assignedOperator={editingProfileDetails?.current_operator ?? null}
                onDeleteAssignedOperator={handleDeleteAssignedOperator}
                isDeletingAssignedOperator={isRemovingAssignedOperator}
            />

            <ProfileReassignmentModal
                open={isReassignmentModalOpen}
                onClose={closeReassignmentModal}
                onSubmit={handleSubmitReassignment}
            />
        </div>
    );
}
