import { Product } from '../models/product.model';
import { WishlistAttributes, Wishlist } from '../models/wishlist.model';
import {User} from '../models/user.model';
import {ShoppingCartService} from './shoppingcart.service';
import {ShoppingCartAttributes} from '../models/shoppingcart.model';

const shoppingCartService = new ShoppingCartService();

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
                } else if ( product.status !== 0 || product.approved !== 1) { // Check if the product is available and approved
                    return Promise.reject('product ' + product.title + ' is not available or not approved yet!');
                /*} else if ( product.type === 0 && product.amount < wishlistItem.amountOrTime) {
                    return Promise.reject('The stock of the product ' + product.title + ' is too low: ' + product.amount);*/
                } else {
                    return Wishlist.findOne({where: {buyerId: buyerId, productId: productId}})
                        .then(found => {
                            if (found !== null) {
                                // If there is already a shopping cart entry for this user and that product,
                                // simply sum up the current amountOrTime and the send amountOrTime value
                                const updateWishlistEntry = {
                                    amountOrTime: found.amountOrTime + wishlistItem.amountOrTime,
                                    buyerId: buyerId,
                                    productId: parseInt(productId, 10)
                                };
                                return this.update(updateWishlistEntry, buyerId, productId)
                                    .catch(err => Promise.reject(err));
                            } else {
                                // If there is no entry with this product from the user, add the entry
                                return Wishlist.create(wishlistItem)
                                    .catch(err => Promise.reject(err));
                            }
                        })
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

    public update(wishlistItem: WishlistAttributes, buyerId: number, productId: string): Promise<WishlistAttributes> {
        if (wishlistItem.amountOrTime === 0) {
            return this.delete(wishlistItem, buyerId, productId);
        } else {
            return Wishlist.findOne({where: { buyerId: buyerId, productId: productId}})
                .then(shoppingCartEntry => shoppingCartEntry.update(wishlistItem))
                .then(updated => Promise.resolve(updated))
                .catch(err => Promise.reject(err));
        }
    }

    public move(buyerId: number): Promise<String> {
        return Wishlist.findAll({where: {buyerId: buyerId}})
            .then(async(entries) => {
                if (!entries) {
                    return Promise.reject('Empty Wishlist!');
                }
                return entries.forEach(wishlistentry => {
                    const shoppingCartEntry: ShoppingCartAttributes = {
                        buyerId: wishlistentry.buyerId,
                        productId: wishlistentry.productId,
                        amountOrTime: wishlistentry.amountOrTime
                    };
                    shoppingCartService.create(shoppingCartEntry, wishlistentry.buyerId, wishlistentry.productId.toString())
                        .then(() => this.delete(wishlistentry, wishlistentry.buyerId, wishlistentry.productId.toString()))
                        .catch(() => Promise.reject('Could not move wishlist entry to shopping cart!'));
                });
            })
            .then(() => Promise.resolve('OK!'))
            .catch(err => Promise.reject(err));
    }

/*    public buy(buyerId: number): Promise<string> {
        const transactionService = new TransactionService();
        let totalPrice = 0;
        let userCredits = 0;

        return User.findByPk(buyerId)
            .then(user => {
                userCredits = user.credits;
                // Check if the user information is complete
                if (user.firstName == null || user.lastName == null || user.city == null || user.country == null || user.street == null) {
                    return Promise.reject('User information is incomplete, will not be able to deliver');
                }
            })
            .then(() => ShoppingCart.findAll( {where: {buyerId: buyerId }}))
            .then( async(shoppingCartEntries) => {
                // Check if the shopping cart is empty, if yes buy will fail
                if (shoppingCartEntries.length === 0) {
                    return Promise.reject('Shopping Cart is empty!');
                }

                // Calculate the total price of the shopping cart
                for (let i = 0; i < shoppingCartEntries.length; i++) {
                    totalPrice += await Product.findByPk(shoppingCartEntries[i].productId)
                        .then(product => product.price * shoppingCartEntries[i].amountOrTime);
                }

                // If the price of the shopping cart is higher than the credits of the user
                // then the checkout should not proceed
                if (totalPrice > userCredits) {
                    return Promise.reject('You do not have enough credits!');
                }

                return Promise.resolve(shoppingCartEntries);
            })
            .then( shoppingCartEntries => {
                // Go through every shopping cart entry and create a transaction
                // This way, all transactions are stored in the database
                for ( let i = 0; i < shoppingCartEntries.length; i++) {
                    transactionService.add(shoppingCartEntries[i])
                        .catch(err => Promise.reject(err));
                }
                return Promise.resolve(shoppingCartEntries);
            })
            .then(shoppingCartEntries => {
                // Delete the shopping cart entries in the database
                // e.g. clear the shopping cart
                for ( let i = 0; i < shoppingCartEntries.length; i++) {
                    shoppingCartEntries[i].destroy()
                        .catch(err => Promise.reject(err));
                }
            })
            .then(() => Promise.resolve('OK!'))
            .catch(err => Promise.reject(err));
    }*/
}
