import { Product } from '../models/product.model';
import { TransactionAttributes, Transaction } from '../models/transaction.model';
import { ShoppingCartAttributes, ShoppingCart } from '../models/shoppingcart.model';
import { Request } from 'express';

export class ShoppingCartService {

    // TODO: A transaction is also responsible to add money from one user to another user
/*    public create(req: Request, buyerId: number): Promise<TransactionAttributes> {
        const transaction = req.body;
        transaction.buyerId = buyerId;
        transaction.productId = parseInt(req.params.id, 10);

        return Product.findByPk(transaction.productId)
            .then(found => {
                transaction.sellerId = found.userId;
                transaction.pricePerUnit = found.price;
                transaction.priceTotal = found.price * transaction.amount;
                transaction.productName = found.title;

                return Transaction.create(transaction)
                    .then(created => Promise.resolve(created))
                    .catch(err => Promise.reject(err));
            })
            .catch(err => Promise.reject(err));
    }*/
}
