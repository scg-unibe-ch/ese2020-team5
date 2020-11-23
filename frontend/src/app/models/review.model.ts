export class Review {
  constructor(
    public reviewId: number,
    public review: string,
    public rating: number,
    public productId: number,
    public userId: number
  ) {}
}
