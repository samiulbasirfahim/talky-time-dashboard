import React from "react";
import { useLocation, useNavigate } from "react-router";
import toast from "react-hot-toast";
import { MailCheck } from "lucide-react";
import { OTPInput, REGEXP_ONLY_DIGITS } from "input-otp";
import { AppButton } from "../../components/button";
import { AppText } from "../../components/text";
import { AuthLayout } from "../login/login-layout";

const OTP_LENGTH = 5;

export function ResetPasswordOtp() {
	const navigate = useNavigate();
	const location = useLocation();

	const email = (location.state as { email?: string } | null)?.email;
	const [otpCode, setOtpCode] = React.useState("");

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		if (otpCode.length !== OTP_LENGTH) {
			toast.error("Please enter the 5-digit verification code.");
			return;
		}

		navigate("/reset-password/set-new-password", {
			state: {
				email,
				otp: otpCode,
			},
		});
	};

	const handleResend = () => {
		toast.success("Verification code resent.");
	};

	return (
		<AuthLayout>
			<div className="flex flex-col items-center">
				<div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-bg-secondary text-text-focus">
					<MailCheck size={24} />
				</div>

				<div className="mt-5 text-center">
					<AppText variant="largeHeader" className="text-center">
						Check your email
					</AppText>
					<AppText variant="description" className="mt-2 text-base text-center">
						We&apos;ve sent a 5-digit verification code to your email.
					</AppText>
				</div>

				<form onSubmit={handleSubmit} className="mt-7 flex w-full flex-col gap-4">
					<div className="space-y-2">
						<AppText variant="description" className="font-semibold text-text">
							Verification Code
						</AppText>
						<OTPInput
							value={otpCode}
							onChange={setOtpCode}
							maxLength={OTP_LENGTH}
							pattern={REGEXP_ONLY_DIGITS}
							inputMode="numeric"
							containerClassName="w-full"
							render={({ slots }) => {
								return (
									<div className="flex items-center justify-between gap-2">
										{slots.map((slot, index) => (
											<div
												key={index}
												className={`h-11 flex-1 rounded-lg border bg-tab-bg text-center text-base font-semibold text-text-secondary transition-colors ${slot.isActive ? "border-text-focus bg-white" : "border-border"}`}
											>
												<div className="flex h-full items-center justify-center">
													{slot.char ?? slot.placeholderChar ?? "•"}
												</div>
											</div>
										))}
									</div>
								);
							}}
						/>
					</div>

					<AppButton type="submit" variant="focus" fullWidth className="h-11 rounded-lg text-sm font-semibold">
						Verify Code
					</AppButton>
				</form>

				<AppText variant="description" className="mt-5 text-base text-center text-text-secondary">
					Didn&apos;t receive the email?{" "}
					<button type="button" onClick={handleResend} className="font-semibold text-text-focus underline">
						Click to resend
					</button>
				</AppText>
			</div>
		</AuthLayout>
	);
}
