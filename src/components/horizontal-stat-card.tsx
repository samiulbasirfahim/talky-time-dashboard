import { AppText } from "./text";

type HorizontalStatCardProps = {
    title: string;
    description: string;
    value: string | number;
    lightColor: boolean;
};

export function HorizontalStatCard(props: HorizontalStatCardProps) {
    return (
        <div className="bg-bg-secondary flex flex-row w-full rounded-2xl overflow-hidden py-3 px-4 gap-4">
            <div
                className="w-2 bg-text-focus rounded-2xl"
                style={{
                    opacity: props.lightColor ? 0.2 : 1,
                }}
            />
            <div>
                <AppText variant="smallHeader">{props.title}</AppText>
                <AppText variant="description">{props.description}</AppText>
            </div>
            <AppText
                variant="header"
                className="ml-auto self-center"
                style={{
                    color: props.lightColor
                        ? "var(--color-text-secondary)"
                        : "var(--color-text-focus)",
                }}
            >
                {props.value}
            </AppText>
        </div>
    );
}
