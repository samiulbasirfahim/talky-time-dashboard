import React from "react";
import LOGIN_BG from "../../assets/login-bg.png";
import { Lock } from "lucide-react";
import { AppButton } from "../../components/button";
import { Logo } from "../../components/logo";
import { AppText } from "../../components/text";
import { useNavigate, useLocation } from "react-router";
import toast from "react-hot-toast";
import { useLogin } from "../../lib/queries";

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
        <div className="grid h-screen w-screen grid-cols-1 bg-login-image-bg md:grid-cols-3">
            <div className="hidden bg-login-image-bg md:col-span-2 md:flex md:items-center md:justify-center">
                <img src={LOGIN_BG} alt="LOGIN BG" className="w-1/2 contain-content" />
            </div>
            <div className="flex items-center justify-center bg-white shadow-lg ">
                <div className="w-full max-w-md px-6 py-8 sm:px-8 flex flex-col items-center">
                    <Logo hasBorder={false} logo="https://thumbs.dreamstime.com/b/vector-logo-colorful-design-41236752.jpg" subtitle="Multi-Operator" title="Logo Name" />

                    <AppText variant="body" className="mt-2 text-center font-semibold text-text-secondary">
                        Login into your account
                    </AppText>

                    <form onSubmit={handleSubmit} className="mt-8 flex w-full flex-col gap-5">

                        <div className="flex flex-col gap-2">
                            <label htmlFor="email" className="text-base text-text-secondary">
                                Email Id :
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
                            <label htmlFor="password" className="text-base text-text-secondary">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(event) => setPassword(event.target.value)}
                                    placeholder="Enter your password"
                                    className="h-11 w-full rounded-lg border border-border bg-tab-bg px-4 pr-11 text-sm text-text-secondary outline-none placeholder:text-text-muted focus:border-text-focus focus:bg-white"
                                />
                                <Lock
                                    size={18}
                                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-text-muted"
                                />
                            </div>
                        </div>

                        <a href="#" className="ml-auto text-sm text-text-focus underline">
                            Forgot password?
                        </a>

                        <AppButton type="submit" variant="focus" fullWidth className="mt-2 h-11 rounded-lg text-sm font-semibold">
                            Sign In
                        </AppButton>
                    </form>
                </div>
            </div>

        </div>
    );
}