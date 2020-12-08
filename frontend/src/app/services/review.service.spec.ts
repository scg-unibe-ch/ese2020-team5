import { TestBed } from '@angular/core/testing';
import { ReviewService } from './review.service';
import { Review } from '../models/review.model';
import { HttpClientModule } from '@angular/common/http';

describe('ReviewService', () => {
  let service: ReviewService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule]
    });
    service = TestBed.inject(ReviewService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should calculate the average rating', () => {
    const dummyReviews: Review[] = [
      {
        reviewId: 1,
        review: 'Test1234',
        rating: 1,
        productId: 2,
        userId: 4
      },
      {
        reviewId: 2,
        review: 'Pretty good',
        rating: 4,
        productId: 2,
        userId: 1
      },
      {
        reviewId: 3,
        review: 'It\'s ok',
        rating: 2.5,
        productId: 2,
        userId: 3
      }
    ];
    expect(service.getAvgRating(dummyReviews)).toBe(2.5);
  });
});
