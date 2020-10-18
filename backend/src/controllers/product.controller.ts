import express, { Router, Request, Response } from 'express';
import { ProductService } from '../services/product.service';
import { verifyToken } from '../middlewares/checkAuth';

const productController: Router = express.Router();

const productService = new ProductService();

productController.post('/add',
    (req: Request, res: Response) => {
        productService.add(req.body).then(add => res.send(add)).catch(err => res.status(500).send(err));
    }
);

productController.get('/', verifyToken, // you can add middleware on specific requests like that
    (req: Request, res: Response) => {
        productService.getAll().then(products => res.send(products)).catch(err => res.status(500).send(err));
    }
);

export const ProductController: Router = productController;
