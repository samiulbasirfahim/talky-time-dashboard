export type PayoutBreakdownItem = {
    operator_id: string;
    operator_name: string;
    total_bonus_cop: string;
    bonus_21_cop: string;
    bonus_25_cop: string;
    gross_bonus_cop: string;
    total_deduction_cop: string;
    final_pay_cop: string;
};

export type PayoutBreakdownPaginatedResponse = {
    count: number;
    next: string | null;
    previous: string | null;
    results: PayoutBreakdownItem[];
};

export type PayoutBreakdownRequest = {
    year: number;
    month: number;
    page?: number;
};
