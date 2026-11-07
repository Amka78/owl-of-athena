export type Order = {
    id: string;
    billing_name?: string;
    billing_email?: string;
    amount_total?: number;
    status?: string;
    transaction_origin?: string;
    created_at?: string;
};
