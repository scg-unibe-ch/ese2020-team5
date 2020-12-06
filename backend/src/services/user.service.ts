import { UserAttributes, User } from '../models/user.model';
import { LoginResponse, LoginRequest } from '../models/login.model';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {Op, where} from 'sequelize';
import {Request} from 'express';
import { Review } from '../models/review.model';

export class UserService {

    public register(user: UserAttributes): Promise<UserAttributes> {
        const saltRounds = 12;
        user.password = bcrypt.hashSync(user.password, saltRounds); // hashes the password, never store passwords as plaintext
        return User.findOne( {
            where: {
                [Op.or]: [
                    {userName: user.userName},
                    {email: user.email}]
                }
        }).then((userp) => {
            if (userp) {
                if (userp.userName === user.userName) {
                    return Promise.reject({message: 'Username ' + userp.userName + ' already exists'});
                } else if (userp.email === user.email) {
                    return Promise.reject({message: 'Email ' + userp.email + ' already exists'});
                }
            }
            return User.create(user).then(inserted => Promise.resolve(inserted)).catch(err => Promise.reject(err));
        }).catch((err) => Promise.reject({ message: err}));
        // return User.create(user).then(inserted => Promise.resolve(inserted)).catch(err => Promise.reject(err));
    }

    public login(loginRequestee: LoginRequest): Promise<User | LoginResponse> {
        const secret = process.env.JWT_SECRET;
        return User.findOne({
            where: {
                [Op.or]: [
                    {userName: loginRequestee.userNameOrEmail},
                    {email: loginRequestee.userNameOrEmail}]
            }
        })
        .then(user => {
            if (bcrypt.compareSync(loginRequestee.password, user.password)) {// compares the hash with the password from the login request
                const token: string = jwt.sign({ userName: user.userName, userId: user.userId }, secret, { expiresIn: '2h' });
                return Promise.resolve({ user, token });
            } else {
                return Promise.reject({ message: 'not authorized' });
            }
        })
        .catch(err => Promise.reject({ message: err }));
    }

    public update(userId: number, newAttributes: UserAttributes): Promise<UserAttributes> {
        return User.findByPk(userId)
            .then(usr => {
            return usr.update(newAttributes);
        }).then(usr => {
            return Promise.resolve(usr);
        }).catch(err => {
            return Promise.reject({message: err});
        });
    }

    public getReviews(userId: number): Promise<Review[]> {
        return Review.findAll({ where: { userId: userId } })
            .then(list => Promise.resolve(list))
            .catch(err => Promise.reject(err));
    }

    public getAll(userId: number): Promise<User[]> {
        return User.findByPk(userId)
            .then(usr => {
                if (usr.isAdmin === 0) {
                    return Promise.reject({message: 'You are not authorized'});
                } else {
                    return User.findAll();
                }
            }).then(allUsers => {
                return Promise.resolve(allUsers);
            }).catch(err => {
                return Promise.reject({message: err});
            });
    }

    public getUser(userId: number): Promise<UserAttributes> {
        return User.findByPk(userId)
            .then(usr => {
                return Promise.resolve(usr);
            }).catch(err => {
                return Promise.reject({message: err});
            });
    }

    public delete(deleterId: number, userId: number): Promise<number> {
        return User.findByPk(deleterId)
            .then(deleter => {
                if (this.preconditionsDelete(deleter, userId)) {
                    return Promise.resolve();
                } else {
                    return Promise.reject('You are not authorized');
                }
            }).then(() => {
                return User.destroy({
                    where: {userId: userId}
                });
            }).then(() => {
                    return Promise.resolve(200);
            }).catch(err => {
                return Promise.reject({message: err});
            });
    }
    protected preconditionsDelete(deleter: UserAttributes, userToDeleteId: number): boolean {
        if (deleter.userId === userToDeleteId) {
            return true;
        } else {
            return false;
        }
    }
}

export class AdminService extends  UserService {
    protected preconditionsDelete(deleter: UserAttributes, userToDeleteId: number): boolean {
        if (deleter.isAdmin === 1) {
            return true;
        } else {
            return super.preconditionsDelete(deleter, userToDeleteId);
        }
    }
}
