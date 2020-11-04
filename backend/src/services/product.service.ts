import { ProductAttributes, Product } from '../models/product.model';
import { User } from '../models/user.model';
import {Request} from 'express';

export class ProductService {

    public create(product: ProductAttributes): Promise<ProductAttributes> {
        return User.findByPk(product.userId)
            .then(usr => {
                if (!this.userExists(usr)) {
                    return Promise.reject({message: 'The User does not exist'});
                 } else if (this.productIsApproved(product)) {
                    return Promise.reject({message: 'The product should not be approved upon creation'});
                }
                return Product.create(product);
            }).then(prd => {
                return Promise.resolve(prd);
            }).catch(err => Promise.reject({message: err}) );
    }

    protected userExists = (usr: User | null) => !!usr;
    protected productIsApproved = (prd: Product | ProductAttributes) => prd.approved;

    /*public update(req: Request, userId: number ): Promise<ProductAttributes> {
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
    }*/

    public update(productId: number, product: ProductAttributes, userId: number ): Promise<ProductAttributes> {
        let prd: Product;
        return Product.findByPk(productId)
            .then(found => {
                prd = found;
                if (this.productExists(found)) {
                    return User.findByPk(userId);
                } else {
                    return Promise.reject('Product not found');
                }
            }).then(usr => {
                if (this.userExists(usr)
                    && !this.userIsAdmin(usr)
                    && !this.userHasId(usr, userId)) {
                    return Promise.reject('You are not authorized to do this!');
                } else {
                    return prd.update(product).then(() => {
                        return Promise.resolve(prd);
                    }).catch(err => Promise.reject(err));
                }
            });
            .catch(err => Promise.reject(err));
    }

    protected productExists = (prd: Product | null) => !!prd;
    protected userIsAdmin = (usr: User) => usr.isAdmin === 1;
    protected userHasId = (usr: User, id: number) => usr.userId === id;

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
        return Product.findAll({where: { userId: userId }})
            .then(list => Promise.resolve(list))
            .catch(err => Promise.reject(err));
    }

    public getCatalog(): Promise<Product[]> {
        return Product.findAll({where: { approved: 1 }})
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
