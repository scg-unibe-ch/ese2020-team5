import express, { Router, Request, Response } from 'express';
import { ShoppingCartService } from '../services/shoppingcart.service';
import { verifyToken, getUserId } from '../middlewares/checkAuth';

const shoppingCartController: Router = express.Router();

const shoppingCartService = new ShoppingCartService();

/*shoppingCartController.post('/:id', verifyToken, (req: Request, res: Response) => {
    ShoppingCartService.create(req, getUserId(req))
        .then(created => res.send(created))
        .catch(err => res.status(500).send(err));
});*/

export const ShoppingCartController: Router = shoppingCartController;
