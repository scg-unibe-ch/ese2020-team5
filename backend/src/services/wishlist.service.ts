import { Product } from '../models/product.model';
import { WishlistAttributes, Wishlist } from '../models/wishlist.model';
import {User} from '../models/user.model';

export class WishlistService {

    public get(buyerId: number): Promise<Wishlist[]> {
        return Wishlist.findAll({ where: { buyerId: buyerId } })
            .then(shoppingCartEntries => Promise.resolve(shoppingCartEntries))
            .catch(err => Promise.reject(err));
    }

    public create(buyerId: number, productId: string): Promise<WishlistAttributes> {
        const wishlistItem: WishlistAttributes = {
            buyerId: buyerId,
            productId: parseInt(productId, 10)
        };
        return User.findByPk(buyerId)
            .then(user => {
                if (!user) {
                    return Promise.reject('Could not find User!');
                } else {
                    return Product.findByPk(wishlistItem.productId);
                }
            })
            .then(product => {
                if (!product) {
                    return Promise.reject('Could not find the Product!');
                } else if ( product.approved !== 1) { // Check if the product is approved
                    return Promise.reject('Product ' + product.title + ' is not approved yet!');
                } else {
                    return Wishlist.create(wishlistItem);
                }
            })
            .then(created => Promise.resolve(created))
            .catch(err => Promise.reject(err));
    }

    public delete(buyerId: number, productId: string): Promise<WishlistAttributes> {
        return Wishlist.findOne({ where: { buyerId: buyerId, productId: productId } })
            .then(wishlistEntry => wishlistEntry.destroy()
                .then(() => Promise.resolve(wishlistEntry))
                .catch(err => Promise.reject(err)))
            .catch(err => Promise.reject(err));
    }
}
