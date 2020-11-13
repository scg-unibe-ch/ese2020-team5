export class Product {
  constructor(
    public productId: number,
    public title: string,
    public type: number,
    public description: string,
    public images: string[],
    public location: string,
    public sellOrLend: number,
    public price: number,
    public priceKind: number,
    public status: boolean,
    public deliverable: boolean,
    public approved: boolean,
    public userId: number
  ) {}
}
