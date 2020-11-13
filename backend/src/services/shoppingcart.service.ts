import { Product } from '../models/product.model';
import { ShoppingCartAttributes, ShoppingCart } from '../models/shoppingcart.model';
import {User} from '../models/user.model';
import {TransactionAttributes} from '../models/transaction.model';
import {TransactionService} from './transaction.service';


export class ShoppingCartService {


    public create(shoppingCartItem: ShoppingCartAttributes, buyerId: number, productId: string): Promise<ShoppingCartAttributes> {
        shoppingCartItem.buyerId = buyerId;
        shoppingCartItem.productId = parseInt(productId, 10);

        return User.findByPk(buyerId)
            .then(user => {
                if (user === null) {
                    return Promise.reject('could not find User!');
                } else {
                    return Product.findByPk(shoppingCartItem.productId);
                }
            })
            .then(product => {
                // TODO: Check if the product is a service or not, if not, check if the amount wanted <= the amount available
                if ( product === null) {
                    return Promise.reject('could not find the Product!');
                } else if ( product.status !== 0) {
                    return Promise.reject('product is not available!');
                } else {
                    return ShoppingCart.create(shoppingCartItem);
                }
            })
            .then(created => Promise.resolve(created))
            .catch(err => Promise.reject(err));
    }

    public buy(buyerId: number): Promise<string> {
        const transactionService = new TransactionService();

        return ShoppingCart.findAll( {where: {buyerId: buyerId }})
            .then( shoppingCartEntries => {
                if (shoppingCartEntries.length === 0) {
                    return Promise.reject('Shopping Cart is empty!');
                }
                for ( let i = 0; i < shoppingCartEntries.length; i++) {
                    transactionService.add(shoppingCartEntries[i])
                        .catch(err => Promise.reject(err));
                }
                return true;
            })
            .then(() => {
                return ShoppingCart.findAll({where: {buyerId: buyerId }})
                    .then(shoppingCartEntries => {
                        for ( let i = 0; i < shoppingCartEntries.length; i++) {
                            shoppingCartEntries[i].destroy()
                                .catch(err => Promise.reject(err));
                        }
                    });
            })
            .then(() => Promise.resolve('OK!'))
            .catch(err => Promise.reject(err));
    }

}
