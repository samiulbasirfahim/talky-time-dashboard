import { useNavigate } from "react-router";
import { AppButton } from "../../components/button";
import { AppText } from "../../components/text";

export function NotFound() {
    const navigate = useNavigate();
    return <div className="flex flex-col gap-6 items-center justify-center min-h-dvh">
        <AppText variant="largeHeader">Page Not Found</AppText>
        <AppButton variant="outline" onClick={() => navigate("/")}>
            Back To Home
        </AppButton>
    </div>;
}