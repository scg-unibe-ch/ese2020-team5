import { Component, OnInit } from '@angular/core';
import { ReviewService } from '../../../services/review.service';
import { Review } from '../../../models/review.model';
import { Product } from '../../../models/product.model';
import { ProductService } from '../../../services/product.service';
import { MatDialog } from '@angular/material/dialog';
import { ReviewFormComponent } from '../../custom/dialog/review-form/review-form.component';

@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.css']
})
export class ReviewsComponent implements OnInit {
  products: Product[] = [];
  reviews: Review[];

  constructor(
    private reviewService: ReviewService,
    private productService: ProductService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.reviewService.getReviewsFromUser().then(reviews => {
      reviews.forEach(review => {
        this.productService.getProductById(review.productId).then(product => this.products.push(product));
      });
      this.reviews = reviews;
    });
  }

  editReview(review: Review, product: Product): void {
    this.dialog.open(ReviewFormComponent, {
      data: {
        product,
        review
      }
    });
  }
}
