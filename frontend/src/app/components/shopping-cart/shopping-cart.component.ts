import { Component, Injectable, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { Product } from '../../models/product.model';
import { CartItem } from '../../models/cartItem.model';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';

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
  product: Product;
  amountOrTime: number;

  constructor(
    private cartService: CartService,
    private productService: ProductService,
    private authService: AuthService,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.userService.getUser().then(user => {
      this.buyerId = user.userId;
      this.getCartItems();
    });
  } 

  getCartItems(): void {
    if (this.authService.isLoggedIn()) {
      this.userService.getUser().then(user => {
        this.cartService.getCartItems().then(cartItems => {
          this.cartItems = cartItems;
          for (let cartItem of cartItems) {
            console.log(cartItem.productId)
            this.productService.getProductById(cartItem.productId).then(product => {
              this.product = product;
              console.log(product.title, product.productId, product.price)
            });
          }
        });
      });
    } else {
      location.assign('login?returnURL=' + this.router.url);
    }
  }

  
  deleteCartItem (): void {
    if (this.authService.isLoggedIn() && this.product.approved) {
      this.userService.getUser().then(user => {
        const cartItem: CartItem = {
          buyerId: user.userId,
          productId: this.product.productId,
          amountOrTime: 1
        }
        this.cartService.deleteCartItem(cartItem);
        location.reload();
      });
    } else {
      location.assign('login?returnURL=' + this.router.url);
    }
  }

  incrementAmountOrTime() {
    
  }
}