import { ProductAttributes, Product } from '../models/product.model';
import { User } from '../models/user.model';
import {Request} from 'express';

export class ProductService {

    public create(product: ProductAttributes): Promise<ProductAttributes> {
        return Product.create(product).then(created => Promise.resolve(created)).catch(err => Promise.reject(err));
    }

    public update(req: Request, userId: number ): Promise<ProductAttributes> {
       return Product.findByPk(req.params.id)
            .then(found => {
                if (found != null) {
                    return User.findByPk(userId).then(user => {
                        if (user.isAdmin !== 1 && found.userId !== userId) {
                            return Promise.reject('You are not authorized to do this!');
                        } else {
                            return found.update(req.body).then(() => {
                                return Promise.resolve(found);
                            }).catch(err => Promise.reject(err));
                        }
                    });
                } else {
                    return Promise.reject('Product not found');
                }
            })
            .catch(err => Promise.reject(err));
    }

    public delete(req: Request, userId: number): Promise<ProductAttributes> {
        return Product.findByPk(req.params.id)
            .then(found => {
                if (found != null) {
                    return User.findByPk(userId).then(user => {
                        if (user.isAdmin !== 1 && found.userId !== userId) {
                            return Promise.reject('You are not authorized to do this!');
                        } else {
                            return found.destroy()
                                .then(() => Promise.resolve(found))
                                .catch(err => Promise.reject(err));
                        }
                    });
                } else {
                    return Promise.reject(found);
                }
            })
            .catch(err => Promise.reject(err));
    }

    public getAll(userId: number): Promise<Product[]> {
        return Product.findAll({where: { userId: userId }, include: [Product.associations.reviews]})
            .then(list => Promise.resolve(list))
            .catch(err => Promise.reject(err));
    }

    public getCatalog(): Promise<Product[]> {
        return Product.findAll({where: { approved: 1 }, include: [Product.associations.reviews]})
            .then(list => Promise.resolve(list))
            .catch(err => Promise.reject(err));
    }

    public getAdminCatalog(userId: number): Promise<Product[]> {
        return Product.findAll({where: { approved: 0 }})
            .then(list => {
                return User.findByPk(userId).then(user => {
                    if (user.isAdmin !== 1) {
                        return Promise.reject('You are not authorized to do this!');
                    } else {
                        return Promise.resolve(list);
                    }
                });
            })
            .catch(err => Promise.reject(err));
    }
}
