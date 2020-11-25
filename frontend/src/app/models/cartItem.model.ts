import { from } from 'rxjs';
import { Product } from '../models/product.model'
import { User } from '../models/user.model'

export class CartItem {
    buyerId: number;
    productId: number;
    amountOrTime: number;

    constructor(product: Product, user: User, amountOrTime = 1) {
        this.buyerId = user.userId;
        this.productId = product.productId;
        this.amountOrTime = amountOrTime;
    }
  }