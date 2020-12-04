import { Product } from '../models/product.model';
import { WishlistAttributes, Wishlist } from '../models/wishlist.model';
import {User} from '../models/user.model';

export class WishlistService {

    public get(buyerId: number): Promise<Wishlist[]> {
        return Wishlist.findAll({where: {buyerId: buyerId}})
            .then(shoppingCartEntries => Promise.resolve(shoppingCartEntries))
            .catch(err => Promise.reject(err));
    }

    public create(wishlistItem: WishlistAttributes, buyerId: number, productId: string): Promise<WishlistAttributes> {
        wishlistItem.buyerId = buyerId;
        wishlistItem.productId = parseInt(productId, 10);

        return User.findByPk(buyerId)
            .then(user => {
                if (user === null) {
                    return Promise.reject('could not find User!');
                } else {
                    return Product.findByPk(wishlistItem.productId);
                }
            })
            .then(product => {
                if (!product) {
                    return Promise.reject('could not find the Product!');
                } else if ( product.approved !== 1) { // Check if the product is available and approved
                    return Promise.reject('product ' + product.title + ' is not approved yet!');
                } else {
                    return Wishlist.create(wishlistItem)
                        .catch(err => Promise.reject(err));
                }
            })
            .then(created => Promise.resolve(created))
            .catch(err => Promise.reject(err));
    }

    public delete(wishlistItem: WishlistAttributes, buyerId: number, productId: string): Promise<WishlistAttributes> {
        return Wishlist.findOne({where: { buyerId: buyerId, productId: productId}})
            .then(wishlistEntry => wishlistEntry.destroy()
                .then(() => Promise.resolve(wishlistEntry)))
            .catch(err => Promise.reject(err));
    }

 /*   public update(wishlistItem: WishlistAttributes, buyerId: number, productId: string): Promise<WishlistAttributes> {
        return Wishlist.findOne({where: { buyerId: buyerId, productId: productId}})
            .then(shoppingCartEntry => shoppingCartEntry.update(wishlistItem))
            .then(updated => Promise.resolve(updated))
            .catch(err => Promise.reject(err));
    }*/
}
