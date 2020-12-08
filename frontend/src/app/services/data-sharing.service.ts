import { Injectable } from '@angular/core';
import { CartService } from './cart.service';
import { NotificationService } from './notification.service';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class DataSharingService {
  public cartItemsAmount: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  public unreadNotificationsAmount: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  constructor(
    private cartService: CartService,
    private notificationService: NotificationService,
    private authService: AuthService
  ) {
    if (this.authService.isLoggedIn()) {
      this.updateCartItemsAmount();
      this.updateUnreadNotificationsAmount();
    }
  }

  updateCartItemsAmount(): void {
    let cartItemsAmount = 0;
    this.cartService.getCartItems().then(cartItems => {
      cartItems.forEach(cartItem => cartItemsAmount += cartItem.amountOrTime);
      return Promise.resolve();
    }).then(() => {
      this.cartItemsAmount.next(cartItemsAmount);
    }).catch(() => {
      this.cartItemsAmount.next(0);
    });
  }

  updateUnreadNotificationsAmount(): void {
    let unreadNotificationsAmount = 0;
    this.notificationService.getNotifications().then(notifications => {
      unreadNotificationsAmount = notifications.filter(notification => !notification.read).length;
      this.unreadNotificationsAmount.next(unreadNotificationsAmount);
    }).catch(() => {
      this.unreadNotificationsAmount.next(0);
    });
  }
}
