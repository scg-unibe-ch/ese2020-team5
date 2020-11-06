import { ProductAttributes, Product } from '../models/product.model';
import { User } from '../models/user.model';
import {Request} from 'express';
import { ProductAndSeller } from '../models/productAndSeller.model';
import { ProductUpdate } from '../models/productUpdate.model';

export class ProductService {

    public create(prd: ProductAttributes): Promise<ProductAttributes> {
        if (this.preconditionsCreate(prd)) {
            return Product.create(prd)
                .then(created => Promise.resolve(created))
                .catch(err => Promise.reject(err));
        } else {
            return Promise.reject({message: 'Product attributes do not satisfy preconditions' });
        }
    }

    // TODO split this into "update" and "authorize"
    public update(upd: ProductUpdate, productId: number | string, userId: number ): Promise<ProductAttributes> {
        let prd: Product;
        let usr: User;
        return this.getProductAndSeller(productId, userId)
            .then((productAndSeller) => {
                prd = productAndSeller.product;
                usr = productAndSeller.seller;
                if (this.isAdmin(usr) || this.hasUserId(prd, userId)) {
                    return prd.update(upd);
                } else {
                    return Promise.reject('You are not authorized to do this!');
                }
            }).then(() => {
                return Promise.resolve(prd);
            }).catch((err) => {
                return Promise.reject({message: err});
            });
    }

    public delete(deleterId: number | string, userId: number): Promise<ProductAttributes> {
        let prd: Product;
        let usr: User;
        return this.getProductAndSeller(deleterId, userId)
            .then((productAndSeller) => {
                prd = productAndSeller.product;
                usr = productAndSeller.seller;
                if (this.isAdmin(usr) || this.hasUserId(prd, userId)) {
                    return prd.destroy();
                } else {
                    return Promise.reject('You are not authorized to do this!');
                }
            }).then(() => {
                return Promise.resolve(prd);
            }).catch((err) => {
                return Promise.reject({message: err});
            });
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
        let prd_list: Product[];
        return Product.findAll({where: {approved: 0}})
            .then((list) => {
                prd_list = list;
                return User.findByPk(userId);
            }).then((usr) => {
                if (this.isAdmin(usr)) {
                    return Promise.reject('You are not authorized to do this!');
                } else {
                    return Promise.resolve(prd_list);
                }
            }).catch(err => Promise.reject(err));
    }

    protected getProductAndSeller(productId: number | string, userId: number | string): Promise<ProductAndSeller> {
        let prd: Product = null;
        let usr: User = null;
        return this.getProductById(productId)
            .then((found_prd) => {
                prd = found_prd;
                return this.getUserById(userId);
            }).then((found_usr) => {
                usr = found_usr;
                return Promise.resolve();
            }).then(() => {
                return Promise.resolve({seller: usr, product: prd});
            }).catch((err) => {
                return Promise.reject({message: err});
            });
    }
    protected getProductById(id: number | string): Promise<Product> {
        return Product.findByPk(id)
            .then((found) => {
                if (this.productExists(found)) {
                    return Promise.resolve(found);
                } else {
                    return Promise.reject('Product with id ${id} not found');
                }
            });
    }
    protected getUserById(id: number | string): Promise<User> {
        return User.findByPk(id)
            .then((found) => {
                if (this.userExists(found)) {
                    return Promise.resolve(found);
                } else {
                    return Promise.reject('User with id ${id} not found');
                }
            });
    }
    protected userExists(usr: User | null) { return !!usr; }
    protected productExists(prd: null | Product): boolean { return !!prd; }
    protected isAdmin(usr: User) { return usr.isAdmin === 1; }
    protected hasUserId(prd: Product, id: number) { return prd.userId === id; }

    // TODO make sure that product attributes satisfy preconditions
    protected preconditionsCreate(prd: ProductAttributes): boolean {
        return true;
    }
}
