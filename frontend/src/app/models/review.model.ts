export class Review {
  constructor(
    public reviewId: number,
    public review: string,
    public productId: number,
    public userId: number
  ) {}
}
