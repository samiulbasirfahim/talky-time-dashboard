import { AppText } from "../../components/text";

type Props = {
    title: string;
    description: string;
    activeStatus: "active" | "inactive" | "partial";
    activeText: string;
};

export function OperatorHistoryCard(props: Props) {
    return (
        <div className="border-t border-t-border w-full py-4 flex flex-row justify-between">
            <div>
                <AppText variant="smallHeader">{props.title}</AppText>
                <AppText variant="description">{props.description}</AppText>
            </div>
            <div className="flex flex-col justify-center items-end">
                <AppText variant="caption">{props.activeText}</AppText>
                <div
                    className="rounded-full px-2 py-1 mt-1"
                    style={{
                        backgroundColor:
                            props.activeStatus === "active"
                                ? "var(--color-green-light)"
                                : props.activeStatus === "inactive"
                                    ? "var(--color-red-light)"
                                    : "var(--color-yellow-light)",
                    }}
                >
                    <p
                        className="uppercase text-xs"
                        style={{
                            color:
                                props.activeStatus === "active"
                                    ? "var(--color-green)"
                                    : props.activeStatus === "inactive"
                                        ? "var(--color-red)"
                                        : "var(--color-yellow)",
                        }}
                    >
                        {props.activeStatus}
                    </p>
                </div>
            </div>
        </div>
    );
}
