import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { CartItem } from '../models/cartItem.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  constructor(
    private httpClient: HttpClient,
  ) { }

  getCartItems(): Promise<CartItem[]> {
    return new Promise<CartItem[]>((resolve, reject) => {
      this.httpClient.get(environment.endpointURL + 'cart/' ).subscribe((cartItems: CartItem[]) => {
        resolve(cartItems);
      }, (error: any) => {
        reject(error);
      });
    });
  }

  deleteCartItem(cartItem: CartItem) {
    return new Promise<CartItem>((resolve, reject) => {
      this.httpClient.delete(environment.endpointURL + 'cart/' + cartItem.productId).subscribe((deletedCartItem: CartItem) => {
        resolve(deletedCartItem);
      }, (error: any) => {
        reject(error);
      });
    });
  }
}
