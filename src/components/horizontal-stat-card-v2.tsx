import { Trash2 } from "lucide-react";
import { AppButton } from "./button";
import { AppText } from "./text";

type HorizontalStatCardV2Props = {
    title: string;
    description: string;
    descriptionSecs: string;
    value: string | number;
    lightColor: boolean;
    onDelete?: () => void;
};

export function HorizontalStatCardV2(props: HorizontalStatCardV2Props) {
    return (
        <div className="bg-bg-secondary flex flex-row w-full rounded-2xl overflow-hidden py-3 px-4 gap-4">
            <div
                className="w-2 bg-text-focus rounded-2xl"
                style={{
                    opacity: props.lightColor ? 0.2 : 1,
                }}
            />
            <div className="w-full flex-col flex justify-center">
                <div className="flex flex-row justify-between">
                    <AppText variant="smallHeader">{props.title}</AppText>
                    <AppText
                        variant="smallHeader"
                        style={{
                            color: props.lightColor
                                ? "var(--color-text-secondary)"
                                : "var(--color-text-focus)",
                        }}
                    >
                        {props.value}
                    </AppText>
                    {props.onDelete && (
                        <AppButton
                            variant="ghost"
                            onClick={props.onDelete}
                            aria-label={`Delete ${props.title}`}
                        >
                            <Trash2 className="text-bg-danger" />
                        </AppButton>
                    )}
                </div>
                <AppText variant="description">
                    {props.description} • {props.descriptionSecs}
                </AppText>
            </div>
        </div>
    );
}
