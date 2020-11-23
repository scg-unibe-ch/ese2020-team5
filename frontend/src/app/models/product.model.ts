import { Review } from './review.model';
import { ProductImage } from './productImage.model';

export class Product {
  constructor(
    public productId: number,
    public title: string,
    public type: number,
    public description: string,
    public images: ProductImage[],
    public location: string,
    public sellOrLend: number,
    public price: number,
    public priceKind: number,
    public status: number,
    public deliverable: number,
    public approved: number,
    public reviews: Review[],
    public userId: number
  ) {}
}
