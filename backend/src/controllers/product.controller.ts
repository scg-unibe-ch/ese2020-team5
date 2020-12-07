import express, { Router, Request, Response } from 'express';
import { ProductService } from '../services/product.service';
import { verifyToken, getUserId } from '../middlewares/checkAuth';
import { MulterRequest } from '../middlewares/imageUpload';

const productController: Router = express.Router();
const productService = new ProductService();

productController.post('/', verifyToken, (req: Request, res: Response) => {
    productService.create(req.body).then(created => res.send(created)).catch(err => res.status(500).send(err));
});

productController.post('/:id/image', verifyToken, (req: MulterRequest, res: Response) => {
    productService.addImage(req, getUserId(req)).then(created => res.send(created)).catch(err => res.status(500).send(err));
});

productController.put('/:id', verifyToken, (req: Request, res: Response) => {
    productService.update(req, getUserId(req)).then(updated => res.send(updated)).catch(err => res.status(500).send(err));
});

productController.delete('/:id', verifyToken, (req: Request, res: Response) => {
    productService.delete(req, getUserId(req)).then(deleted => res.send(deleted)).catch(err => res.status(500).send(err));
});

productController.delete('/image/:id', verifyToken, (req: Request, res: Response) => {
    productService.deleteImage(req, getUserId(req)).then(deleted => res.send(deleted)).catch(err => res.status(500).send(err));
});

productController.get('/', verifyToken, (req: Request, res: Response) => {
    productService.getAll(getUserId(req)).then(products => res.send(products)).catch(err => res.status(500).send(err));
});

productController.get('/catalog', (req: Request, res: Response) => {
   productService.getCatalog().then(products => res.send(products)).catch(err => res.status(500).send(err));
});

productController.get('/admin-catalog', verifyToken, (req: Request, res: Response) => {
    productService.getAdminCatalog(getUserId(req)).then(products => res.send(products)).catch(err => res.status(500).send(err));
});

productController.get('/:id', (req: Request, res: Response) => {
    productService.getOne(getUserId(req), parseInt(req.params.id, 10))
        .then(products => res.send(products))
        .catch(err => res.status(500).send(err));
});

export const ProductController: Router = productController;
