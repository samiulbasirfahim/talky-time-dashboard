import { RefreshCw, Upload } from "lucide-react";
import { AppText } from "../../components/text";

type Props = {
    title: string;
    description: string;
    ago: string;
    type: "csv_upload" | "profile_assign";
    isLast?: boolean;
};

export function SystemEvent(props: Props) {
    const isLast = props.isLast ?? false;
    return (
        <div className="w-full flex flex-row gap-6 items-center">
            <div className="relative py-4">
                <div className="bg-system-event-icon-bg rounded-full p-2 z-10">
                    {props.type !== "csv_upload" ? (
                        <RefreshCw className="text-bg" size={20} strokeWidth={2} />
                    ) : (
                        <Upload className="text-bg" size={20} strokeWidth={2} />
                    )}
                </div>
                <div
                    className="absolute w-0.5 left-1/2 -translate-x-1/2 h-full bg-system-evnet-divider top-1/2 bottom-0 z-[-1]"
                    style={{
                        display: isLast ? "none" : "block",
                    }}
                />
            </div>
            <div className="">
                <AppText variant="smallHeader">{props.title}</AppText>
                <AppText variant="description">
                    {props.description} • {props.ago}
                </AppText>
            </div>
        </div>
    );
}
