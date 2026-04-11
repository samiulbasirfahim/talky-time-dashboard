import { PaymentTrendsChart } from "./payment-trends-chart";
import { TotalGroup } from "./total-group";

export function PaymentTrends_TotalGroups() {
    return (
        <div className="grid grid-cols-3 gap-4 w-full p-4">
            <div className="col-span-2">
                <PaymentTrendsChart />
            </div>
            <div className="col-span-1">
                <TotalGroup />
            </div>
        </div>
    );
}
