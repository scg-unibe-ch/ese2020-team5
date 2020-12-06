import { UserAttributes, User } from '../models/user.model';
import { LoginResponse, LoginRequest } from '../models/login.model';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Op } from 'sequelize';
import { Product } from '../models/product.model';
import { Transaction } from '../models/transaction.model';
import { Review } from '../models/review.model';

export class UserService {

    public register(user: UserAttributes): Promise<UserAttributes> {
        const saltRounds = 12;
        user.password = bcrypt.hashSync(user.password, saltRounds); // hashes the password, never store passwords as plaintext
        return User.findOne( {
            where: { [Op.or]: [{ userName: user.userName }, { email: user.email }] }
        }).then((foundUser) => {
            if (foundUser) {
                if (foundUser.userName === user.userName) {
                    return Promise.reject('Username ' + foundUser.userName + ' already exists');
                } else if (foundUser.email === user.email) {
                    return Promise.reject('Email ' + foundUser.email + ' already exists');
                }
            }
            return User.create(user).catch(() => Promise.reject('Could not register!'));
        });
    }

    public login(loginRequester: LoginRequest): Promise<User | LoginResponse> {
        const secret = process.env.JWT_SECRET;
        return User.findOne({
            where: { [Op.or]: [{ userName: loginRequester.userNameOrEmail }, { email: loginRequester.userNameOrEmail }] }
        }).then(user => {
            // compares the hash with the password from the login request
            if (bcrypt.compareSync(loginRequester.password, user.password)) {
                const token: string = jwt.sign({ userName: user.userName, userId: user.userId }, secret, { expiresIn: '2h' });
                return Promise.resolve({ user, token });
            } else {
                return Promise.reject('Invalid combination of username/email and password!');
            }
        });
    }

    public getUserById(userId: number): Promise<{ userId: number, userName: string, isAdmin: number }> {
        return User.findByPk(userId)
            .then(user => {
                if (user) {
                    return Promise.resolve({
                        userId: user.userId,
                        userName: user.userName,
                        isAdmin: user.isAdmin
                    });
                } else {
                    return Promise.reject('Could not find the user!');
                }
            });
    }

    public getProductsByUserId(userId: number): Promise<Product[]> {
        return Product.findAll({
            where: { userId: userId },
            include: [Product.associations.reviews, Product.associations.images]
        }).catch(() => Promise.reject('Could not get the products of user #' + userId + '!'));
    }

    public getPurchasedProducts(userId: number): Promise<Product[]> {
        return Transaction.findAll({ where: { buyerId: userId } })
            .then(async transactions => {
                const products: Product[] = [];
                for (const transaction of transactions) {
                    try {
                        const product = await Product.findByPk(transaction.productId, {
                            include: [Product.associations.reviews, Product.associations.images]
                        });
                        if (product) {
                            products.push(product);
                        }
                    } catch (e) {} // Ignore errors
                }
                return Promise.resolve(products);
            }).catch(() => Promise.reject('Could not get the list of purchased products!'));
    }

    public update(userId: number, newAttributes: UserAttributes): Promise<UserAttributes> {
        return User.findByPk(userId)
            .then(user => {
                return User.findOne({
                    where: {
                        [Op.or]: [
                            { userName: newAttributes.userName, userId: { [Op.ne]: user.userId } },
                            { email: newAttributes.email, userId: { [Op.ne]: user.userId } }
                        ]
                    }
                }).then(foundUser => {
                    if (foundUser) {
                        if (foundUser.userName === newAttributes.userName) {
                            return Promise.reject('Username ' + foundUser.userName + ' already exists');
                        } else if (foundUser.email === newAttributes.email) {
                            return Promise.reject('Email ' + foundUser.email + ' already exists');
                        }
                    }
                    return user.update(newAttributes)
                        .catch(() => Promise.reject('Could not update the user data!'));
                });
            });
    }

    public getReviews(userId: number): Promise<Review[]> {
        return Review.findAll({ where: { userId: userId } })
            .catch(() => Promise.reject('Could not get the list of reviews!'));
    }

    public getAll(userId: number): Promise<User[]> {
        return User.findByPk(userId)
            .then(user => {
                if (user.isAdmin === 0) {
                    return Promise.reject('You are not authorized to do this!');
                } else {
                    return User.findAll().catch(() => Promise.reject('Could not get the list of users!'));
                }
            });
    }

    public getUser(userId: number): Promise<UserAttributes> {
        return User.findByPk(userId).catch(() => Promise.reject('Could not get the user data!'));
    }

    public delete(requesterId: number, deleteId: number): Promise<User> {
        return User.findByPk(requesterId)
            .then(requester => {
                if (this.preconditionsDelete(requester, deleteId)) {
                    return Promise.resolve();
                } else {
                    return Promise.reject('You are not authorized to do this!');
                }
            }).then(() => {
                return User.findByPk(deleteId);
            }).then(toBeDeleted => {
                return toBeDeleted.destroy()
                    .then(() => Promise.resolve(toBeDeleted))
                    .catch(() => Promise.reject('Could not delete the user!'));
            });
    }

    protected preconditionsDelete(deleter: UserAttributes, userToDeleteId: number): boolean {
        return deleter.userId === userToDeleteId;
    }
}

export class AdminService extends UserService {
    protected preconditionsDelete(deleter: UserAttributes, userToDeleteId: number): boolean {
        if (deleter.isAdmin === 1) {
            return true;
        } else {
            return super.preconditionsDelete(deleter, userToDeleteId);
        }
    }
}
