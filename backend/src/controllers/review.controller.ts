import express from 'express';
import { Router, Request, Response } from 'express';
import { Review } from '../models/review.model';

const reviewController: Router = express.Router();

reviewController.post('/', (req: Request, res: Response) => {
    Review.create(req.body)
        .then(inserted => res.send(inserted))
        .catch(err => res.status(500).send(err));
});

reviewController.put('/:id', (req: Request, res: Response) => {
    Review.findByPk(req.params.id)
        .then(found => {
            if (found != null) {
                found.update(req.body).then(updated => {
                    res.status(200).send(updated);
                });
            } else {
                res.sendStatus(404);
            }
        })
        .catch(err => res.status(500).send(err));

});

reviewController.delete('/:id', (req: Request, res: Response) => {
    Review.findByPk(req.params.id)
        .then(found => {
            if (found != null) {
                found.destroy().then(() => res.status(200).send(found));
            } else {
                res.sendStatus(404);
            }
        })
        .catch(err => res.status(500).send(err));
});

export const ReviewController: Router = reviewController;
