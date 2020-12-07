import express from 'express';
import { Router, Request, Response } from 'express';
import { getUserId, verifyToken } from '../middlewares/checkAuth';
import { ReviewService } from '../services/review.service';

const reviewController: Router = express.Router();
const reviewService = new ReviewService();

reviewController.post('/', verifyToken, (req: Request, res: Response) => {
    req.body.userId = getUserId(req);
    reviewService.create(req.body)
        .then(inserted => res.status(200).send(inserted))
        .catch(err => res.status(500).send(err));
});

reviewController.put('/:id', verifyToken, (req: Request, res: Response) => {
    reviewService.update(req.body, req.params.id, getUserId(req))
        .then(updated => res.status(200).send(updated))
        .catch(err => res.status(err.status).send({ message: err.message }));
});

reviewController.delete('/:id', verifyToken, (req: Request, res: Response) => {
    reviewService.delete(getUserId(req), req.params.id)
        .then(deleted => res.status(200).send(deleted))
        .catch(err => res.status(err.status).send({ message: err.message }));
});

export const ReviewController: Router = reviewController;
