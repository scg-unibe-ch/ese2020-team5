import { Product } from '../models/product.model';
import { ShoppingCartAttributes, ShoppingCart } from '../models/shoppingcart.model';
import {User} from '../models/user.model';
import {TransactionService} from './transaction.service';


export class ShoppingCartService {

    public get(buyerId: number): Promise<ShoppingCart[]> {
        return ShoppingCart.findAll({where: {buyerId: buyerId}})
            .then(shoppingCartEntries => Promise.resolve(shoppingCartEntries))
            .catch(err => Promise.reject(err));
    }

    // TODO: If the same product gets added, simply sum up the amountOrTime
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
                if (!product) {
                    return Promise.reject('could not find the Product!');
                } else if ( product.status !== 0 || product.approved !== 1) {
                    return Promise.reject('product ' + product.title + ' is not available or not approved yet!');
                } else {
                    return ShoppingCart.create(shoppingCartItem);
                }
            })
            .then(created => Promise.resolve(created))
            .catch(err => Promise.reject(err));
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

    public buy(buyerId: number): Promise<string> {
        const transactionService = new TransactionService();
        let totalPrice = 0;
        let userCredits = 0;

        return User.findByPk(buyerId)
            .then(user => userCredits = user.credits)
            .then(() => ShoppingCart.findAll( {where: {buyerId: buyerId }}))
            .then( async(shoppingCartEntries) => {
                if (shoppingCartEntries.length === 0) {
                    return Promise.reject('Shopping Cart is empty!');
                }

                for (let i = 0; i < shoppingCartEntries.length; i++) {
                    totalPrice += await Product.findByPk(shoppingCartEntries[i].productId).then(product => product.price);
                }

                if (totalPrice > userCredits) {
                    return Promise.reject('You do not have enough credits!');
                }

                return Promise.resolve(shoppingCartEntries);
            })
            .then( shoppingCartEntries => {
                console.log('totalPrice: ' + totalPrice);
                console.log('userCredits: ' + userCredits);
                if (totalPrice > userCredits) {
                    return Promise.reject('You do not have enough credits!');
                }
                for ( let i = 0; i < shoppingCartEntries.length; i++) {
                    transactionService.add(shoppingCartEntries[i])
                        .catch(err => Promise.reject(err));
                }
                return Promise.resolve(true);
            })
            .then(() => ShoppingCart.findAll({where: {buyerId: buyerId }}))
            .then(shoppingCartEntries => {
                for ( let i = 0; i < shoppingCartEntries.length; i++) {
                    shoppingCartEntries[i].destroy()
                        .catch(err => Promise.reject(err));
                }
            })
            .then(() => Promise.resolve('OK!'))
            .catch(err => Promise.reject(err));
    }
}
