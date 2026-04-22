import type { ReactNode } from "react";
import LOGIN_BG from "../../assets/login-bg.png";

type AuthLayoutProps = {
    children: ReactNode;
};

export function AuthLayout({ children }: AuthLayoutProps) {
    return (
        <div className="grid h-screen w-screen grid-cols-1 bg-login-image-bg md:grid-cols-3">
            <div className="hidden bg-login-image-bg md:col-span-2 md:flex md:items-center md:justify-center">
                <img src={LOGIN_BG} alt="LOGIN BG" className="w-1/2 contain-content" />
            </div>

            <div className="flex items-center justify-center bg-white shadow-lg">
                <div className="w-full max-w-md px-6 py-8 sm:px-8">{children}</div>
            </div>
        </div>
    );
}