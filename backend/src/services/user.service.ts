import { UserAttributes, User } from '../models/user.model';
import { LoginResponse, LoginRequest } from '../models/login.model';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {Op} from 'sequelize';
import {Request} from 'express';

export class UserService {

    public register(userToReg: UserAttributes): Promise<UserAttributes> {
        const saltRounds = 12;
        userToReg.password = bcrypt.hashSync(userToReg.password, saltRounds); // hashes the password, never store passwords as plaintext
        return User.findOne( {
            where: {
                [Op.or]: [
                    {userName: userToReg.userName},
                    {email: userToReg.email}]
                }
        }).then((usr) => {
            if (this.userExists(usr)) { return this.rejectUser(usr, userToReg); }
            return User.create(userToReg);
        }).then(inserted => {
            return Promise.resolve(inserted);
        }).catch((err) => Promise.reject({ message: err}));
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

    public getAll(userId: number): Promise<User[]> {
        return User.findByPk(userId)
            .then((usr) => {
                if (!this.isAdmin(usr)) {
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
    protected preconditionsDelete(deleter: User, userToDeleteId: number): boolean {
        if (this.userHasSameId(deleter, userToDeleteId)) {
            return true;
        } else {
            return false;
        }
    }

    protected userExists = (usr: User | null) => !!usr;
    protected rejectUser = (usr: User, userToReg: UserAttributes) => {
        if (usr.userName === userToReg.userName) {
            return Promise.reject({message: 'Username ' + usr.userName + ' already exists'});
        } else if (usr.email === userToReg.email) {
            return Promise.reject({message: 'Email ' + usr.email + ' already exists'});
        }
    }
    protected userHasSameId = (usr: User, id: number) => !!usr && usr.userId === id;
    protected isAdmin = (usr: User | null) => !!usr && usr.isAdmin === 0;
}

export class AdminService extends  UserService {
    protected preconditionsDelete(deleter: User, userToDeleteId: number): boolean {
        if (this.isAdmin(deleter)) {
            return true;
        } else {
            return super.preconditionsDelete(deleter, userToDeleteId);
        }
    }
}
