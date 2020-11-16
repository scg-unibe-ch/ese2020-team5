import { Product } from '../models/product.model';
import {Transaction, TransactionAttributes, TransactionCreationAttributes} from '../models/transaction.model';
import {ShoppingCartAttributes} from '../models/shoppingcart.model';
import {User} from '../models/user.model';


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
                        const userUpdate = {
                            credits: user.credits + transaction.priceTotal
                        };
                        return user.update(userUpdate)
                            .then(() => Promise.resolve(transaction))
                            .catch(err => Promise.reject(err));
                    })
                    .catch(err => Promise.reject(err));
            })/*
            .then(transaction => {
                return Product.findByPk(transaction.productId)
                    .then(product => {
                        const productUpdate = {};
                        if (product.type === 1) {
                            productUpdate.status = 1;
                        } else {
                            if ( product.amount - transaction.amountOrTime == 0) {
                                productUpdate.status = 1;
                                productUpdate.amount = 0;
                            } else {
                                productUpdate.amount = product.amount - transaction.amountOrTime;
                            }
                        }
                        return product.update(productUpdate)
                            .then(() => Promise.resolve(transaction))
                            .catch(err => Promise.reject(err));
                    });
            })*/
            .then(created => Promise.resolve(created))
            .catch(err => Promise.reject(err));
    }
}
