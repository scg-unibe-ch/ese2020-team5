import {Component, Injectable, OnInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';
import { AuthService } from '../../services/auth.service';
import { ImageService } from '../../services/image.service';
import { Review } from '../../models/review.model';
import { ProductImage } from '../../models/productImage.model';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  product: Product;
  avgRating = 0;
  imageIndex = 0;
  user: RestrictedUser;
  showImage = false;
  showReviews = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private authService: AuthService,
    public fakeService: FakeService,
    public imageService: ImageService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.productService.getProductById(parseInt(params.id, 10)).then(product => {
        this.product = product;
        this.user = this.fakeService.getUserById(product.userId);
        this.avgRating = this.fakeService.getAvgRatingOfProduct();
        this.product.reviews = this.fakeService.getFakeReviews();
        if (this.product.productId % 2 === 0) {
          this.product.images = this.fakeService.getFakeImages(this.product.productId);
        } else {
          this.product.images = [];
        }
      }).catch(() => location.assign('catalog'));
    });
    document.addEventListener('keydown', (event) => {
      if (event.keyCode === 37) {
        this.nextImage(-1);
      } else if (event.keyCode === 39) {
        this.nextImage(1);
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

  displayReviews(): void {
    this.showReviews = !this.showReviews;
    const reviewSection = (document.getElementsByClassName('product-reviews') as HTMLCollectionOf<HTMLElement>)[0];
    if (this.showReviews) {
      reviewSection.style.maxHeight = reviewSection.scrollHeight + 'px';
    } else {
      reviewSection.style.maxHeight = 0 + 'px';
    }
  }

  addToCart(): void {
    if (this.authService.isLoggedIn() && this.product.approved) {
      // ToDO: Add to cart
    } else {
      location.assign('login?returnURL=' + this.router.url);
    }
  }

  addToWishlist(): void {
    if (this.authService.isLoggedIn() && this.product.approved) {
      // ToDo:: Add to Wishlist
    } else {
      location.assign('login?returnURL=' + this.router.url);
    }
  }
}

@Injectable({
  providedIn: 'root'
})
class FakeService {
  getUserById(userId: number): RestrictedUser {
    return new RestrictedUser(userId, 'FakeUser', 4);
  }

  getAvgRatingOfProduct(): number {
    return 4.5;
  }

  getFakeImages(productId: number): ProductImage[] {
    return [
      {
        imageId: 1,
        fileName: 'https://static.digitecgalaxus.ch/Files/3/8/9/3/4/6/5/3/GV-N3070GAMING%20OC-8GD-2.png?impolicy=ProductTileImage&resizeWidth=1000&resizeHeight=1000&resizeType=downsize&quality=high&cropWidth=0&cropHeight=0',
        productId
      },
      {
        imageId: 2,
        fileName: 'https://static.digitecgalaxus.ch/Files/3/8/9/3/4/6/3/8/GV-N3070GAMING%20OC-8GD-7.png?impolicy=ProductTileImage&resizeWidth=1000&resizeHeight=1000&resizeType=downsize&quality=high&cropWidth=0&cropHeight=0',
        productId
      }
    ];
  }

  getFakeReviews(): Review[] {
    return [
      {
        reviewId: 1,
        review: 'Absolutely amazing! Can recommend it.',
        rating: 4.5,
        productId: 3,
        userId: 3
      },
      {
        reviewId: 2,
        review: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA' +
          'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
        rating: 0,
        productId: 3,
        userId: 5
      },
      {
        reviewId: 1,
        review: 'Absolutely amazing! Can recommend it.',
        rating: 4.5,
        productId: 3,
        userId: 3
      },
      {
        reviewId: 1,
        review: 'Absolutely amazing! Can recommend it.',
        rating: 4.5,
        productId: 3,
        userId: 3
      }
    ];
  }
}

class RestrictedUser {
  constructor(
    public userId,
    public userName,
    public avgRating
  ) {}
}
