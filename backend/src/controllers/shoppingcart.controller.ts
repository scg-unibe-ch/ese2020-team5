import express, { Router, Request, Response } from 'express';
import { ShoppingCartService } from '../services/shoppingcart.service';
import { verifyToken, getUserId } from '../middlewares/checkAuth';

const shoppingCartController: Router = express.Router();

const shoppingCartService = new ShoppingCartService();

shoppingCartController.post('/buy', verifyToken, (req: Request, res: Response) => {
    shoppingCartService.buy(getUserId(req))
        .then(bought => res.send(bought))
        .catch(err => res.status(500).send(err));
});

shoppingCartController.post('/:id', verifyToken, (req: Request, res: Response) => {
    shoppingCartService.create(req.body, getUserId(req), req.params.id)
        .then(created => res.send(created))
        .catch(err => res.status(500).send(err));
});

export const ShoppingCartController: Router = shoppingCartController;
