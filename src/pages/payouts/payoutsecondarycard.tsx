import React from "react";
import {
	ChevronLeft,
	ChevronRight,
	CircleDollarSign,
	Info,
	SquarePen,
} from "lucide-react";
import toast from "react-hot-toast";
import { AppButton } from "../../components/button";
import { AppModal } from "../../components/modal";
import { AppText } from "../../components/text";
import { useMe, useSystemSettings, useUpdateSystemSettings } from "../../lib/queries";

type PayoutPeriod = {
	year: number;
	month: number;
	label: string;
};

type PayoutSecondaryCardProps = {
	periods: PayoutPeriod[];
	selectedPeriodIndex: number;
	onSelectedPeriodIndexChange: (nextIndex: number) => void;
};

const formatLastUpdated = (timestamp?: string) => {
	if (!timestamp) {
		return "-";
	}

	const date = new Date(timestamp);
	if (Number.isNaN(date.getTime())) {
		return timestamp;
	}

	return date.toLocaleString("en-US", {
		year: "numeric",
		month: "short",
		day: "numeric",
		hour: "2-digit",
		minute: "2-digit",
		hour12: true,
	});
};

export function PayoutSecondaryCard({
	periods,
	selectedPeriodIndex,
	onSelectedPeriodIndexChange,
}: PayoutSecondaryCardProps) {

	const { data: me } = useMe();

	const [draftExchangeRate, setDraftExchangeRate] = React.useState("");
	const [isModalOpen, setIsModalOpen] = React.useState(false);
	const {
		data: settingsData,
		isLoading: isSettingsLoading,
	} = useSystemSettings();
	const {
		mutateAsync: updateSystemSettings,
		isPending: isUpdatingExchangeRate,
	} = useUpdateSystemSettings();

	const exchangeRate = settingsData?.exchange_rate_usd_to_cop ?? "0";
	const lastUpdated = formatLastUpdated(settingsData?.exchange_rate_updated_at);

	const currentPeriod =
		periods[selectedPeriodIndex]?.label ?? periods[periods.length - 1]?.label ?? "-";

	const canGoPreviousPeriod = selectedPeriodIndex > 0;
	const canGoNextPeriod = selectedPeriodIndex < periods.length - 1;

	const handleOpenModal = () => {
		setDraftExchangeRate(exchangeRate);
		setIsModalOpen(true);
	};

	const handleCloseModal = () => {
		setIsModalOpen(false);
		setDraftExchangeRate(exchangeRate);
	};

	const handleUpdateRate = async () => {
		const numericRate = Number(draftExchangeRate);
		if (!Number.isFinite(numericRate) || numericRate <= 0) {
			toast.error("Exchange rate must be a valid positive number.");
			return;
		}

		const normalizedRate = numericRate.toFixed(2);

		try {
			await updateSystemSettings({
				exchange_rate_usd_to_cop: normalizedRate,
			});
			toast.success("Exchange rate updated successfully.");
			setIsModalOpen(false);
		} catch {
			toast.error("Failed to update exchange rate. Please try again.");
		}
	};

	return (
		<>
			<section className="p-4 w-3/4">
				<div className="grid grid-cols-1 gap-4 xl:grid-cols-5">
					<div className="rounded-xl border border-border bg-bg p-4 shadow-[0_1px_2px_rgba(0,0,0,0.05)] xl:col-span-2">
						<div className="flex items-center justify-between gap-3">
							<button
								type="button"
								onClick={() => onSelectedPeriodIndexChange(selectedPeriodIndex - 1)}
								disabled={!canGoPreviousPeriod}
								aria-label="Select previous period"
								className="inline-flex h-9 w-9 items-center justify-center rounded-md text-text-secondary transition-colors hover:bg-bg-secondary disabled:cursor-not-allowed disabled:opacity-40"
							>
								<ChevronLeft size={18} />
							</button>

							<div className="text-center">
								<AppText
									variant="description"
									className="text-xs font-semibold uppercase tracking-[0.18em]"
								>
									Selected Period
								</AppText>
								<AppText variant="smallHeader" className="mt-1 text-2xl">
									{currentPeriod}
								</AppText>
							</div>

							<button
								type="button"
								onClick={() => onSelectedPeriodIndexChange(selectedPeriodIndex + 1)}
								disabled={!canGoNextPeriod}
								aria-label="Select next period"
								className="inline-flex h-9 w-9 items-center justify-center rounded-md text-text-secondary transition-colors hover:bg-bg-secondary disabled:cursor-not-allowed disabled:opacity-40"
							>
								<ChevronRight size={18} />
							</button>
						</div>
					</div>

					{
						me?.data.is_admin && (
							<div className="rounded-xl border border-border bg-bg p-4 shadow-[0_1px_2px_rgba(0,0,0,0.05)] xl:col-span-3">
								<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
									<div className="flex items-center gap-3">
										<div className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#F3B20026] text-[#F3B200]">
											<CircleDollarSign size={26} />
										</div>

										<div>
											<AppText
												variant="description"
												className="text-xs font-semibold uppercase tracking-[0.12em]"
											>
												Exchange Rate (COP per USD)
											</AppText>
											<div className="mt-1 flex items-center gap-2 bg-bg-secondary px-2 py-1 rounded flex-row justify-between">
												<AppText variant="smallHeader" className="text-[2rem] leading-none">
													{isSettingsLoading ? "Loading..." : `$${Number(exchangeRate).toLocaleString("en-US")}`}
												</AppText>

												<AppButton
													variant="ghost"
													size="sm"
													aria-label="Edit exchange rate"
													onClick={handleOpenModal}
													disabled={isSettingsLoading}
													className="h-8 w-8 p-0"
												>
													<SquarePen size={22} />
												</AppButton>
											</div>
										</div>
									</div>

									<div className="border-border md:border-l md:pl-6">
										<AppText
											variant="description"
											className="text-xs font-semibold uppercase tracking-[0.12em]"
										>
											Last Updated
										</AppText>
										<AppText variant="body" className="mt-1 font-semibold">
											{lastUpdated}
										</AppText>
									</div>
								</div>
							</div>
						)
					}
				</div>
			</section>

			<AppModal
				open={isModalOpen}
				onClose={handleCloseModal}
				ariaLabel="Edit exchange rate"
				contentClassName="max-w-md rounded-xl p-6"
			>
				<div className="space-y-5">
					<div className="flex items-center gap-3">
						<div className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-bg-focus text-text-focus">
							<CircleDollarSign size={22} />
						</div>
						<AppText variant="smallHeader" className="text-3xl">
							Edit Exchange Rate
						</AppText>
					</div>

					<div className="rounded-lg bg-bg-secondary px-3 py-3">
						<div className="flex items-start gap-2">
							<Info size={16} className="mt-0.5 shrink-0 text-text-focus" />
							<AppText variant="description" className="text-sm">
								Updating the exchange rate will recalculate all operator payouts for
								the selected month.
							</AppText>
						</div>
					</div>

					<div className="space-y-2">
						<AppText variant="description" className="font-semibold text-text">
							Exchange Rate (Per 01 USD)
						</AppText>

						<div className="flex h-12 items-center rounded-lg border border-border bg-tab-bg px-3">
							<span className="text-base font-semibold text-text-secondary">$</span>
							<input
								type="number"
								min="1"
								value={draftExchangeRate}
								disabled={isUpdatingExchangeRate}
								onChange={(event) => setDraftExchangeRate(event.target.value)}
								onKeyDown={(event) => {
									if (event.key === "Enter") {
										event.preventDefault();
										handleUpdateRate();
									}
								}}
								className="mx-2 w-full border-none bg-transparent text-lg font-semibold text-text outline-none"
							/>
							<span className="text-sm font-semibold uppercase tracking-[0.14em] text-text-secondary">
								COP
							</span>
						</div>
					</div>

					<div className="grid grid-cols-2 gap-3 pt-1">
						<AppButton
							variant="outline"
							size="md"
							onClick={handleCloseModal}
							disabled={isUpdatingExchangeRate}
							className="w-full"
						>
							Cancel
						</AppButton>
						<AppButton
							variant="focus"
							size="md"
							onClick={handleUpdateRate}
							isLoading={isUpdatingExchangeRate}
							loadingLabel="Updating..."
							disabled={isUpdatingExchangeRate}
							className="w-full"
						>
							Update Rate
						</AppButton>
					</div>
				</div>
			</AppModal>
		</>
	);
}
