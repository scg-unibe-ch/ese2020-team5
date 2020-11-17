export class Product {
  constructor(
    public productId: number,
    public title: string,
    public type: number,
    public description: string,
    public images: any[],
    public location: string,
    public sellOrLend: number,
    public price: number,
    public priceKind: number,
    public status: number,
    public deliverable: number,
    public approved: number,
    public reviews: any[],
    public userId: number
  ) {}
}
