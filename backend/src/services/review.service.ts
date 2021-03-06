import { Review, ReviewAttributes } from '../models/review.model';
import { User } from '../models/user.model';

export class ReviewService {

    public create(review: ReviewAttributes): Promise<ReviewAttributes> {
        return Promise.resolve()
            .then(() => {
                if (this.isRatingInRange(review.rating)) {
                    return Review.create(review);
                } else {
                    return Promise.reject({ message: 'Rating needs to be a number between 0 and 5' });
                }
            }).catch(err => Promise.reject(err));
    }

    public update(review: ReviewAttributes, reviewId: number | string, userId: number): Promise<ReviewAttributes> {
        return Review.findByPk(reviewId)
            .then((found) => {
                if (this.isNotNull(found)) {
                    return Promise.resolve(found);
                } else {
                    return Promise.reject({ message: 'Review is not found', status: 404 });
                }
            }).then((found) => {
                if (!this.doesUserIdMatch(found.userId, userId)) {
                    return Promise.reject({ message: 'You are not authorized to do this!', status: 500 });
                } else if (this.doesItContainRating(review) && !this.isRatingInRange(review.rating)) {
                    return Promise.reject({ message: 'Rating needs to be a number between 0 and 5', status: 500 });
                } else {
                    return found.update(review);
                }
            }).then(updated => {
                return Promise.resolve(updated);
            }).catch((err) => {
                if (!err.hasOwnProperty('status')) {
                    err.status = 500;
                }
                return Promise.reject(err);
            });
    }

    public delete(deleterId: number, reviewId: number | string): Promise<ReviewAttributes> {
        let foundReview: Review;
        return Review.findByPk(reviewId)
            .then((found) => {
                if (this.isNotNull(found)) {
                    foundReview = found;
                    return Promise.resolve();
                } else {
                    return Promise.reject({ message: 'Review is not found!', status: 404 });
                }
            }).then(() => {
                return User.findByPk(deleterId);
            }).then((user) => {
                if (!this.isUserAdmin(user) && !this.doesUserIdMatch(foundReview.userId, deleterId)) {
                    return Promise.reject({ message: 'You are not authorized to do this!', status: 500 });
                } else {
                    return foundReview.destroy();
                }
            }).then(() => {
                return Promise.resolve(foundReview);
            }).catch((err) => {
                if (!err.hasOwnProperty('status')) {
                    err.status = 500;
                }
                return Promise.reject(err);
            });
    }

    protected isRatingInRange(rating: number): boolean {
        return 0 <= rating && rating <= 5;
    }

    protected doesUserIdMatch(reviewerId: number, updaterId: number | string): boolean {
        return reviewerId === Number(updaterId);
    }

    protected isNotNull(review: Review | null): boolean {
        return !!review;
    }

    private doesItContainRating(review: ReviewAttributes): boolean {
        return 'rating' in review;
    }

    private isUserAdmin(user: User): boolean {
        return user.isAdmin === 1;
    }
}
