import { Product, ProductUpdate } from '../models/product.model';
import { Transaction, TransactionAttributes, TransactionCreationAttributes } from '../models/transaction.model';
import { ShoppingCartAttributes } from '../models/shoppingcart.model';
import { User } from '../models/user.model';
import { NotificationService } from './notification.service';
import { Address } from '../models/address.model';

const notificationService = new NotificationService();

export class TransactionService {

    public add(shoppingCartEntry: ShoppingCartAttributes, deliveryAddress: Address): Promise<TransactionAttributes> {
        return Product.findByPk(shoppingCartEntry.productId)
            .then(product => {
                if (!product) {
                    return Promise.reject('Product not found');
                } else if (product.deliverable
                    && (!deliveryAddress.city
                        || !deliveryAddress.country
                        || !deliveryAddress.zipCode
                        || !deliveryAddress.street)) {
                    return Promise.reject('Address is incomplete! Will not be able to deliver!');
                } else {
                    // Create a transaction out of the entries added
                    const transaction: TransactionCreationAttributes = {
                        buyerId: shoppingCartEntry.buyerId,
                        amountOrTime: shoppingCartEntry.amountOrTime,
                        productId: shoppingCartEntry.productId,
                        sellerId: product.userId,
                        pricePerUnit: product.price,
                        priceTotal: product.price * shoppingCartEntry.amountOrTime,
                        productName: product.title
                    };
                    return Transaction.create(transaction);
                }
            })
            .then(transaction => {
                return User.findByPk(transaction.buyerId)
                    .then(user => {
                        // first subtract the amount of credits (= amount * price) from the buyer
                        const userUpdate = {
                            credits: user.credits - transaction.priceTotal
                        };
                        return user.update(userUpdate)
                            .then(() => Promise.resolve(transaction));
                    });
            })
            .then(transaction => {
                return User.findByPk(transaction.sellerId)
                    .then(user => {
                        // Then add the amount of credits (=amount * price) to the seller
                        const userUpdate = {
                            credits: user.credits + transaction.priceTotal
                        };
                        return user.update(userUpdate)
                            .then(() => Promise.resolve(transaction));
                    });
            })
            .then(transaction => {
                return Product.findByPk(transaction.productId)
                    .then(product => {
                        // Update the product (e.g. set as unavailable or decrement the stock
                        // Hail to Jethro, who enforced me to create an Interface for this.
                        const productUpdate: ProductUpdate = {};
                        // If the product is a service, then do not decrement the amount
                        // If it's a lent item, only decrement it by 1
                        if (product.type === 0 && product.sellOrLend === 0) {
                            // if the resulting amount of a product is 0, it becomes unavailable
                            if ( product.amount - transaction.amountOrTime === 0) {
                                productUpdate.status = 0;
                                productUpdate.amount = 0;
                            } else {
                                // If no special case, simply decrement the amount left of the product
                                productUpdate.amount = product.amount - transaction.amountOrTime;
                            }
                        } else if (product.type === 0 && product.sellOrLend === 1) {
                            if (product.amount - 1 === 0) {
                                productUpdate.status = 0;
                                productUpdate.amount = 0;
                            } else {
                                productUpdate.amount = productUpdate.amount - 1;
                            }
                        }
                        return product.update(productUpdate)
                            .then(() => Promise.resolve(transaction));
                    });
            })
            .then(async(transaction) => {
                const userId = transaction.sellerId;
                let buyerLastname = '', buyerFirstname = '', deliverable = 0;
                let text: string;
                const productName = transaction.productName;

                await Product.findByPk(transaction.productId)
                    .then(product => deliverable = product.deliverable)
                    .catch(() => deliverable = 0);

                await User.findByPk(transaction.buyerId)
                    .then(user => {
                        buyerFirstname = user.firstName;
                        buyerLastname = user.lastName;
                    })
                    .catch(() => {
                        buyerFirstname = 'Unknown';
                        buyerLastname = 'Unknown';
                    });

                text = buyerFirstname + ' ' + buyerLastname + ' bought your product ' + productName + '. \n';
                if (deliverable === 1) {
                    text +=
                        '\n' +
                        'Delivery Address: \n' +
                        '    Country: ' + deliveryAddress.country + '\n' +
                        '    City: ' + deliveryAddress.zipCode + ', ' + deliveryAddress.city + '\n' +
                        '    Street: ' + deliveryAddress.street + '\n';
                }

                notificationService.create(userId, text);
                return Promise.resolve(transaction);
            })
            .then(created => Promise.resolve(created))
            .catch(err => Promise.reject(err));
    }
}
