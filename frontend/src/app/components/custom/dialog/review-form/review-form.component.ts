import {Component, Inject, Input, OnInit} from '@angular/core';
import { Review } from '../../../../models/review.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReviewService } from '../../../../services/review.service';
import { UserService } from '../../../../services/user.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Product } from '../../../../models/product.model';

@Component({
  selector: 'app-review-form',
  templateUrl: './review-form.component.html',
  styleUrls: ['./review-form.component.css']
})
export class ReviewFormComponent implements OnInit {
  reviewForm: FormGroup;
  userId: number;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { review: Review, product: Product },
    private formBuilder: FormBuilder,
    private reviewService: ReviewService,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.initializeForm();
    if (this.data.review) {
      this.initializeFormValues();
    }
  }

  initializeForm(): void {
    this.reviewForm = this.formBuilder.group({
      review: ['', Validators.required],
      rating: ['', Validators.required]
    });
  }

  initializeFormValues(): void {
    this.reviewForm.get('review').setValue(this.data.review.review);
    this.reviewForm.get('rating').setValue(this.data.review.rating);
  }

  createReview(): void {
    this.reviewService.createReview(Object.assign(this.reviewForm.value, { productId: this.data.product.productId }))
      .then(() => location.reload());
  }

  updateReview(): void {
    this.reviewService.updateReview(Object.assign(this.reviewForm.value, { reviewId: this.data.review.reviewId }))
      .then(() => location.reload());
  }
}
