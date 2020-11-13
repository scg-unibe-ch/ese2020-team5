import { Product } from '../models/product.model';
import {Transaction, TransactionAttributes, TransactionCreationAttributes} from '../models/transaction.model';
import {ShoppingCartAttributes} from '../models/shoppingcart.model';


export class TransactionService {
    public add(shoppingCartEntry: ShoppingCartAttributes): Promise<TransactionAttributes> {

        return Product.findByPk(shoppingCartEntry.productId)
            .then(product => {
                if (product === null ) {
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

                    return Transaction.create(transaction)
                        .then(created => Promise.resolve(created))
                        .catch(err => Promise.reject(err));
                }
            })
            .catch(err => Promise.reject(err));
    }
}
