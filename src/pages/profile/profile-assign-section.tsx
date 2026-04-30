import { Moon, Sun, UserRound, UsersRound, X } from "lucide-react";
import React from "react";
import { AppButton } from "../../components/button";
import { AppInputField } from "../../components/form-field";
import {
    SearchableDropdown,
    type SearchableDropdownOption,
} from "../../components/searchable-dropdown";
import { SegmentedTabBar, type SegmentedTabOption } from "../../components/segmented-tab-bar";
import { AppText } from "../../components/text";
import { useDebounce } from "../../lib/hooks/debounce";
import {
    useAllGroups,
    useAssignProfile,
    useMassAssignProfile,
    useSearchProfiles,
    useSearchOperators,
} from "../../lib/queries";
import toast from "react-hot-toast";

type AssignMode = "single" | "mass";
type ShiftType = "day" | "night";
type ShiftApiValue = "DAY" | "NIGHT";

type AssignFieldErrors = {
    operatorId?: string;
    groupId?: string;
    profileIds?: string;
};

const getDefaultTargetDate = () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday.toISOString().slice(0, 10);
};

const ASSIGN_MODE_OPTIONS: SegmentedTabOption<AssignMode>[] = [
    {
        value: "single",
        label: "Single Assign",
        icon: UserRound,
    },
    {
        value: "mass",
        label: "Mass Assign",
        icon: UsersRound,
    },
];

const SHIFT_OPTIONS: SegmentedTabOption<ShiftType>[] = [
    {
        value: "day",
        label: "DAY",
        icon: Sun,
    },
    {
        value: "night",
        label: "NIGHT",
        icon: Moon,
    },
];

export function ProfileAssignSection() {
    const [assignMode, setAssignMode] = React.useState<AssignMode>("single");
    const [shiftType, setShiftType] = React.useState<ShiftType>("night");
    const [selectedOperatorId, setSelectedOperatorId] = React.useState("");
    const [selectedOperatorName, setSelectedOperatorName] = React.useState("");
    const [operatorSearch, setOperatorSearch] = React.useState("");
    const [profileSearch, setProfileSearch] = React.useState("");
    const [selectedGroupId, setSelectedGroupId] = React.useState("");
    const [selectedGroupName, setSelectedGroupName] = React.useState("");
    const [selectedProfileIds, setSelectedProfileIds] = React.useState<string[]>([]);
    const [profileDropdownKey, setProfileDropdownKey] = React.useState(0);
    const [fieldErrors, setFieldErrors] = React.useState<AssignFieldErrors>({});


    const {
        mutateAsync: assignProfile,
        isPending: isSingleAssigning,
    } = useAssignProfile();

    const {
        mutateAsync: massAssignProfile,
        isPending: isMassAssigning,
    } = useMassAssignProfile();

    const debouncedOperatorSearch = useDebounce(operatorSearch, 500);
    const debouncedProfileSearch = useDebounce(profileSearch, 500);

    const { data: operatorsData, isPending: isOperatorsPending } = useSearchOperators(
        debouncedOperatorSearch,
        undefined,
        selectedGroupId
    );
    const { data: groupsData, isPending: isGroupsPending } = useAllGroups();
    const shouldFetchProfilesForSingleAssign = assignMode === "single";
    const { data: profilesData, isPending: isProfilesPending } = useSearchProfiles({
        query: debouncedProfileSearch,
        groupId: selectedGroupId || undefined,
        withoutOperatorOnSearch: true,
        enabled: shouldFetchProfilesForSingleAssign,
    });

    const operatorOptions = React.useMemo<SearchableDropdownOption[]>(() => {
        return (operatorsData?.results ?? []).map((operator) => ({
            value: String(operator.id),
            label: operator.full_name || operator.operator_name || `Operator #${operator.id}`,
            subtitle: `ID: ${operator.operator_id}`,
            keywords: [
                operator.operator_id,
                operator.operator_name,
                operator.full_name,
                operator.group_name,
                operator.shift_display,
            ],
        }));
    }, [operatorsData]);

    const operatorById = React.useMemo(() => {
        return new Map((operatorsData?.results ?? []).map((operator) => [String(operator.id), operator]));
    }, [operatorsData]);

    const groupOptions = React.useMemo<SearchableDropdownOption[]>(() => {
        return (groupsData?.results ?? []).map((group) => ({
            value: String(group.id),
            label: group.name,
            subtitle: `${group.operator_count} operators`,
            keywords: [group.name],
        }));
    }, [groupsData]);

    const profileOptions = React.useMemo<SearchableDropdownOption[]>(() => {
        return (profilesData?.results ?? []).map((profile) => ({
            value: String(profile.id),
            label: profile.profile_name || profile.name,
            subtitle: `ID: ${profile.profile_id}`,
            keywords: [
                profile.profile_name,
                profile.name,
                String(profile.profile_id),
                profile.operator,
            ],
        }));
    }, [profilesData]);

    const selectedProfilesSet = React.useMemo(() => {
        return new Set(selectedProfileIds);
    }, [selectedProfileIds]);

    const availableProfileOptions = React.useMemo(() => {
        return profileOptions.filter((option) => !selectedProfilesSet.has(option.value));
    }, [profileOptions, selectedProfilesSet]);

    const profileLabelById = React.useMemo(() => {
        return Object.fromEntries(
            profileOptions.map((option) => [option.value, option.label]),
        ) as Record<string, string>;
    }, [profileOptions]);

    const toApiShift = (value: ShiftType): ShiftApiValue => {
        return value === "day" ? "DAY" : "NIGHT";
    };

    const getFormattedErrorMessage = (error: unknown) => {
        const detail = (error as {
            response?: {
                data?: {
                    detail?: string | string[];
                };
            };
        })?.response?.data?.detail;

        if (Array.isArray(detail)) {
            const firstMessage = detail.find(
                (item): item is string => typeof item === "string" && item.trim().length > 0,
            );
            if (firstMessage) {
                return firstMessage;
            }
        }

        if (typeof detail === "string") {
            const trimmed = detail.trim();
            const pythonListLike = trimmed.match(/^\[\s*['\"](.+?)['\"]\s*\]$/);

            if (pythonListLike?.[1]) {
                return pythonListLike[1];
            }

            if (trimmed.length > 0) {
                return trimmed;
            }
        }

        return "Failed to assign profile. Please try again.";
    };

    const handleOperatorChange = (operatorId: string) => {
        setSelectedOperatorId(operatorId);
        setFieldErrors((prev) => ({ ...prev, operatorId: undefined }));

        const selected = operatorById.get(operatorId);
        setSelectedOperatorName(
            selected?.full_name || selected?.operator_name || (selected ? `Operator #${selected.id}` : ""),
        );

        if (assignMode === "single") {
            const grpId = selected?.group;
            if (grpId) {
                setSelectedGroupId(String(grpId));
                setSelectedGroupName(selected?.group_name ?? "");
                setFieldErrors((prev) => ({ ...prev, groupId: undefined }));
            }
        }
    };

    const handleGroupChange = (groupId: string) => {
        setSelectedGroupId(groupId);
        const selected = groupOptions.find((option) => option.value === groupId);
        setSelectedGroupName(selected?.label ?? "");
        setFieldErrors((prev) => ({ ...prev, groupId: undefined }));
    };

    const handleAddProfile = (profileId: string) => {
        if (!profileId) {
            return;
        }

        setSelectedProfileIds((prev) => {
            if (prev.includes(profileId)) {
                return prev;
            }

            return [...prev, profileId];
        });

        const selectedProfile = (profilesData?.results ?? []).find(p => String(p.id) === profileId);
        const groupId = selectedProfile?.group ?? selectedProfile?.group_id;
        
        if (groupId) {
            setSelectedGroupId(String(groupId));
            const groupOption = groupOptions.find(g => g.value === String(groupId));
            setSelectedGroupName(groupOption?.label || selectedProfile?.group_name || "");
            setFieldErrors((prev) => ({ ...prev, groupId: undefined }));
        }

        setFieldErrors((prev) => ({ ...prev, profileIds: undefined }));
        setProfileDropdownKey((prev) => prev + 1);
    };

    const handleRemoveProfile = (profileId: string) => {
        setSelectedProfileIds((prev) => prev.filter((id) => id !== profileId));
    };

    const resetAssignForm = () => {
        setSelectedOperatorId("");
        setSelectedOperatorName("");
        setSelectedGroupId("");
        setSelectedGroupName("");
        setSelectedProfileIds([]);
        setProfileSearch("");
        setProfileDropdownKey((prev) => prev + 1);
        setFieldErrors({});
    };

    const handleAssignProfile = async () => {
        const shift = toApiShift(shiftType);

        if (assignMode === "single") {
            const nextErrors: AssignFieldErrors = {};

            if (!selectedOperatorId) {
                nextErrors.operatorId = "Please select an operator.";
            }

            if (selectedProfileIds.length === 0) {
                nextErrors.profileIds = "Please select at least one profile.";
            }

            if (Object.keys(nextErrors).length > 0) {
                setFieldErrors(nextErrors);
                return;
            }

            const operatorIdAsNumber = Number(selectedOperatorId);
            const profileIdsAsNumber = selectedProfileIds
                .map((id) => Number(id))
                .filter((id) => Number.isFinite(id));

            if (!Number.isFinite(operatorIdAsNumber)) {
                toast.error("Invalid operator id.");
                return;
            }

            if (profileIdsAsNumber.length === 0) {
                toast.error("Invalid profile id.");
                return;
            }

            try {
                await assignProfile({
                    operator_id: operatorIdAsNumber,
                    profile_id: profileIdsAsNumber                });

                toast.success(`Profile assigned successfully to ${selectedOperatorName || "operator"}.`);
                resetAssignForm();
            } catch (err: unknown) {
                toast.error(getFormattedErrorMessage(err));
            }

            return;
        }

        const nextErrors: AssignFieldErrors = {};

        if (!selectedGroupId) {
            nextErrors.groupId = "Please select a group.";
        }

        if (Object.keys(nextErrors).length > 0) {
            setFieldErrors(nextErrors);
            return;
        }

        try {
            await massAssignProfile({
                target_date: getDefaultTargetDate(),
                shift,
                group_id: Number(selectedGroupId),
            });

            toast.success("Mass assign completed successfully.");
            resetAssignForm();
        } catch (err: unknown) {
            toast.error(getFormattedErrorMessage(err));
        }
    };

    return (
        <section className="rounded-3xl border border-border bg-white p-6">
            <AppText variant="header" className="text-text">
                Assign Profile
            </AppText>
            <AppText variant="description" className="mt-1">
                Configure active operator assignments
            </AppText>

            <div className="mt-6 space-y-5">
                {
                    <SegmentedTabBar
                        value={assignMode}
                        options={ASSIGN_MODE_OPTIONS}
                        onChange={(val) => setAssignMode(val as AssignMode)}
                        wrapperClassName="w-full"
                    />
                }

                {assignMode === "single" ? (
                    <SearchableDropdown
                        label="Group"
                        value={selectedGroupId}
                        options={groupOptions}
                        onChange={handleGroupChange}
                        placeholder={isGroupsPending ? "Loading groups..." : "Search group (optional)"}
                        emptyText={isGroupsPending ? "Loading groups..." : "No groups found."}
                        description={fieldErrors.groupId}
                        descriptionClassName="text-red"
                    />
                ) : (


                    <div className="space-y-2">
                        <label htmlFor="shift-type" className="block text-base font-medium text-text">
                            Shift Type
                        </label>
                        <div id="shift-type">
                            <SegmentedTabBar
                                value={shiftType}
                                options={SHIFT_OPTIONS}
                                onChange={(val) => setShiftType(val as ShiftType)}
                                wrapperClassName="w-full"
                            />
                        </div>
                    </div>
                )}
                {assignMode === "single" ? (
                    <SearchableDropdown
                        label="Operator"
                        value={selectedOperatorId}
                        options={operatorOptions}
                        onChange={handleOperatorChange}
                        onSearchChange={setOperatorSearch}
                        placeholder={
                            isOperatorsPending ? "Searching operators..." : "Search operator id/name"
                        }
                        emptyText={isOperatorsPending ? "Searching..." : "No operators found."}
                        description={fieldErrors.operatorId}
                        descriptionClassName="text-red"
                    />
                ) : (
                    <SearchableDropdown
                        label="Group"
                        value={selectedGroupId}
                        options={groupOptions}
                        onChange={handleGroupChange}
                        placeholder={isGroupsPending ? "Loading groups..." : "Search group"}
                        emptyText={isGroupsPending ? "Loading groups..." : "No groups found."}
                        description={fieldErrors.groupId}
                        descriptionClassName="text-red"
                    />
                )}

                {assignMode === "single" && (
                    <div className="space-y-2">
                        <SearchableDropdown
                            key={profileDropdownKey}
                            label="Profile name"
                            value=""
                            options={availableProfileOptions}
                            onChange={handleAddProfile}
                            onSearchChange={setProfileSearch}
                            placeholder={
                                isProfilesPending
                                    ? "Loading profiles..."
                                    : "Search profile name/id"
                            }
                            emptyText={isProfilesPending ? "Loading profiles..." : "No profiles found."}
                            description={fieldErrors.profileIds}
                            descriptionClassName="text-red"
                        />

                        {selectedProfileIds.length > 0 && (
                            <div className="flex max-h-24 flex-wrap gap-2 overflow-y-auto rounded-lg border border-border bg-bg-secondary p-2">
                                {selectedProfileIds.map((profileId) => (
                                    <span
                                        key={profileId}
                                        className="inline-flex items-center gap-1 rounded-md border border-border bg-bg px-2 py-1 text-sm text-text-secondary"
                                    >
                                        {profileLabelById[profileId] ?? profileId}
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveProfile(profileId)}
                                            className="inline-flex h-4 w-4 items-center justify-center rounded text-text-muted hover:bg-bg-secondary"
                                            aria-label={`Remove profile ${profileId}`}
                                        >
                                            <X size={12} />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                <AppButton
                    type="button"
                    variant="focus"
                    fullWidth
                    className="mt-1 h-12 rounded-xl text-sm font-semibold"

                    onClick={handleAssignProfile}
                    disabled={isSingleAssigning || isMassAssigning}
                    loadingLabel={"Assigning"}
                    isLoading={isSingleAssigning || isMassAssigning}
                >
                    Assign Profile
                </AppButton>

                <AppText variant="description" className="px-6 text-center text-xs text-text-muted">
                    Assignments are logged instantly to the audit trail and operator dashboards.
                </AppText>
            </div>
        </section>
    );
}
