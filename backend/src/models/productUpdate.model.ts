export interface ProductUpdate {
    title?: string;
    type?: number;
    description?: string;
    location?: string;
    sellOrLend?: number;
    price?: number;
    priceKind?: number;
    status?: number;
    deliverable?: number;
    approved?: number;
    userId?: number;
}
