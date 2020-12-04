import { ProductAttributes, Product } from '../models/product.model';
import { User } from '../models/user.model';
import { Request } from 'express';
import { ProductImageAttributes, ProductImage } from '../models/productImage.model';
import { upload, MulterRequest } from '../middlewares/imageUpload';

export class ProductService {

    public create(product: ProductAttributes): Promise<ProductAttributes> {
        return Product.create(product)
            .then(created => Promise.resolve(created))
            .catch(() => Promise.reject('could not create the product!'));
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
            .then(product => {
                if (!!product) {
                    return User.findByPk(userId).then(user => {
                        if (user.isAdmin !== 1 && (product.userId !== userId || req.body.hasOwnProperty('approved'))) {
                            return Promise.reject('You are not authorized to do this!');
                        } else {
                            // if (found.userId == userId && req.body.has('approved')) {
                            //      return Promise.reject('You are not auth
                            return product.update(req.body).then(() => {
                                return Promise.resolve(product);
                            }).catch(() => Promise.reject('Could not update the product'));
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
            .then(product => {
                if (!!product) {
                    return User.findByPk(userId).then(user => {
                        if (user.isAdmin !== 1 && product.userId !== userId) {
                            return Promise.reject('You are not authorized to do this!');
                        } else {
                            return product.destroy()
                                .then(() => Promise.resolve(product))
                                .catch(() => Promise.reject('Could not remove the product'));
                        }
                    });
                } else {
                    return Promise.reject(product);
                }
            })
            .catch(err => Promise.reject(err));
    }

    public deleteImage(req: Request, userId: number): Promise<ProductImageAttributes> {
        return ProductImage.findByPk(req.params.id)
            .then(image => {
                if (!image) {
                    return Promise.reject('Image not found!');
                } else {
                    return Product.findByPk(image.productId)
                        .then(product => {
                            if (!product) {
                                return Promise.reject('Product not found!');
                            } else {
                                if (product.userId !== userId) {
                                    return Promise.reject('You are not authorized to do this!');
                                } else {
                                    return image.destroy()
                                        .then(() => Promise.resolve(image))
                                        .catch(() => Promise.reject('Could not remove the image'));
                                }
                            }
                        })
                        .catch(err => Promise.reject(err));
                }
            })
            .catch(err => Promise.reject(err));
    }

    public getAll(userId: number): Promise<Product[]> {
        return Product.findAll({where: { userId: userId }, include: [Product.associations.reviews, Product.associations.images]})
            .then(list => Promise.resolve(list))
            .catch(() => Promise.reject('Could not get the products!'));
    }

    public getOne(userId: number, productId: number): Promise<Product> {
        return Product.findByPk(productId, { include: [Product.associations.reviews, Product.associations.images]})
            .then(product => {
                if ( product.approved ) {
                    return Promise.resolve(product);
                } else if ( userId ) {
                    return User.findByPk(userId).then(user => {
                        if (user.isAdmin !== 1 && userId !== product.userId) {
                            return Promise.reject('You are not authorized to do this!');
                        } else {
                            return Promise.resolve(product);
                        }
                    });
                } else {
                    return Promise.reject('You are not authorized to do this!');
                }
            })
            .catch(err => Promise.reject(err));
    }

    public getCatalog(): Promise<Product[]> {
        return Product.findAll({where: { approved: 1 }, include: [Product.associations.reviews, Product.associations.images]})
            .then(list => Promise.resolve(list))
            .catch(() => Promise.reject('Could not get the catalog!'));
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
