
import express, { Router, Request, Response } from 'express';
import { UserService, AdminService } from '../services/user.service';
import { verifyToken } from '../middlewares/checkAuth';

const userController: Router = express.Router();
const userService = new UserService();
const adminService = new AdminService();

userController.post('/register',
    (req: Request, res: Response) => {
        userService.register(req.body).then(registered => res.send(registered)).catch(err => res.status(500).send(err));
    }
);

userController.post('/login',
    (req: Request, res: Response) => {
        userService.login(req.body).then(login => res.send(login)).catch(err => res.status(500).send(err));
    }
);

userController.get('/', verifyToken, // you can add middleware on specific requests like that
    (req: Request, res: Response) => {
        userService.getAll().then(users => res.send(users)).catch(err => res.status(500).send(err));
    }
);

userController.post('/delete',
    (req: Request, res: Response) => {
        adminService.delete(req.body).then(num => res.send(num)).catch(err => res.status(500).send(err));;
    }
);

export const UserController: Router = userController;
