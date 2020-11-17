import { ProductAttributes, Product } from '../models/product.model';
import { User } from '../models/user.model';
import { Request } from 'express';
import { ProductImageAttributes, ProductImage } from '../models/productImage.model';
import { upload, MulterRequest } from '../middlewares/imageUpload';
import {Op} from 'sequelize';

export class ProductService {

    public create(product: ProductAttributes): Promise<ProductAttributes> {
        return Product.create(product).then(created => Promise.resolve(created)).catch(err => Promise.reject(err));
    }

    public addImage(req: MulterRequest, userId: number): Promise<ProductImageAttributes> {
        return Product.findByPk(req.params.id)
            .then(found => {
                if (!found) {
                    return Promise.reject('Product not found');
                } else if (found.userId !== userId) {
                    return Promise.reject('You are not authorized to do this!');
                } else {
                    return new Promise<ProductImageAttributes>((resolve, reject) => {
                        upload.single('image')(req, null, (error: any) => {
                            if (req.fileValidationError) {
                                reject(req.fileValidationError);
                            } else if (!req.file) {
                                reject('Please select an image to upload');
                            } else if (error) {
                                reject(error);
                            } else {
                                ProductImage.create({ fileName: req.file.filename, productId: found.productId })
                                    .then(created => resolve(created)).catch(err => reject(err));
                            }
                        });
                    });
                }
            })
            .catch(err => Promise.reject(err));
    }

    public update(req: Request, userId: number ): Promise<ProductAttributes> {
       return Product.findByPk(req.params.id)
            .then(found => {
                if (found != null) {
                    return User.findByPk(userId).then(user => {
                        if (user.isAdmin !== 1 && (found.userId !== userId || req.body.hasOwnProperty('approved'))) {
                            return Promise.reject('You are not authorized to do this!');
                        } else {
                            // if (found.userId == userId && req.body.has('approved')) {
                            //      return Promise.reject('You are not auth
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
        return Product.findAll({where: { userId: userId }, include: [Product.associations.reviews, Product.associations.images]})
            .then(list => Promise.resolve(list))
            .catch(err => Promise.reject(err));
    }

    public getCatalog(): Promise<Product[]> {
        return Product.findAll({where: { approved: 1 }, include: [Product.associations.reviews, Product.associations.images]})
            .then(list => Promise.resolve(list))
            .catch(err => Promise.reject(err));
    }

    public getUnavailableCatalog(userId: number|string): Promise<Product[]> {
        return Product.findAll({
            where: {
                [Op.and]: [
                    {userId: userId},
                    {approved: 1},
                    {status: 0}]
            }
        })
            .then(list => Promise.resolve(list))
            .catch(err => Promise.reject(err));
    }

    public getAdminCatalog(userId: number): Promise<Product[]> {
        return Product.findAll({where: { approved: 0 }, include: [Product.associations.images]})
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
