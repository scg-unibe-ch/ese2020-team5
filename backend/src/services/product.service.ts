import { ProductAttributes, Product } from '../models/product.model';

export class ProductService {

    // TODO: Products need approval from an admin before they get published
    public add(product: ProductAttributes): Promise<ProductAttributes> {
        return Product.create(product).then(added => Promise.resolve(added)).catch(err => Promise.reject(err));
    }

    public getAll(): Promise<Product[]> {
        return Product.findAll();
    }
}
