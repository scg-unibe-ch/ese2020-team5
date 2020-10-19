import express, { Router, Request, Response } from 'express';
import { ProductService } from '../services/product.service';
import { verifyToken, getUserId } from '../middlewares/checkAuth';

const productController: Router = express.Router();

const productService = new ProductService();

productController.post('/', verifyToken, (req: Request, res: Response) => {
    productService.create(req.body).then(created => res.send(created)).catch(err => res.status(500).send(err));
});

// TODO: Currently the return value is not so beautiful, because it's empty. Need to fix to return the actual product
productController.put('/:id', verifyToken, (req: Request, res: Response) => {
    productService.update(req).then(updated => res.send(updated)).catch(err => res.status(500).send(err));
    /*
    Product.findByPk(req.params.id)
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

     */
});

// TODO: Currently the return value is not so beautiful, because it's empty. Need to fix to return the actual product
productController.delete('/:id', verifyToken, (req: Request, res: Response) => {
    productService.delete(req).then(deleted => res.send(deleted)).catch(err => res.status(500).send(err));

    /*Product.findByPk(req.params.id)
        .then(found => {
            if (found != null) {
                found.destroy()
                    .then(item => res.status(200).send({ deleted: item }))
                    .catch(err => res.status(500).send(err));
            } else {
                res.sendStatus(404);
            }
        })
        .catch(err => res.status(500).send(err));*/
});

productController.get('/', verifyToken, (req: Request, res: Response) => {
    productService.getAll(getUserId(req)).then(products => res.send(products)).catch(err => res.status(500).send(err));
    /*
    // this automatically fills each todolist with the according todoitems
    Product.findAll({ include: [Product.associations.todoItems] })
        .then(list => res.status(200).send(list))
        .catch(err => res.status(500).send(err));

     */
});


/* Old implementation
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
*/
export const ProductController: Router = productController;
