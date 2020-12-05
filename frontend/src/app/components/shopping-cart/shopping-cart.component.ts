import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { CartItem } from '../../models/cartItem.model';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';
import { ImageService } from '../../services/image.service';
import { UserService } from '../../services/user.service';
import { MatDialog } from '@angular/material/dialog';
import { CheckoutComponent } from '../custom/dialog/checkout/checkout.component';
import { DataSharingService } from '../../services/data-sharing.service';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent implements OnInit {
  cartItems: CartItem[];
  products: Product[] = [];
  credits = 0;
  total = 0;

  constructor(
    private userService: UserService,
    private cartService: CartService,
    private productService: ProductService,
    private dataSharingService: DataSharingService,
    private dialog: MatDialog,
    public imageService: ImageService
  ) { }

  ngOnInit(): void {
    this.userService.getUser().then(user => {
      this.credits = user.credits;
    });
    this.cartService.getCartItems().then(cartItems => {
      this.cartItems = cartItems;
      this.cartItems.forEach(cartItem => {
        this.productService.getProductById(cartItem.productId).then(product => {
          this.products.push(product);
          if (this.products.length === this.cartItems.length) {
            this.calcTotal();
            this.cartItems.forEach((item, index) => {
              this.validateAmount(index);
            });
          }
        });
      });
    });
  }

  saveChange(cartItem: CartItem, index: number): void {
    this.validateAmount(index);
    this.cartService.updateCartItem(cartItem).then(() => this.dataSharingService.updateCartItemsAmount());
  }

  saveChanges(): void {
    this.cartItems.forEach((cartItem, index) => {
      this.saveChange(cartItem, index);
    });
  }

  addAmount(index: number): void {
    this.cartItems[index].amountOrTime++;
    this.saveChange(this.cartItems[index], index);
  }

  removeAmount(index: number): void {
    this.cartItems[index].amountOrTime--;
    this.saveChange(this.cartItems[index], index);
  }

  validateAmount(index: number): void {
    this.cartItems[index].amountOrTime = Math.floor(this.cartItems[index].amountOrTime);
    if (this.cartItems[index].amountOrTime < 1) {
      this.cartItems[index].amountOrTime = 1;
    } else if (this.products[index] && this.cartItems[index].amountOrTime > this.products[index].amount) {
      this.cartItems[index].amountOrTime = this.products[index].amount;
    }
    this.calcTotal();
  }

  removeCartItem(index: number): void {
    this.cartService.deleteCartItem(this.cartItems[index].productId).then(() => {
      this.dataSharingService.updateCartItemsAmount();
      this.cartItems.splice(index, 1);
      this.products.splice(index, 1);
      this.calcTotal();
    });
  }

  calcTotal(): void {
    this.total = 0;
    this.cartItems.forEach((cartItem, index) => {
      this.total += cartItem.amountOrTime * this.products[index].price;
    });
  }

  isMinOneProductDeliverable(): boolean {
    let deliverable = false;
    this.products.forEach(product => {
      if (product.deliverable) {
        deliverable = true;
      }
    });
    return deliverable;
  }

  checkout(): void {
    this.saveChanges();
    const deliverable = this.isMinOneProductDeliverable();
    this.dialog.open(CheckoutComponent, {
      data: {
        deliverable,
        total: this.total
      }
    });
  }
}
