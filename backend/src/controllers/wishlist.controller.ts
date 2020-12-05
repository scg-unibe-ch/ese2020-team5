import express, { Router, Request, Response } from 'express';
import { WishlistService } from '../services/wishlist.service';
import { verifyToken, getUserId } from '../middlewares/checkAuth';

const wishlistController: Router = express.Router();

const wishlistService = new WishlistService();

wishlistController.get('/', verifyToken, (req: Request, res: Response) => {
    wishlistService.get(getUserId(req))
        .then(shoppingCart => res.send(shoppingCart))
        .catch(err => res.status(500).send(err));
});

wishlistController.post('/:id', verifyToken, (req: Request, res: Response) => {
    wishlistService.create(getUserId(req), req.params.id)
        .then(created => res.send(created))
        .catch(err => res.status(500).send(err));
});

wishlistController.delete('/:id', verifyToken, (req: Request, res: Response) => {
    wishlistService.delete(getUserId(req), req.params.id)
        .then(deleted => res.send(deleted))
        .catch(err => res.status(500).send(err));
});

export const WishlistController: Router = wishlistController;
