import { Loader2, PenSquare, Trash2 } from "lucide-react";
import { AppButton } from "./button";
import { AppText } from "./text";
import { motion } from "motion/react";

type HorizontalStatCardV2Props = {
    title: string;
    description: string;
    descriptionSecs: string;
    value: string | number;
    lightColor: boolean;
    onDelete?: () => void;
    onEdit?: () => void;
    loadingEditBtn: boolean;
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
                        className="ml-auto"
                        style={{
                            color: props.lightColor
                                ? "var(--color-text-secondary)"
                                : "var(--color-text-focus)",
                        }}
                    >
                        {props.value}
                    </AppText>


                </div>
                <AppText variant="description">
                    {props.description} • {props.descriptionSecs}
                </AppText>
            </div>
            <div className="flex flex-col">
                {props.onDelete && (
                    <AppButton
                        variant="ghost"
                        onClick={props.onDelete}
                        aria-label={`Delete ${props.title}`}
                    >
                        <Trash2 className="text-bg-danger" />
                    </AppButton>
                )}
                <div className="flex items-center justify-center w-full h-10">
                    {props.onEdit && (

                        <button
                            onClick={props.onEdit}
                            aria-label={`Edit ${props.title}`}
                            disabled={props.loadingEditBtn}
                        >
                            {
                                props.loadingEditBtn ?
                                    (
                                        <motion.div
                                            animate={{
                                                rotate: 360,
                                            }}
                                            transition={{
                                                duration: 1,
                                                repeat: Infinity,
                                                ease: "linear",
                                            }}
                                        >
                                            <Loader2 />
                                        </motion.div>
                                    ) : (
                                        <PenSquare className="text-text-focus" />
                                    )
                            }
                        </button>
                    )}

                </div>
            </div>
        </div>
    );
}
