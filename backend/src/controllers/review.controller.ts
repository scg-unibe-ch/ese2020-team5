import express from 'express';
import { Router, Request, Response } from 'express';
import { Review } from '../models/review.model';
import {getUserId, verifyToken} from '../middlewares/checkAuth';
import {User} from '../models/user.model';

const reviewController: Router = express.Router();

reviewController.post('/', verifyToken, (req: Request, res: Response) => {
    req.body.userId = getUserId(req);
    Review.create(req.body)
        .then(inserted => res.send(inserted))
        .catch(err => res.status(500).send(err));
});

reviewController.put('/:id', verifyToken, (req: Request, res: Response) => {
    Review.findByPk(req.params.id)
        .then(found => {
            if (found != null) {
                if (found.userId !== getUserId(req)) {
                    return Promise.reject('You are not authorized to do this!');
                }
                found.update(req.body).then(updated => {
                    res.status(200).send(updated);
                });
            } else {
                res.sendStatus(404);
            }
        })
        .catch(err => res.status(500).send(err));

});

reviewController.delete('/:id', verifyToken, (req: Request, res: Response) => {
    const userId = getUserId(req);
    Review.findByPk(req.params.id)
        .then(found => {
            if (found != null) {
                return User.findByPk(userId)
                    .then(user => {
                        if (user.isAdmin !== 1 && found.userId !== userId) {
                            return Promise.reject('You are not authorized to do this!');
                        } else {
                            return found.destroy().then(() => res.status(200).send(found));
                        }
                    });
            } else {
                res.sendStatus(404);
            }
        })
        .catch(err => res.status(500).send(err));
});

export const ReviewController: Router = reviewController;
