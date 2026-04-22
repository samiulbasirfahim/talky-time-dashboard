import React from "react";
import { ArrowLeft, ArrowRight, Undo2 } from "lucide-react";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import { AppButton } from "../../components/button";
import { AppInputField as AppInput } from "../../components/form-field";
import { AppText } from "../../components/text";
import { AuthLayout } from "../login/login-layout";

export function ResetPasswordEmail() {
	const [email, setEmail] = React.useState("");
	const navigate = useNavigate();

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			toast.error("Please enter a valid email address.");
			return;
		}

		navigate("/reset-password/otp", {
			state: {
				email,
			},
		});
	};

	return (
		<AuthLayout>
			<div className="flex flex-col items-center">
				<div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-bg-secondary text-text-focus">
					<Undo2 size={24} />
				</div>

				<div className="mt-5 text-center">
					<AppText variant="largeHeader" className="text-center">
						Forgot Password?
					</AppText>
					<AppText variant="description" className="mt-2 text-base text-center">
						No worries, we&apos;ll send you reset instructions.
					</AppText>
				</div>

				<form onSubmit={handleSubmit} className="mt-7 flex w-full flex-col gap-4">
					<AppInput
						id="reset-email"
						label="Email Address"
						type="email"
						value={email}
						onChange={setEmail}
						placeholder="name@company.com"
						required
						inputClassName="h-11"
					/>

					<AppButton
						type="submit"
						variant="focus"
						fullWidth
						className="h-11 rounded-lg text-sm font-semibold"
						suffixIcon={ArrowRight}
					>
						Reset Password
					</AppButton>
				</form>

				<AppButton
					type="button"
					variant="ghost"
					size="lg"
					prefixIcon={ArrowLeft}
					className="mt-6"
					onClick={() => navigate("/login")}
				>
					Back to Login
				</AppButton>
			</div>
		</AuthLayout>
	);
}
