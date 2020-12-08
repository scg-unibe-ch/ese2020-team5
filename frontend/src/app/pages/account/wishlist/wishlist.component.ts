import { Component, OnInit } from '@angular/core';
import { WishlistService } from '../../../services/wishlist.service';
import { Product } from '../../../models/product.model';
import { ProductService } from '../../../services/product.service';
import { WishlistEntry } from '../../../models/wishlistentry.model';
import { ImageService } from '../../../services/image.service';
import { CartService } from '../../../services/cart.service';
import { CartItem } from '../../../models/cartItem.model';
import { User } from '../../../models/user.model';
import { UserService } from '../../../services/user.service';
import { DataSharingService } from '../../../services/data-sharing.service';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css']
})
export class WishlistComponent implements OnInit {
  user: User;
  products: Product[];
  canBeMovedToCart = false;

  constructor(
    private userService: UserService,
    private wishlistService: WishlistService,
    private productService: ProductService,
    private cartService: CartService,
    private dataSharingService: DataSharingService,
    public imageService: ImageService
  ) { }

  ngOnInit(): void {
    this.wishlistService.getWishlist().then(wishlistEntries => {
        this.initProductsFromWishlist(wishlistEntries).then(() => this.initCanBeMovedToCart());
      });
    this.userService.getUser().then(user => this.user = user);
  }

  async initProductsFromWishlist(wishlistEntries: WishlistEntry[]): Promise<void> {
    try {
      if (wishlistEntries.length === 0) {
        this.products = [];
      }
      for (const wishlistEntry of wishlistEntries) {
        const product = await this.productService.getProductById(wishlistEntry.productId);
        if (!this.products) {
          this.products = [];
        }
        if (product) {
          this.products.push(product);
        }
      }
      return Promise.resolve();
    } catch (error) {
      return Promise.reject();
    }
  }

  initCanBeMovedToCart(): void {
    this.canBeMovedToCart = this.products.every(product => product.status);
  }

  async isNotInCart(product: Product): Promise<void> {
    try {
      const cartItems = await this.cartService.getCartItems();
      if (cartItems.some(cartItem => cartItem.productId === product.productId) || !product.approved || !product.status) {
        return Promise.reject();
      } else {
        return Promise.resolve();
      }
    } catch (error) {
      return Promise.reject();
    }
  }

  addAllToCart(): void {
    if (this.canBeMovedToCart) {
      this.products.forEach((product, index) => {
        this.addToCart(index);
      });
    }
  }

  clearList(): void {
    this.products.forEach((product, index) => {
      this.removeItem(index);
    });
  }

  addToCart(index: number): void {
    this.isNotInCart(this.products[index]).then(() => {
      const cartItem: CartItem = {
        buyerId: this.user.userId,
        productId: this.products[index].productId,
        amountOrTime: 1
      };
      this.cartService.addCartItem(cartItem).then(() => this.dataSharingService.updateCartItemsAmount());
    });
  }

  removeItem(index: number): void {
    this.wishlistService.removeFromWishlist(this.products[index].productId).then(deletedProduct => {
      this.products = this.products.filter(entry => entry.productId !== deletedProduct.productId);
      this.initCanBeMovedToCart();
    });
  }
}
