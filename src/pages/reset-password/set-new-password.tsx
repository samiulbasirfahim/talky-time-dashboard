import React from "react";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import { AppButton } from "../../components/button";
import { AppPasswordField } from "../../components/password-input-field";
import { AppText } from "../../components/text";
import { AuthLayout } from "../login/login-layout";

type PasswordRule = {
	label: string;
	passed: boolean;
};

export function SetNewPassword() {
	const [newPassword, setNewPassword] = React.useState("");
	const [confirmPassword, setConfirmPassword] = React.useState("");
	const navigate = useNavigate();

	const rules: PasswordRule[] = [
		{
			label: "8+ Characters",
			passed: newPassword.length >= 8,
		},
		{
			label: "One Symbol",
			passed: /[^A-Za-z0-9]/.test(newPassword),
		},
		{
			label: "Uppercase",
			passed: /[A-Z]/.test(newPassword),
		},
		{
			label: "One Number",
			passed: /\d/.test(newPassword),
		},
	];

	const passedRulesCount = rules.filter((rule) => rule.passed).length;

	const getStrengthLabel = () => {
		if (passedRulesCount <= 1) {
			return "Weak";
		}
		if (passedRulesCount <= 3) {
			return "Good";
		}
		return "Strong Enough";
	};

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		if (rules.some((rule) => !rule.passed)) {
			toast.error("Password does not meet all requirements.");
			return;
		}

		if (newPassword !== confirmPassword) {
			toast.error("Passwords do not match.");
			return;
		}

		toast.success("Password reset successful.");
		navigate("/login", { replace: true });
	};

	return (
		<AuthLayout>
			<div className="flex flex-col items-center">
				<div className="text-center">
					<AppText variant="largeHeader" className="text-center">
						Set new password
					</AppText>
					<AppText variant="description" className="mt-2 text-base text-center">
						Your new password must be different from previously used passwords.
					</AppText>
				</div>

				<form onSubmit={handleSubmit} className="mt-7 flex w-full flex-col gap-4">
					<AppPasswordField
						id="new-password"
						label="New Password"
						value={newPassword}
						onChange={setNewPassword}
						autoComplete="new-password"
						inputClassName="h-11"
						toggleAriaLabel="Toggle new password visibility"
					/>

					<AppPasswordField
						id="confirm-password"
						label="Confirm Password"
						value={confirmPassword}
						onChange={setConfirmPassword}
						autoComplete="new-password"
						inputClassName="h-11"
						toggleAriaLabel="Toggle confirm password visibility"
					/>

					<div className="rounded-lg border border-border bg-tab-bg p-4">
						<div className="mb-3 flex items-center justify-between">
							<AppText variant="description" className="text-sm font-semibold uppercase tracking-[0.12em] text-text-secondary">
								Strength
							</AppText>
							<AppText variant="description" style={{
								color: "var(--color-text-focus)"
							}} className="font-semibold text-text-focus">
								{getStrengthLabel()}
							</AppText>
						</div>

						<div className="mb-4 grid grid-cols-4 gap-2">
							{Array.from({ length: 4 }, (_, index) => (
								<span
									key={index}
									className={`h-1 rounded-full ${index < passedRulesCount ? "bg-text-focus" : "bg-border"}`}
								/>
							))}
						</div>

						<div className="grid grid-cols-2 gap-2">
							{rules.map((rule) => (
								<AppText
									key={rule.label}
									variant="description"
									className={`text-xs font-semibold uppercase tracking-widest ${rule.passed ? "text-text" : "text-text-muted"}`}
								>
									{rule.passed ? "[x] " : "[ ] "}
									{rule.label}
								</AppText>
							))}
						</div>
					</div>

					<AppButton type="submit" variant="focus" fullWidth className="h-11 rounded-lg text-sm font-semibold">
						Reset Password
					</AppButton>
				</form>
			</div>
		</AuthLayout>
	);
}
