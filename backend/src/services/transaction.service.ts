import { Product, ProductUpdate } from '../models/product.model';
import { Transaction, TransactionAttributes, TransactionCreationAttributes } from '../models/transaction.model';
import { ShoppingCartAttributes } from '../models/shoppingcart.model';
import { User } from '../models/user.model';


export class TransactionService {

    public add(shoppingCartEntry: ShoppingCartAttributes): Promise<TransactionAttributes> {
        return Product.findByPk(shoppingCartEntry.productId)
            .then(product => {
                if (!product) {
                    return Promise.reject('Product not found');
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
                            .then(() => Promise.resolve(transaction))
                            .catch(err => Promise.reject(err));
                    })
                    .catch(err => Promise.reject(err));
            })
            .then(transaction => {
                return User.findByPk(transaction.sellerId)
                    .then(user => {
                        // Then add the amount of credits (=amount * price) to the seller
                        const userUpdate = {
                            credits: user.credits + transaction.priceTotal
                        };
                        return user.update(userUpdate)
                            .then(() => Promise.resolve(transaction))
                            .catch(err => Promise.reject(err));
                    })
                    .catch(err => Promise.reject(err));
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
                            .then(() => Promise.resolve(transaction))
                            .catch(err => Promise.reject(err));
                    });
            })
            .then(created => Promise.resolve(created))
            .catch(err => Promise.reject(err));
    }
}
