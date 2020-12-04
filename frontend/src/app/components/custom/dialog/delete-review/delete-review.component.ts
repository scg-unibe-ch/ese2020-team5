import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Review } from '../../../../models/review.model';
import { ReviewService } from '../../../../services/review.service';

@Component({
  selector: 'app-delete-review',
  templateUrl: './delete-review.component.html',
  styleUrls: ['./delete-review.component.css']
})
export class DeleteReviewComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: Review,
    private reviewService: ReviewService
  ) { }

  deleteReview(): void {
    this.reviewService.deleteReview(this.data.reviewId).then(() => {
      location.reload();
    });
  }
}
