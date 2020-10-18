import { UserAttributes, User } from '../models/user.model';
import {Op} from 'sequelize';

export class AdminService {

    public deleteUser(user: UserAttributes): Promise<number> {
        return User.destroy({
            where: {
                [Op.and]: [
                    {userName: user.userName},
                    {email: user.email}]
            }
        }).then(deleted => {
            if (deleted > 0) {
                return Promise.resolve(deleted);
            } else {
                return Promise.reject({message : 'The user with userName ${user.userName} and email ${user.email} does not exist'});
            }
        }).catch(err => Promise.reject({message : err}));
    }
}
