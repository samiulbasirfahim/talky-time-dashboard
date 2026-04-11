import { AlertCircle, ChevronsRight } from "lucide-react";
import { AppButton } from "./button";
import { AppText } from "./text";

type ErrorActionBannerProps = {
    text: string;
    description: string;
    buttonText: string;
    onPress?: () => void;
};

export function ErrorActionBanner({
    text,
    description,
    buttonText,
    onPress,
}: ErrorActionBannerProps) {
    return (
        <div className="relative flex w-full items-center justify-between overflow-hidden rounded-xl bg-red-light py-2 ps-2 pe-5 shadow-sm">
            <div className="absolute inset-y-0 left-0 w-2 bg-red" />
            <div className="flex items-start gap-4 pl-2">
                <div className="flex h-11 w-11 self-center shrink-0 items-center justify-center rounded-full bg-red-light">
                    <AlertCircle size={32} fill={"#b91c1c"} stroke="white" />
                </div>

                <div className="space-y-1">
                    <AppText
                        variant="body"
                        className="text-base font-semibold leading-6 text-red"
                    >
                        {text}
                    </AppText>
                    <AppText
                        variant="description"
                        className="max-w-sm text-sm leading-5 font-normal text-red"
                    >
                        {description}
                    </AppText>
                </div>
            </div>

            <AppButton
                variant="focus"
                onClick={onPress}
                suffixIcon={ChevronsRight}
                className="rounded-lg border-red bg-red px-6 py-2 font-bold text-text-danger hover:opacity-90"
            >
                {buttonText}
            </AppButton>
        </div>
    );
}
