import { ProductAttributes, Product } from '../models/product.model';
import {Request} from 'express';

export class ProductService {

    public create(product: ProductAttributes): Promise<ProductAttributes> {
        return Product.create(product).then(created => Promise.resolve(created)).catch(err => Promise.reject(err));
    }

    public update(req: Request): Promise<ProductAttributes> {
       return Product.findByPk(req.params.id)
            .then(found => {
                if (found != null) {
                    found.update(req.body).then(updated => {
                        return Promise.resolve(updated);
                    });
                } else {
                    return Promise.reject('Product not found');
                }
            })
            .catch(err => Promise.reject(err));
    }

    public delete(req: Request): Promise<ProductAttributes> {
        return Product.findByPk(req.params.id)
            .then(found => {
                if (found != null) {
                    found.destroy()
                        .then(item => Promise.resolve({ deleted: item }))
                        .catch(err => Promise.reject(err));
                } else {
                    return Promise.reject(found);
                }
            })
            .catch(err => Promise.reject(err));
    }

    /*
    public remove(product: ProductAttributes): Promise<ProductAttributes> {
        return Product.destroy({
            where: {
                productId: product.productId;
            }
        });
    }*/

    public getAll(userId: number): Promise<Product[]> {
        return Product.findAll({where: { userId: userId }})
            .then(list => Promise.resolve(list))
            .catch(err => Promise.reject(err));
        // return Product.findAll();
    }
}
