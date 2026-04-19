export type DebtAdjustmentType = "DEBT" | string;

export type DebtItem = {
    id: number;
    operator: number;
    operator_db_id: number;
    operator_id: string;
    operator_name: string;
    group: string;
    amount: number | string;
    amount_cop: number | string;
    reason: string;
    description: string;
    date: string;
    issue_date: string;
    adjustment_date: string;
    adjustment_type: DebtAdjustmentType;
    created_at: string;
};

export type DebtPaginatedResponse = {
    count: number;
    next: string | null;
    previous: string | null;
    results: DebtItem[];
};

export type CreateDebtPayload = {
    operator_id: number;
    amount_cop: string;
    adjustment_date: string;
    description: string;
};

export type UpdateDebtPayload = Partial<CreateDebtPayload>;

export type DebtMutationResponse = DebtItem;

export type DeleteDebtResponse = {
    detail?: string;
    [key: string]: unknown;
};