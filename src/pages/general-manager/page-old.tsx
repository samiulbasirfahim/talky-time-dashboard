import { useEffect, useMemo, useState } from "react";
import { HeaderSection } from "../../components/header-section";
import {
    LargeSearchableDropdown,
    type LargeSearchableDropdownOption,
} from "../../components/large-searchable-dropdown";
import { AppTable, type TableColumn } from "../../components/table";
import { AppText } from "../../components/text";

type SupervisorRow = {
    supervisorId: string;
    supervisorName: string;
};

type OperatorGroupRow = {
    operatorId: string;
    operatorName: string;
};

type ProfileRow = {
    profileId: string;
    profileName: string;
    bonusPercentage: string;
    operator: string;
};

const groupOptions: LargeSearchableDropdownOption[] = [
    {
        value: "medellin-hub",
        label: "Medelline hub",
        subtitle: "Group ID: G-001",
        keywords: ["medelline", "hub", "g-001"],
    },
    {
        value: "bogota-shift-a",
        label: "Bogota shift A",
        subtitle: "Group ID: G-002",
        keywords: ["bogota", "shift", "g-002"],
    },
    {
        value: "cartagena-core",
        label: "Cartagena core",
        subtitle: "Group ID: G-003",
        keywords: ["cartagena", "core", "g-003"],
    },
];

const supervisorDataByGroup: Record<string, SupervisorRow[]> = {
    "medellin-hub": [
        { supervisorId: "S-1001", supervisorName: "Daniel Restrepo" },
        { supervisorId: "S-1002", supervisorName: "Camila Arango" },
        { supervisorId: "S-1003", supervisorName: "Santiago Ruiz" },
        { supervisorId: "S-1004", supervisorName: "Paula Montoya" },
        { supervisorId: "S-1005", supervisorName: "Andres Velez" },
    ],
    "bogota-shift-a": [
        { supervisorId: "S-2001", supervisorName: "Laura Tellez" },
        { supervisorId: "S-2002", supervisorName: "Juan Cardenas" },
        { supervisorId: "S-2003", supervisorName: "Mariana Gil" },
    ],
    "cartagena-core": [
        { supervisorId: "S-3001", supervisorName: "Valentina Mena" },
        { supervisorId: "S-3002", supervisorName: "Javier Rojas" },
    ],
};

const operatorGroupDataByGroup: Record<string, OperatorGroupRow[]> = {
    "medellin-hub": [
        { operatorId: "OP-010", operatorName: "Jhon Arboleda" },
        { operatorId: "OP-011", operatorName: "Maria Giraldo" },
        { operatorId: "OP-012", operatorName: "Kevin Osorio" },
        { operatorId: "OP-013", operatorName: "Diana Tapia" },
        { operatorId: "OP-014", operatorName: "Sofía Castaño" },
        { operatorId: "OP-015", operatorName: "Felipe Herrera" },
    ],
    "bogota-shift-a": [
        { operatorId: "OP-020", operatorName: "Nicolas Cifuentes" },
        { operatorId: "OP-021", operatorName: "Angie Romero" },
        { operatorId: "OP-022", operatorName: "Laura Pineda" },
        { operatorId: "OP-023", operatorName: "Camilo Toro" },
    ],
    "cartagena-core": [
        { operatorId: "OP-030", operatorName: "Carlos Barrios" },
        { operatorId: "OP-031", operatorName: "Martha Acosta" },
        { operatorId: "OP-032", operatorName: "Andrea Lugo" },
    ],
};

const profileDataByGroup: Record<string, ProfileRow[]> = {
    "medellin-hub": [
        {
            profileId: "P-5001",
            profileName: "Morning Sales",
            bonusPercentage: "12%",
            operator: "Jhon Arboleda",
        },
        {
            profileId: "P-5002",
            profileName: "Retention Core",
            bonusPercentage: "8%",
            operator: "Maria Giraldo",
        },
        {
            profileId: "P-5003",
            profileName: "Weekend Sprint",
            bonusPercentage: "15%",
            operator: "Kevin Osorio",
        },
        {
            profileId: "P-5004",
            profileName: "Night Assist",
            bonusPercentage: "9%",
            operator: "Diana Tapia",
        },
        {
            profileId: "P-5005",
            profileName: "Premium Desk",
            bonusPercentage: "13%",
            operator: "Sofía Castaño",
        },
    ],
    "bogota-shift-a": [
        {
            profileId: "P-6001",
            profileName: "Inbound Prime",
            bonusPercentage: "10%",
            operator: "Nicolas Cifuentes",
        },
        {
            profileId: "P-6002",
            profileName: "Outbound Boost",
            bonusPercentage: "14%",
            operator: "Angie Romero",
        },
    ],
    "cartagena-core": [
        {
            profileId: "P-7001",
            profileName: "Night Recovery",
            bonusPercentage: "11%",
            operator: "Carlos Barrios",
        },
        {
            profileId: "P-7002",
            profileName: "Cross Sell",
            bonusPercentage: "9%",
            operator: "Martha Acosta",
        },
        {
            profileId: "P-7003",
            profileName: "Premium Care",
            bonusPercentage: "12%",
            operator: "Andrea Lugo",
        },
    ],
};

const supervisorColumns: TableColumn<SupervisorRow>[] = [
    {
        key: "supervisorName",
        header: "Supervisor Name",
        render: (row) => <AppText variant="body" className="text-sm font-medium">{row.supervisorName}</AppText>,
    },
    {
        key: "supervisorId",
        header: "Supervisor ID",
        render: (row) => <AppText variant="description" className="text-sm">{row.supervisorId}</AppText>,
    },
];

const operatorGroupColumns: TableColumn<OperatorGroupRow>[] = [
    {
        key: "operatorName",
        header: "Operator Name",
        render: (row) => <AppText variant="body" className="text-sm font-medium">{row.operatorName}</AppText>,
    },
    {
        key: "operatorId",
        header: "Operator ID",
        render: (row) => <AppText variant="description" className="text-sm">{row.operatorId}</AppText>,
    },
];

const profileColumns: TableColumn<ProfileRow>[] = [
    {
        key: "profileId",
        header: "Profile ID",
        render: (row) => <AppText variant="description" className="text-sm">{row.profileId}</AppText>,
    },
    {
        key: "profileName",
        header: "Profile Name",
        render: (row) => <AppText variant="body" className="text-sm font-medium">{row.profileName}</AppText>,
    },
    {
        key: "bonusPercentage",
        header: "Bonus Percentage",
        render: (row) => <AppText variant="body" className="text-sm">{row.bonusPercentage}</AppText>,
    },
    {
        key: "operator",
        header: "Operator",
        render: (row) => <AppText variant="description" className="text-sm">{row.operator}</AppText>,
    },
];

const tableHeading = (title: string) => (
    <div className="border-b border-border px-6 py-3">
        <AppText variant="smallHeader" className="text-lg font-semibold">
            {title}
        </AppText>
    </div>
);

export function GeneralManagerPage() {
    const [selectedGroup, setSelectedGroup] = useState(groupOptions[0].value);
    const [supervisorPage, setSupervisorPage] = useState(1);
    const [operatorGroupPage, setOperatorGroupPage] = useState(1);
    const [profilePage, setProfilePage] = useState(1);

    const supervisorPageSize = 5;
    const operatorGroupPageSize = 5;
    const profilePageSize = 5;

    const supervisorData = useMemo(
        () => supervisorDataByGroup[selectedGroup] ?? [],
        [selectedGroup],
    );

    const operatorGroupData = useMemo(
        () => operatorGroupDataByGroup[selectedGroup] ?? [],
        [selectedGroup],
    );

    const profileData = useMemo(
        () => profileDataByGroup[selectedGroup] ?? [],
        [selectedGroup],
    );

    useEffect(() => {
        setSupervisorPage(1);
        setOperatorGroupPage(1);
        setProfilePage(1);
    }, [selectedGroup]);

    const pagedSupervisors = useMemo(() => {
        const start = (supervisorPage - 1) * supervisorPageSize;
        return supervisorData.slice(start, start + supervisorPageSize);
    }, [supervisorData, supervisorPage]);

    const pagedOperatorGroups = useMemo(() => {
        const start = (operatorGroupPage - 1) * operatorGroupPageSize;
        return operatorGroupData.slice(start, start + operatorGroupPageSize);
    }, [operatorGroupData, operatorGroupPage]);

    const pagedProfiles = useMemo(() => {
        const start = (profilePage - 1) * profilePageSize;
        return profileData.slice(start, start + profilePageSize);
    }, [profileData, profilePage]);

    return (
        <div>
            <HeaderSection
                title="General Manager"
                description="Manage general managers and oversee supervisor operations"
                buttons={[]}
                headerRight={
                    <LargeSearchableDropdown
                        label="Selected Group"
                        value={selectedGroup}
                        options={groupOptions}
                        onChange={setSelectedGroup}
                        placeholder="Search group"
                        className="w-90"
                    />
                }
            />

            <div className="space-y-4 p-4">


                <AppTable
                    columns={profileColumns}
                    data={pagedProfiles}
                    rowKey={(row) => row.profileId}
                    emptyText="No profiles found for this group."
                    tableAdditionalHeader={tableHeading("Profiles")}
                    pagination={{
                        currentPage: profilePage,
                        totalItems: profileData.length,
                        pageSize: profilePageSize,
                        onPageChange: setProfilePage,
                        itemLabel: "profiles",
                    }}
                />

                <div className="grid grid-cols-1 items-start gap-4 xl:grid-cols-2 xl:items-start">
                    <AppTable
                        columns={supervisorColumns}
                        data={pagedSupervisors}
                        rowKey={(row) => row.supervisorId}
                        emptyText="No supervisors found for this group."
                        tableAdditionalHeader={tableHeading("Supervisor")}
                        pagination={{
                            currentPage: supervisorPage,
                            totalItems: supervisorData.length,
                            pageSize: supervisorPageSize,
                            onPageChange: setSupervisorPage,
                            itemLabel: "supervisors",
                        }}
                    />

                    <AppTable
                        columns={operatorGroupColumns}
                        data={pagedOperatorGroups}
                        rowKey={(row) => row.operatorId}
                        emptyText="No operators found for this group."
                        tableAdditionalHeader={tableHeading("Operator Group")}
                        pagination={{
                            currentPage: operatorGroupPage,
                            totalItems: operatorGroupData.length,
                            pageSize: operatorGroupPageSize,
                            onPageChange: setOperatorGroupPage,
                            itemLabel: "operators",
                        }}
                    />
                </div>

            </div>
        </div>
    );
}