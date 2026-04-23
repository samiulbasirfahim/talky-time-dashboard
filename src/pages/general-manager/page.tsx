import { useEffect, useMemo, useState } from "react";
import { isAxiosError } from "axios";
import toast from "react-hot-toast";
import { HeaderSection } from "../../components/header-section";
import { AppTable, TableActions, type TableColumn } from "../../components/table";
import { AppText } from "../../components/text";
import { AppButton } from "../../components/button";
import {
    LargeSearchableDropdown,
    type LargeSearchableDropdownOption,
} from "../../components/large-searchable-dropdown";
import { useAppModal } from "../../hooks/useAppModal";
import {
    usePaginatedGeneralManagers,
    useDeleteGeneralManager,
    usePaginatedSupervisors,
    usePaginatedProfiles,
    usePaginatedOperators,
    useAllGroups,
    useMe,
} from "../../lib/queries";
import { GeneralManagerModal } from "./gm-modal";
import type {
    GeneralManagerResponse,
    GeneralManagerValidationErrors,
    SupervisorResponse,
    ProfileResponse,
    OperatorResponse,
} from "../../type";

type GeneralManagerRow = {
    id: number;
    gmId: string;
    gmName: string;
    email: string;
};

type SupervisorRow = {
    id: number;
    supervisorId: string;
    supervisorName: string;
    email: string;
};

type ProfileRow = {
    id: number;
    profileId: string;
    profileName: string;
    bonusPercentage: string;
    operator: string;
};

type OperatorRow = {
    id: number;
    operatorId: string;
    operatorName: string;
    groupName: string;
};

const buildSupervisorColumns = (): TableColumn<SupervisorRow>[] => [
    {
        key: "supervisorId",
        header: "Supervisor ID",
        className: "text-sm text-text-secondary",
    },
    {
        key: "supervisorName",
        header: "Supervisor Name",
        render: (row) => (
            <AppText variant="body" className="text-sm font-bold">
                {row.supervisorName}
            </AppText>
        ),
    },
    {
        key: "email",
        header: "Email",
        render: (row) => (
            <AppText variant="description" className="text-sm">
                {row.email}
            </AppText>
        ),
    },
];

const buildProfileColumns = (): TableColumn<ProfileRow>[] => [
    {
        key: "profileId",
        header: "Profile ID",
        className: "text-sm text-text-secondary",
    },
    {
        key: "profileName",
        header: "Profile Name",
        render: (row) => (
            <AppText variant="body" className="text-sm font-bold">
                {row.profileName}
            </AppText>
        ),
    },
    {
        key: "bonusPercentage",
        header: "Bonus %",
        render: (row) => (
            <AppText variant="body" className="text-sm">
                {row.bonusPercentage}
            </AppText>
        ),
    },
    {
        key: "operator",
        header: "Operator",
        render: (row) => (
            <AppText variant="description" className="text-sm">
                {row.operator || "Unassigned"}
            </AppText>
        ),
    },
];

const buildOperatorColumns = (): TableColumn<OperatorRow>[] => [
    {
        key: "operatorId",
        header: "Operator ID",
        className: "text-sm text-text-secondary",
    },
    {
        key: "operatorName",
        header: "Operator Name",
        render: (row) => (
            <AppText variant="body" className="text-sm font-bold">
                {row.operatorName}
            </AppText>
        ),
    },
    {
        key: "groupName",
        header: "Group",
        render: (row) => (
            <AppText variant="description" className="text-sm">
                {row.groupName}
            </AppText>
        ),
    },
];

export function GeneralManagerPage() {
    const [currentPage, setCurrentPage] = useState(1);
    const [supervisorPage, setSupervisorPage] = useState(1);
    const [profilePage, setProfilePage] = useState(1);
    const [operatorPage, setOperatorPage] = useState(1);
    const [selectedGroupId, setSelectedGroupId] = useState<string>("");
    const [generalManagers, setGeneralManagers] = useState<GeneralManagerRow[]>([]);
    const [editingGm, setEditingGm] = useState<GeneralManagerResponse | null>(null);

    const { data: meData } = useMe();
    const isAdmin = Boolean(meData?.data.is_admin);

    const { data: groupsData, isPending: isGroupsPending } = useAllGroups();

    const {
        data: gmData,
        isPending: isGMPending,
        isError: isGMError,
        refetch: refetchGMs,
    } = usePaginatedGeneralManagers(currentPage, isAdmin);

    const {
        data: supervisorsData,
        isPending: isSupervisorsPending,
        isError: isSupervisorsError,
    } = usePaginatedSupervisors(supervisorPage, selectedGroupId, Boolean(selectedGroupId));

    const {
        data: profilesData,
        isPending: isProfilesPending,
        isError: isProfilesError,
    } = usePaginatedProfiles(profilePage, selectedGroupId, Boolean(selectedGroupId));

    const {
        data: operatorsData,
        isPending: isOperatorsPending,
        isError: isOperatorsError,
    } = usePaginatedOperators(operatorPage, selectedGroupId, Boolean(selectedGroupId));

    const { mutateAsync: deleteGM } = useDeleteGeneralManager();

    const {
        isOpen: isGMModalOpen,
        openModal: openGMModal,
        closeModal: closeGMModal,
    } = useAppModal();

    const groupOptions = useMemo<LargeSearchableDropdownOption[]>(() => {
        return (groupsData?.results ?? []).map((group) => ({
            value: String(group.id),
            label: group.name,
            subtitle: `${group.operator_count} operators | ${group.supervisor_count} supervisors | ${group.profile_count} profiles`,
            keywords: [group.name],
        }));
    }, [groupsData]);

    useEffect(() => {
        if (!selectedGroupId && groupOptions.length > 0) {
            setSelectedGroupId(groupOptions[0].value);
        }
    }, [groupOptions, selectedGroupId]);

    const gmRows = useMemo<GeneralManagerRow[]>(() => {
        return (gmData?.results ?? []).map((gm: GeneralManagerResponse) => ({
            id: gm.id,
            gmId: gm.general_manager_id,
            gmName: gm.name,
            email: gm.email,
        }));
    }, [gmData]);

    const supervisorRows = useMemo<SupervisorRow[]>(() => {
        return (supervisorsData?.results ?? []).map((supervisor: SupervisorResponse) => ({
            id: supervisor.id,
            supervisorId: supervisor.supervisor_id,
            supervisorName: supervisor.supervisor_name || supervisor.name || "",
            email: supervisor.email,
        }));
    }, [supervisorsData]);

    const profileRows = useMemo<ProfileRow[]>(() => {
        return (profilesData?.results ?? []).map((profile: ProfileResponse) => ({
            id: profile.id,
            profileId: String(profile.profile_id),
            profileName: profile.profile_name || profile.name || "",
            bonusPercentage: profile.bonus_percentage_display || `${profile.bonus_percentage}%`,
            operator: profile.current_operator?.full_name || profile.operator || "",
        }));
    }, [profilesData]);

    const operatorRows = useMemo<OperatorRow[]>(() => {
        return (operatorsData?.results ?? []).map((operator: OperatorResponse) => ({
            id: operator.id,
            operatorId: operator.operator_id,
            operatorName: operator.full_name || operator.operator_name || "",
            groupName: operator.group_name || "",
        }));
    }, [operatorsData]);

    const totalGMs = gmData?.count ?? 0;
    const totalSupervisors = supervisorsData?.count ?? 0;
    const totalProfiles = profilesData?.count ?? 0;
    const totalOperators = operatorsData?.count ?? 0;

    const pageSize = 10;

    useEffect(() => {
        setGeneralManagers(gmRows);
    }, [gmRows]);

    useEffect(() => {
        setSupervisorPage(1);
        setProfilePage(1);
        setOperatorPage(1);
    }, [selectedGroupId]);

    useEffect(() => {
        if (!isAdmin) {
            setGeneralManagers([]);
        }
    }, [isAdmin]);

    const gmTableEmptyText = isGMPending
        ? "Loading general managers..."
        : isGMError
            ? "Failed to load general managers."
            : "No general managers found.";

    const supervisorTableEmptyText = !selectedGroupId
        ? "Select a group to view supervisors"
        : isSupervisorsPending
            ? "Loading supervisors..."
            : isSupervisorsError
                ? "Failed to load supervisors."
                : "No supervisors found.";

    const profileTableEmptyText = !selectedGroupId
        ? "Select a group to view profiles"
        : isProfilesPending
            ? "Loading profiles..."
            : isProfilesError
                ? "Failed to load profiles."
                : "No profiles found.";

    const operatorTableEmptyText = !selectedGroupId
        ? "Select a group to view operators"
        : isOperatorsPending
            ? "Loading operators..."
            : isOperatorsError
                ? "Failed to load operators."
                : "No operators found.";

    const handleCreateGM = () => {
        setEditingGm(null);
        openGMModal();
    };

    const handleEditGM = (gm: GeneralManagerResponse) => {
        setEditingGm(gm);
        openGMModal();
    };

    const handleDeleteGM = async (gm: GeneralManagerResponse) => {
        try {
            await deleteGM(gm.id);
            setGeneralManagers((prev) => prev.filter((item) => item.id !== gm.id));
            toast.success("General manager deleted successfully.");
        } catch (error) {
            if (isAxiosError<GeneralManagerValidationErrors>(error)) {
                const apiMessage = error.response?.data?.detail;
                if (typeof apiMessage === "string" && apiMessage.trim()) {
                    toast.error(apiMessage);
                    return;
                }
            }
            toast.error("Failed to delete general manager. Please try again.");
        }
    };

    const handleGMModalClose = () => {
        setEditingGm(null);
        closeGMModal();
    };

    const handleGMSuccess = () => {
        refetchGMs();
        setCurrentPage(1);
    };

    const gmColumns = buildGMColumns(handleEditGM, handleDeleteGM);
    const supervisorColumns = buildSupervisorColumns();
    const profileColumns = buildProfileColumns();
    const operatorColumns = buildOperatorColumns();

    return (
        <div>
            <HeaderSection
                title="General Managers"
                description="Manage general managers and their operations"
                buttons={[]}
                headerRight={
                    <LargeSearchableDropdown
                        label="Selected Group"
                        value={selectedGroupId}
                        options={groupOptions}
                        onChange={setSelectedGroupId}
                        placeholder={isGroupsPending ? "Loading groups..." : "Search group"}
                        emptyText={isGroupsPending ? "Loading..." : "No groups found."}
                        className="w-104"
                    />
                }
            />

            <div className="space-y-4 p-4">
                {isAdmin ? (
                    <AppTable
                        columns={gmColumns}
                        data={generalManagers}
                        rowKey={(row) => row.id}
                        tableAdditionalHeader={
                            <div className="flex items-center justify-between px-6 py-5">
                                <AppText variant="smallHeader" className="text-base font-bold">
                                    All General Managers
                                </AppText>
                                <AppButton
                                    onClick={handleCreateGM}
                                    className="inline-flex items-center gap-2 rounded-lg bg-blue px-4 py-2 text-white"
                                >
                                    Create General Manager
                                </AppButton>
                            </div>
                        }
                        pagination={{
                            currentPage,
                            totalItems: totalGMs,
                            pageSize,
                            onPageChange: setCurrentPage,
                            itemLabel: "general managers",
                        }}
                        emptyText={gmTableEmptyText}
                    />
                ) : null}

                {selectedGroupId && (
                    <>
                        <AppTable
                            columns={profileColumns}
                            data={profileRows}
                            rowKey={(row) => row.id}
                            tableAdditionalHeader={
                                <div className="px-6 py-5">
                                    <AppText variant="smallHeader" className="text-base font-bold">
                                        Profiles
                                    </AppText>
                                </div>
                            }
                            pagination={{
                                currentPage: profilePage,
                                totalItems: totalProfiles,
                                pageSize,
                                onPageChange: setProfilePage,
                                itemLabel: "profiles",
                            }}
                            emptyText={profileTableEmptyText}
                        />

                        <div className="grid grid-cols-1 items-start gap-4 xl:grid-cols-2">
                            <AppTable
                                columns={supervisorColumns}
                                data={supervisorRows}
                                rowKey={(row) => row.id}
                                className="h-auto self-start"
                                tableAdditionalHeader={
                                    <div className="px-6 py-5">
                                        <AppText variant="smallHeader" className="text-base font-bold">
                                            Supervisors
                                        </AppText>
                                    </div>
                                }
                                pagination={{
                                    currentPage: supervisorPage,
                                    totalItems: totalSupervisors,
                                    pageSize,
                                    onPageChange: setSupervisorPage,
                                    itemLabel: "supervisors",
                                }}
                                emptyText={supervisorTableEmptyText}
                            />

                            <AppTable
                                columns={operatorColumns}
                                data={operatorRows}
                                rowKey={(row) => row.id}
                                className="self-start"
                                tableAdditionalHeader={
                                    <div className="px-6 py-5">
                                        <AppText variant="smallHeader" className="text-base font-bold">
                                            Operators
                                        </AppText>
                                    </div>
                                }
                                pagination={{
                                    currentPage: operatorPage,
                                    totalItems: totalOperators,
                                    pageSize,
                                    onPageChange: setOperatorPage,
                                    itemLabel: "operators",
                                }}
                                emptyText={operatorTableEmptyText}
                            />
                        </div>
                    </>
                )}
            </div>

            <GeneralManagerModal
                open={isGMModalOpen}
                onClose={handleGMModalClose}
                onSuccess={handleGMSuccess}
                editingGm={editingGm}
            />
        </div>
    );
}

const buildGMColumns = (
    onEdit: (gm: GeneralManagerResponse) => void,
    onDelete: (gm: GeneralManagerResponse) => Promise<void>,
): TableColumn<GeneralManagerRow>[] => [
    {
        key: "gmId",
        header: "GM ID",
        className: "text-sm text-text-secondary",
    },
    {
        key: "gmName",
        header: "GM Name",
        render: (row) => (
            <AppText variant="body" className="text-sm font-bold">
                {row.gmName}
            </AppText>
        ),
    },
    {
        key: "email",
        header: "Email",
        render: (row) => (
            <AppText variant="description" className="text-sm">
                {row.email}
            </AppText>
        ),
    },
    {
        key: "action",
        header: "Action",
        align: "right",
        render: (row) => (
            <TableActions
                onEdit={() => {
                    const gm: GeneralManagerResponse = {
                        id: row.id,
                        general_manager_id: row.gmId,
                        name: row.gmName,
                        email: row.email,
                    };
                    onEdit(gm);
                }}
                onDelete={() => {
                    const gm: GeneralManagerResponse = {
                        id: row.id,
                        general_manager_id: row.gmId,
                        name: row.gmName,
                        email: row.email,
                    };
                    return onDelete(gm);
                }}
            />
        ),
    },
];
