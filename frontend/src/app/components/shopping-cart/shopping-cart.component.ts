import { Component, Injectable, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { Product } from '../../models/product.model';
import { CartItem } from '../../models/cartItem.model';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { ImageService } from '../../services/image.service';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent implements OnInit {

  cartItems: CartItem[];
  buyerId: number;
  productId: number;
  cartItem: CartItem;
  products: Product[] = [];
  amountOrTime: number;
  totalPrice: number;

  constructor(
    private cartService: CartService,
    private productService: ProductService,
    private authService: AuthService,
    private userService: UserService,
    public imageService: ImageService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userService.getUser().then(user => {
      this.buyerId = user.userId;
      this.getCartItems();
    });
  } 

  getCartItems(): void {
    if (this.authService.isLoggedIn()) {
      this.cartService.getCartItems().then(cartItems => {
        this.cartItems = cartItems;
        for (let cartItem of cartItems) {
          this.productService.getProductById(cartItem.productId).then(product => {
            this.products.push(product);
          });
        }
      });
    } else {
      location.assign('login?returnURL=' + this.router.url);
    }
  }

  
  deleteCartItem (index: number): void {
      const cartItem: CartItem = {
        buyerId: this.buyerId,
        productId: this.products[index].productId,
        amountOrTime: 1
      }
      this.cartService.deleteCartItem(cartItem);
      location.reload();
  }

  incrementAmountOrTime(index:number, newAmountOrTime: number) {
    this.userService.getUser().then(user => {
      const cartItem: CartItem = {
        buyerId: user.userId,
        productId: this.products[index].productId,
        amountOrTime: [newAmountOrTime]
      }
      this.cartService.updateCartItem(cartItem);
    });
  }
  buy () {
    this.userService.getUser().then(user => {
      this.cartService.getCartItems().then(cartItems => {
        this.cartItems = cartItems;
        for (let cartItem of cartItems) {
          this.cartService.buy(cartItem.buyerId);
        }
      });
    });
  }
}