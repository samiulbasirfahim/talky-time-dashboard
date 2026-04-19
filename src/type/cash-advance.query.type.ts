export type CashAdvanceAdjustmentType = "CASH_ADVANCE" | string;

export type CashAdvanceItem = {
    id: number;
    operator: number;
    operator_db_id: number;
    operator_id: string;
    operator_name: string;
    group_name: string;
    amount: number | string;
    amount_cop: number | string;
    reason: string;
    description: string;
    date: string;
    issue_date: string;
    adjustment_date: string;
    adjustment_type: CashAdvanceAdjustmentType;
    created_at: string;
};

export type CashAdvancePaginatedResponse = {
    count: number;
    next: string | null;
    previous: string | null;
    results: CashAdvanceItem[];
};

export type CreateCashAdvancePayload = {
    operator_id: number;
    amount_cop: string;
    adjustment_date: string;
    description: string;
};

export type UpdateCashAdvancePayload = Partial<CreateCashAdvancePayload>;

export type CashAdvanceMutationResponse = CashAdvanceItem;

export type DeleteCashAdvanceResponse = {
    detail?: string;
    [key: string]: unknown;
};