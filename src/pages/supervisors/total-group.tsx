import { Users } from "lucide-react";
import { AppButton } from "../../components/button";
import { HorizontalStatCardV2 } from "../../components/horizontal-stat-card-v2";
import { AppText } from "../../components/text";

export function TotalGroup() {
    return (
        <div className="shadow-border shadow-xs rounded-md w-full space-y-4 p-4">
            <div className="flex justify-between items-center">
                <AppText variant="header">Total Group</AppText>
                <AppButton prefixIcon={Users}>Create Group</AppButton>
            </div>
            <div className=" grid grid-cols-3 gap-x-3">
                <HorizontalStatCardV2
                    title="Medellin Hub"
                    description="18 Operator"
                    descriptionSecs="2 Supervisors"
                    value={"$112,400"}
                    lightColor={false}
                />

                <HorizontalStatCardV2
                    title="Medellin Hub"
                    description="18 Operator"
                    descriptionSecs="2 Supervisors"
                    value={"$112,400"}
                    lightColor={false}
                />
                <HorizontalStatCardV2
                    title="Medellin Hub"
                    description="18 Operator"
                    descriptionSecs="2 Supervisors"
                    value={"$112,400"}
                    lightColor={true}
                />
            </div>
        </div>
    );
}
