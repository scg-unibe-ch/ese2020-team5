import {Component, HostListener, Injectable, OnInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';
import { AuthService } from '../../services/auth.service';
import { ImageService } from '../../services/image.service';
import { CartItem } from '../../models/cartItem.model';
import { UserService } from '../../services/user.service';
import { CartService } from '../../services/cart.service';
import { ReviewService } from '../../services/review.service';
import { PublicUser } from '../../models/publicUser.model';
import { Review } from '../../models/review.model';
import { MatDialog } from '@angular/material/dialog';
import { ReviewFormComponent } from '../custom/dialog/review-form/review-form.component';
import { User } from '../../models/user.model';
import { DeleteReviewComponent } from '../custom/dialog/delete-review/delete-review.component';
import { WishlistService } from '../../services/wishlist.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  product: Product;
  user: User;
  userNamesOfReviews: string[] = [];
  avgRating = 0;
  avgRatingOfOwner = 0;
  imageIndex = 0;
  owner: PublicUser;
  showImage = false;
  wasPurchased = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private authService: AuthService,
    private userService: UserService,
    private cartService: CartService,
    private reviewService: ReviewService,
    private wishlistService: WishlistService,
    private dialog: MatDialog,
    public imageService: ImageService
  ) { }

  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (event.keyCode === 37) {
      this.nextImage(-1);
    } else if (event.keyCode === 39) {
      this.nextImage(1);
    }
  }

  ngOnInit(): void {
    this.productService.getProductById(parseInt(this.route.snapshot.params.id, 10)).then(product => {
      this.product = product;
      this.product.reviews = this.product.reviews.reverse();
      this.userService.getUserById(product.userId).then(user => this.owner = user);
      this.userService.getUser().then(user => this.user = user);
      this.initUserNamesOfReviews();
      this.initAvgRatingOfOwner();
      this.initWasPurchased();
      this.avgRating = this.reviewService.getAvgRating(this.product.reviews);
    });
  }

  initUserNamesOfReviews(): void {
    this.product.reviews.forEach(review => {
      this.userService.getUserById(review.userId).then(user => this.userNamesOfReviews.push(user.userName));
    });
  }

  initAvgRatingOfOwner(): void {
    this.productService.getProductsByUserId(this.product.userId).then(products => {
      const reviews: Review[] = [];
      products.forEach(product => reviews.push(...product.reviews));
      this.avgRatingOfOwner = this.reviewService.getAvgRating(reviews);
    });
  }

  initWasPurchased(): void {
    this.productService.getPurchasedProducts().then(products => {
      if (products.filter(product => product.productId === this.product.productId).length > 0) {
        this.wasPurchased = true;
      }
    });
  }

  closeNotification(): void {
    (document.getElementsByClassName('product-notification') as HTMLCollectionOf<HTMLElement>)[0]
      .style.display = 'none';
  }

  nextImage(i: number): void {
    let index = this.imageIndex;
    if ((index + i) > (this.product.images.length - 1)) {
      index = 0;
    } else if ((index + i) < 0) {
      index = this.product.images.length - 1;
    } else {
      index += i;
    }
    this.setImage(index);
  }

  setImage(i: number): void {
    this.imageIndex = i;
  }

  displayImage(): void {
    this.showImage = !this.showImage;
  }

  async validateAmount(): Promise<void> {
    try {
      const cartItems = await this.cartService.getCartItems();
      const item = cartItems.filter(cartItem => cartItem.productId === this.product.productId);
      if (item.length > 0 && this.product.type === 0 && this.product.sellOrLend === 0 && item[0].amountOrTime + 1 > this.product.amount) {
        return Promise.reject();
      } else {
        return Promise.resolve();
      }
    } catch (error) {
      return Promise.reject();
    }
  }

  addToCart(): void {
    if (this.authService.isLoggedIn() && this.product.approved) {
      this.validateAmount().then(() => {
        const cartItem: CartItem = {
          buyerId: this.user.userId,
          productId: this.product.productId,
          amountOrTime: 1
        };
        this.cartService.addCartItem(cartItem);
      });
    } else {
      location.assign('login?returnURL=' + this.router.url);
    }
  }

  async isNotInWishlist(): Promise<void> {
    try {
      const wishlistEntries = await this.wishlistService.getWishlist();
      if (wishlistEntries && wishlistEntries.some(entry => entry.productId === this.product.productId)) {
        return Promise.reject();
      } else {
        return Promise.resolve();
      }
    } catch (error) {
      return Promise.reject();
    }
  }

  addToWishlist(): void {
    if (this.authService.isLoggedIn() && this.product.approved) {
      this.isNotInWishlist().then(() => this.wishlistService.addToWishlist(this.product.productId));
    } else {
      location.assign('login?returnURL=' + this.router.url);
    }
  }

  addReview(): void {
    this.dialog.open(ReviewFormComponent, {
      data: {
        product: this.product
      }
    });
  }

  editReview(review: Review): void {
    this.dialog.open(ReviewFormComponent, {
      data: {
        product: this.product,
        review
      }
    });
  }

  deleteReview(review: Review): void {
    this.dialog.open(DeleteReviewComponent, {
      data: review
    });
  }
}
