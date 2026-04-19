export type DiscountAdjustmentType = "DISCOUNT" | string;

export type DiscountItem = {
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
    adjustment_type: DiscountAdjustmentType;
    created_at: string;
};

export type DiscountPaginatedResponse = {
    count: number;
    next: string | null;
    previous: string | null;
    results: DiscountItem[];
};

export type CreateDiscountPayload = {
    operator_id: number;
    amount_cop: string;
    adjustment_date: string;
    description: string;
};

export type UpdateDiscountPayload = Partial<CreateDiscountPayload>;

export type DiscountMutationResponse = DiscountItem;

export type DeleteDiscountResponse = {
    detail?: string;
    [key: string]: unknown;
};