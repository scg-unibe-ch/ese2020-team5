export class CartItem {
  constructor(
    public buyerId: number,
    public productId: number,
    public amountOrTime: number
  ) {}
}
