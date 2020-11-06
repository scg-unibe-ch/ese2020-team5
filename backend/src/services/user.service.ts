import { UserAttributes, User } from '../models/user.model';
import { LoginResponse, LoginRequest } from '../models/login.model';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {Op} from 'sequelize';
import {Request} from 'express';

export class UserService {

    public register(new_user: UserAttributes): Promise<UserAttributes> {
        const saltRounds = 12;
        new_user.password = bcrypt.hashSync(new_user.password, saltRounds); // hashes the password, never store passwords as plaintext
        const userName = new_user.userName;
        const email = new_user.email;
        return User.findOne({
            where: {
                [Op.or]: [
                    {userName: userName},
                    {email: email}]
            }
        }).then((old_user) => {
            if (this.userExists(old_user)) { return this.rejectUser(new_user, userName, email); }
            return User.create(new_user);
        }).then(inserted => {
            return Promise.resolve(inserted);
        }).catch(err => {
            return Promise.reject({message: err});
        });
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

    public login(loginRequestee: LoginRequest): Promise<User | LoginResponse> {
        const secret = process.env.JWT_SECRET;
        return User.findOne({
            where: {
                [Op.or]: [
                    {userName: loginRequestee.userNameOrEmail},
                    {email: loginRequestee.userNameOrEmail}]
                }
            }).then((user) => {
                // compares the hash with the password from the login request
                if (bcrypt.compareSync(loginRequestee.password, user.password)) {
                    const token: string = jwt.sign({ userName: user.userName, userId: user.userId }, secret, { expiresIn: '2h' });
                    return Promise.resolve({ user, token });
                } else {
                    return Promise.reject({ message: 'not authorized' });
                }
            }).catch((err) => Promise.reject({ message: err }));
    }

    public getAll(userId: number): Promise<User[]> {
        return User.findByPk(userId)
            .then((usr) => {
                if (this.userExists(usr) && this.isAdmin(usr)) {
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
            .then((usr) => {
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

    protected preconditionsDelete(deleter: User | null, userToDeleteId: number): boolean {
        return this.hasSameId(deleter, userToDeleteId);
    }
    protected isAdmin(usr: User): boolean { return usr.isAdmin === 1; }
    protected hasSameId(usr: User, id: number): boolean { return usr.userId === id; }
    protected userExists(usr: User | null): boolean { return !!usr; }
    protected rejectUser(usr: UserAttributes, userName: String, email: String) {
        if (usr.userName === userName) {
            return Promise.reject({message: 'Username ' + userName + ' already exists'});
        } else if (usr.email === email) {
            return Promise.reject({message: 'Email ' + email + ' already exists'});
        }
    }
}

export class AdminService extends UserService {
    protected preconditionsDelete(deleter: User | null, userToDeleteId: number): boolean {
        if (this.userExists(deleter) && this.isAdmin(deleter)) {
            return true;
        } else {
            return super.preconditionsDelete(deleter, userToDeleteId);
        }
    }
}
