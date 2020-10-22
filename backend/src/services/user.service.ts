import { UserAttributes, User } from '../models/user.model';
import { LoginResponse, LoginRequest } from '../models/login.model';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {Op} from 'sequelize';

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
                user.token = token;
                return Promise.resolve({ user, token });
            } else {
                return Promise.reject({ message: 'not authorized' });
            }
        })
        .catch(err => Promise.reject({ message: err }));
    }

    public logout(userId: number) {
        return User.findByPk(userId).then(usr => {
            usr.token = null;
        }).catch(err => {
            return Promise.reject({message: err});
        });
    }

    public getAll(): Promise<User[]> {
        return User.findAll();
    }
}
