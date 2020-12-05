import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Review } from '../models/review.model';
import { environment } from '../../environments/environment';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  constructor(private httpClient: HttpClient) { }

  getReviewsFromUser(): Promise<Review[]> {
    return new Promise<Review[]>((resolve, reject) => {
      this.httpClient.get(environment.endpointURL + 'user/reviews').subscribe((reviews: Review[]) => {
        resolve(reviews);
      }, (error: any) => {
        reject(error);
      });
    });
  }

  createReview(review: Review): Promise<Review> {
    return new Promise<Review>((resolve, reject) => {
      this.httpClient.post(environment.endpointURL + 'review', review).subscribe((createdReview: Review) => {
        resolve(createdReview);
      }, (error: any) => {
        reject(error);
      });
    });
  }

  updateReview(review: Review): Promise<Review> {
    return new Promise<Review>((resolve, reject) => {
      this.httpClient.put(environment.endpointURL + 'review/' + review.reviewId, review).subscribe((updatedReview: Review) => {
        resolve(updatedReview);
      }, (error: any) => {
        reject(error);
      });
    });
  }

  deleteReview(reviewId: number): Promise<Review> {
    return new Promise<Review>((resolve, reject) => {
      this.httpClient.delete(environment.endpointURL + 'review/' + reviewId).subscribe((review: Review) => {
        resolve(review);
      }, (error: any) => {
        reject(error);
      });
    });
  }

  getAvgRating(reviews: Review[]): number {
    let totalRating = 0;
    reviews.forEach(review => totalRating += review.rating);
    return (reviews.length > 0 ? totalRating / reviews.length : 0);
  }
}
