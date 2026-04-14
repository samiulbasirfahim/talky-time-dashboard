import { Moon, Plus, Sun, UserRound, UsersRound } from "lucide-react";
import React from "react";
import { AppButton } from "../../components/button";
import { AppInputField } from "../../components/form-field";
import { SegmentedTabBar, type SegmentedTabOption } from "../../components/segmented-tab-bar";
import { AppText } from "../../components/text";

type AssignMode = "single" | "mass";
type ShiftType = "day" | "night";

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
    const [operatorName, setOperatorName] = React.useState("");
    const [group, setGroup] = React.useState("Medellin");
    const [profileName, setProfileName] = React.useState("");

    return (
        <section className="rounded-3xl border border-border bg-white p-6">
            <AppText variant="header" className="text-text">
                Assign Profile
            </AppText>
            <AppText variant="description" className="mt-1">
                Configure active operator assignments
            </AppText>

            <div className="mt-6 space-y-5">
                <SegmentedTabBar
                    value={assignMode}
                    options={ASSIGN_MODE_OPTIONS}
                    onChange={setAssignMode}
                    wrapperClassName="w-full"
                />

                <AppInputField
                    id="operator-name"
                    label="Operator name"
                    type="text"
                    placeholder="Enter Profile name"
                    value={operatorName}
                    onChange={setOperatorName}
                    inputClassName="h-12 px-4"
                />

                <div className="space-y-2">
                    <label htmlFor="shift-type" className="block text-base font-medium text-text">
                        Shift Type
                    </label>
                    <div id="shift-type">
                        <SegmentedTabBar
                            value={shiftType}
                            options={SHIFT_OPTIONS}
                            onChange={setShiftType}
                            wrapperClassName="w-full"
                        />
                    </div>
                </div>

                <AppInputField
                    id="group"
                    label="Group"
                    type="text"
                    value={group}
                    onChange={setGroup}
                    inputClassName="h-12 px-4"
                />

                <AppInputField
                    id="profile-name"
                    label="Profile name"
                    type="text"
                    placeholder="Enter profile"
                    value={profileName}
                    onChange={setProfileName}
                    inputClassName="h-12 px-4 pr-16"
                    suffix={
                        <button
                            type="button"
                            className="absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-lg bg-white/45 text-text-secondary hover:bg-white/75"
                            aria-label="Add profile"
                        >
                            <Plus size={22} />
                        </button>
                    }
                />

                <AppButton type="button" variant="focus" fullWidth className="mt-1 h-12 rounded-xl text-sm font-semibold">
                    Assign Profile
                </AppButton>

                <AppText variant="description" className="px-6 text-center text-xs text-text-muted">
                    Assignments are logged instantly to the audit trail and operator dashboards.
                </AppText>
            </div>
        </section>
    );
}
