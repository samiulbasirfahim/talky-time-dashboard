import React from "react";
import { AppButton } from "../../components/button";
import { Logo } from "../../components/logo";
import { AppPasswordField } from "../../components/password-input-field";
import { AppText } from "../../components/text";
import { useLocation, useNavigate } from "react-router";
import toast from "react-hot-toast";
import { useLogin } from "../../lib/queries";
import { AuthLayout } from "./login-layout";

export function Login() {
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const navigate = useNavigate();
    const location = useLocation();

    const {mutate} = useLogin();

    const from = (location.state as { from?: string })?.from ?? "/";



    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const emialRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emialRegex.test(email)) {
            toast.error("Please enter a valid email address.");
            return;
        }

        if (password.trim() === "") {
            toast.error("Please enter your password.");
            return;
        }

        mutate({ email, password }, {
            onSuccess: () => {
                toast.success("Login successful!");
                navigate(from, { replace: true });
            },
            onError: (error) => {
                toast.error("Login failed. Please check your credentials and try again.");
                console.error("Login error: ", error);
            }
        });
    };

    return (
        <AuthLayout>
            <div className="flex flex-col items-center">
                <Logo hasBorder={false} logo="https://thumbs.dreamstime.com/b/vector-logo-colorful-design-41236752.jpg" subtitle="Talky Time" title="talkytime" />

                <AppText variant="body" className="mt-2 text-center font-semibold text-text-secondary">
                    Login into your account
                </AppText>

                <form onSubmit={handleSubmit} className="mt-8 flex w-full flex-col gap-5">

                    <div className="flex flex-col gap-2">
                        <label htmlFor="email" className="text-base text-text-secondary">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            placeholder="Enter your Email"
                            onChange={(event) => setEmail(event.target.value)}
                            className="h-11 rounded-lg border border-border bg-tab-bg px-4 text-sm text-text-secondary outline-none placeholder:text-text-muted focus:border-text-focus focus:bg-white"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <AppPasswordField
                            id="password"
                            label="Password"
                            value={password}
                            onChange={setPassword}
                            placeholder="Enter your password"
                            autoComplete="current-password"
                            inputClassName="h-11"
                            toggleAriaLabel="Toggle login password visibility"
                        />
                    </div>
{/* 
                    <Link to="/reset-password/email" className="ml-auto text-sm text-text-focus underline">
                        Forgot password?
                    </Link> */}

                    <AppButton type="submit" variant="focus" fullWidth className="mt-2 h-11 rounded-lg text-sm font-semibold">
                        Sign In
                    </AppButton>
                </form>
            </div>
        </AuthLayout>
    );
}