import { useMemo, useState } from "react";
import { Download } from "lucide-react";
import { HeaderSection } from "../../components/header-section";
import { useDownloadPayoutCsv } from "../../lib/queries";
import { PayoutsCards } from "./payouts-cards";
import { PayoutSecondaryCard } from "./payoutsecondarycard";
import { PayoutsTable } from "./payouts-table";

type PayoutPeriod = {
    year: number;
    month: number;
    label: string;
};

const buildLast12Months = (): PayoutPeriod[] => {
    const now = new Date();

    return Array.from({ length: 12 }, (_, index) => {
        const date = new Date(now.getFullYear(), now.getMonth() - (11 - index), 1);

        return {
            year: date.getFullYear(),
            month: date.getMonth() + 1,
            label: date.toLocaleString("en-US", {
                month: "long",
                year: "numeric",
            }),
        };
    });
};

export function Payouts() {
    const periods = useMemo(() => buildLast12Months(), []);
    const [selectedPeriodIndex, setSelectedPeriodIndex] = useState(periods.length - 1);
    const [currentPage, setCurrentPage] = useState(1);
    const {
        mutate: downloadPayoutCsv,
        isPending: isDownloadingPayoutCsv,
    } = useDownloadPayoutCsv();

    const selectedPeriod = periods[selectedPeriodIndex] ?? periods[periods.length - 1];

    const handlePeriodChange = (nextIndex: number) => {
        setSelectedPeriodIndex(nextIndex);
        setCurrentPage(1);
    };

    const handleDownloadPayoutReport = () => {
        downloadPayoutCsv({
            year: selectedPeriod.year,
            month: selectedPeriod.month,
        });
    };

    return (
        <>
            <HeaderSection
                title="Payouts"
                description={`Performance analytics and group comparison`}
                buttons={[
                    {
                        label: "Download Payout Report",
                        icon: Download,
                        onClick: handleDownloadPayoutReport,
                        isLoading: isDownloadingPayoutCsv,
                        loadingLabel: "Downloading...",
                        disabled: isDownloadingPayoutCsv,
                    },
                ]}
            />

            <PayoutsCards />
            <PayoutSecondaryCard
                periods={periods}
                selectedPeriodIndex={selectedPeriodIndex}
                onSelectedPeriodIndexChange={handlePeriodChange}
            />

            <div className="p-4">
                <PayoutsTable
                    selectedYear={selectedPeriod.year}
                    selectedMonth={selectedPeriod.month}
                    selectedPeriodLabel={selectedPeriod.label}
                    currentPage={currentPage}
                    onPageChange={setCurrentPage}
                />
            </div>
        </>
    );
}
