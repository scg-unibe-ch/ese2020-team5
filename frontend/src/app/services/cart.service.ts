import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CartItem } from '../models/cartItem.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  constructor(private httpClient: HttpClient) { }

  getCartItems(): Promise<CartItem[]> {
    return new Promise<CartItem[]>((resolve, reject) => {
      this.httpClient.get(environment.endpointURL + 'cart').subscribe((cartItems: CartItem[]) => {
        resolve(cartItems);
      }, (error: any) => {
        reject(error);
      });
    });
  }

  addCartItem(cartItem: CartItem): Promise<CartItem> {
    return new Promise<CartItem>((resolve, reject) => {
      this.httpClient.post(environment.endpointURL + 'cart/' + cartItem.productId, cartItem).subscribe((addedCartItem: CartItem) => {
        resolve(addedCartItem);
      }, (error: any) => {
        reject(error);
      });
    });
  }

  updateCartItem(cartItem: CartItem): Promise<CartItem> {
    return new Promise<CartItem>((resolve, reject) => {
      this.httpClient.put(environment.endpointURL + 'cart/' + cartItem.productId, cartItem).subscribe((updatedCartItem: CartItem) => {
        resolve(updatedCartItem);
      }, (error: any) => {
        reject(error);
      });
    });
  }

  deleteCartItem(productId: number): Promise<CartItem> {
    return new Promise<CartItem>((resolve, reject) => {
      this.httpClient.delete(environment.endpointURL + 'cart/' + productId).subscribe((deletedCartItem: CartItem) => {
        resolve(deletedCartItem);
      }, (error: any) => {
        reject(error);
      });
    });
  }

  buyCartItems(address?: any): Promise<string> {
    let deliveryAddress = {};
    if (address) {
      deliveryAddress = address;
    }
    return new Promise<string>((resolve, reject) => {
      this.httpClient.post(environment.endpointURL + 'cart/buy', deliveryAddress).subscribe((message: string) => {
        resolve(message);
      }, (error: any) => {
        reject(error);
      });
    });
  }
}
