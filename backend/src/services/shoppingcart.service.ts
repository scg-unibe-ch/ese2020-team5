import { Product } from '../models/product.model';
import { ShoppingCartAttributes, ShoppingCart } from '../models/shoppingcart.model';
import { User } from '../models/user.model';
import { TransactionService } from './transaction.service';
import { Address } from '../models/address.model';
import { NotificationService } from './notification.service';


export class ShoppingCartService {

    public get(buyerId: number): Promise<ShoppingCart[]> {
        return ShoppingCart.findAll({where: {buyerId: buyerId}});
    }

    public create(shoppingCartItem: ShoppingCartAttributes, buyerId: number, productId: string): Promise<ShoppingCartAttributes> {
        shoppingCartItem.buyerId = buyerId;
        shoppingCartItem.productId = parseInt(productId, 10);

        return User.findByPk(buyerId)
            .then(user => {
                if (!user) {
                    return Promise.reject('could not find User!');
                } else {
                    return Product.findByPk(shoppingCartItem.productId);
                }
            })
            .then(product => {
                if (!product) {
                    return Promise.reject('could not find the Product!');
                } else if ( product.status === 0 || product.approved === 0) { // Check if the product is available and approved
                    return Promise.reject('product ' + product.title + ' is not available or not approved yet!');
                /*} else if ( product.type === 0 && product.amount < shoppingCartItem.amountOrTime) {
                    return Promise.reject('The stock of the product ' + product.title + ' is too low: ' + product.amount);*/
                } else {
                    return ShoppingCart.findOne({where: {buyerId: buyerId, productId: productId}})
                        .then(found => {
                            if (found) {
                                // If there is already a shopping cart entry for this user and that product,
                                // simply sum up the current amountOrTime and the send amountOrTime value
                                const updateShoppingCartEntry = {
                                    amountOrTime: found.amountOrTime + shoppingCartItem.amountOrTime,
                                    buyerId: buyerId,
                                    productId: parseInt(productId, 10)
                                };
                                return this.update(updateShoppingCartEntry, buyerId, productId);
                            } else {
                                // If there is no entry with this product from the user, add the entry
                                return ShoppingCart.create(shoppingCartItem);
                            }
                        });
                }
            });
    }

    public delete(shoppingCartItem: ShoppingCartAttributes, buyerId: number, productId: string): Promise<ShoppingCartAttributes> {
        return ShoppingCart.findOne({where: { buyerId: buyerId, productId: productId}})
            .then(shoppingCartEntry => shoppingCartEntry.destroy()
                .then(() => Promise.resolve(shoppingCartEntry)))
            .catch(err => Promise.reject(err));
    }

    public update(shoppingCartItem: ShoppingCartAttributes, buyerId: number, productId: string): Promise<ShoppingCartAttributes> {
        if (shoppingCartItem.amountOrTime === 0) {
            return this.delete(shoppingCartItem, buyerId, productId);
        } else {
            return ShoppingCart.findOne({where: { buyerId: buyerId, productId: productId}})
                .then(shoppingCartEntry => shoppingCartEntry.update(shoppingCartItem))
                .then(updated => Promise.resolve(updated))
                .catch(err => Promise.reject(err));
        }
    }

    public buy(buyerId: number, deliveryAddress: Address): Promise<string> {
        const transactionService = new TransactionService();
        const notificationService = new NotificationService();
        let totalPrice = 0;
        let buyer: User;

        return User.findByPk(buyerId)
            .then(user => buyer = user)
            .then(() => ShoppingCart.findAll( { where: { buyerId: buyerId } }))
            .then(async(shoppingCartEntries) => {
                // Check if the shopping cart is empty, if yes buy will fail
                if (shoppingCartEntries.length === 0) {
                    return Promise.reject('Shopping Cart is empty!');
                }

                // Calculate the total price of the shopping cart
                for (const shoppingCartEntry of shoppingCartEntries) {
                    totalPrice += await Product.findByPk(shoppingCartEntry.productId)
                        .then(product => product.price * shoppingCartEntry.amountOrTime);
                }

                // If the price of the shopping cart is higher than the credits of the user
                // then the checkout should not proceed
                if (totalPrice > buyer.credits) {
                    return Promise.reject('You do not have enough credits!');
                }

                return Promise.resolve(shoppingCartEntries);
            })
            .then(async shoppingCartEntries => {
                const successfulPurchases: ShoppingCartAttributes[] = [];
                const failedPurchases: ShoppingCartAttributes[] = [];
                // Go through every shopping cart entry and create a transaction
                // This way, all transactions are stored in the database
                for (const shoppingCartEntry of shoppingCartEntries) {
                    await transactionService.add(shoppingCartEntry, deliveryAddress)
                        .then(() => successfulPurchases.push(shoppingCartEntry))
                        .catch(() => failedPurchases.push(shoppingCartEntry));
                }

                if (successfulPurchases.length > 0) {
                    let successText = 'Successfully purchased these products: \n\n';
                    for (const purchase of successfulPurchases) {
                        try {
                            const product = await Product.findByPk(purchase.productId);
                            successText += '    - '
                                + product.title + ', ' + purchase.amountOrTime
                                + (product.priceKind === 2 ? ' Day(s)' : (product.priceKind === 1 ? ' Hour(s)' : ''))
                                + '\n';
                        } catch (e) {} // Ignore errors
                    }
                    notificationService.create(buyer.userId, successText);
                }

                if (failedPurchases.length > 0) {
                    let failedText = 'Failed to purchase these products: \n\n';
                    for (const purchase of failedPurchases) {
                        try {
                            const product = await Product.findByPk(purchase.productId);
                            failedText += '    - ' + product.title;
                        } catch (e) {} // Ignore errors
                    }
                    notificationService.create(buyer.userId, failedText);
                }

                if (failedPurchases.length === shoppingCartEntries.length) {
                    return Promise.reject('Something unexpected happened while trying to purchase the products!');
                }

                return Promise.resolve(shoppingCartEntries);
            })
            .then(async shoppingCartEntries => {
                // Delete the shopping cart entries in the database
                // e.g. clear the shopping cart
                for (const shoppingCartEntry of shoppingCartEntries) {
                    await shoppingCartEntry.destroy();
                }
                return Promise.resolve();
            })
            .then(() => Promise.resolve('OK!'))
            .catch(err => Promise.reject(err));
    }
}
