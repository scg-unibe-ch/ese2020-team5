import { Product } from '../models/product.model';
import { TransactionAttributes, Transaction } from '../models/transaction.model';
import { Request } from 'express';

export class TransactionService {

    public create(req: Request, buyerId: number): Promise<TransactionAttributes> {
        const amount = req.body.amount;
        const transaction = new Transaction();
        transaction.buyerId = buyerId;

        return Product.findByPk(req.params.id)
            .then(found => {
                transaction.sellerId = found.userId;
                transaction.price = found.price * amount;
                transaction.productName = found.title;

                return Transaction.create(transaction)
                    .then(created => Promise.resolve(created))
                    .catch(err => Promise.reject(err));
            })
            .catch(err => Promise.reject(err));
    }
}
