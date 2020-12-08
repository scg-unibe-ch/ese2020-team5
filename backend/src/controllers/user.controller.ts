import express, { Router, Request, Response } from 'express';
import { UserService, AdminService } from '../services/user.service';
import { getUserId, verifyToken } from '../middlewares/checkAuth';

const userController: Router = express.Router();
const userService = new UserService();
const adminService = new AdminService();

userController.post('/register', (req: Request, res: Response) => {
    userService.register(req.body).then(registered => res.send(registered)).catch(err => res.status(500).send(err));
});

userController.post('/login', (req: Request, res: Response) => {
    userService.login(req.body).then(login => res.send(login)).catch(err => res.status(500).send(err));
});

userController.get('/purchased', verifyToken, (req: Request, res: Response) => {
    userService.getPurchasedProducts(getUserId(req)).then(products => res.send(products)).catch(err => res.status(500).send(err));
});

userController.get('/:id/public', (req: Request, res: Response) => {
    userService.getUserById(parseInt(req.params.id, 10)).then(user => res.send(user)).catch(err => res.status(500).send(err));
});

userController.get('/:id/products', (req: Request, res: Response) => {
   userService.getProductsByUserId(parseInt(req.params.id, 10))
       .then(products => res.send(products))
       .catch(err => res.status(500).send(err));
});

userController.get('/all', verifyToken, (req: Request, res: Response) => {
    userService.getAll(getUserId(req)).then(users => res.send(users)).catch(err => res.status(500).send(err));
});

userController.get('/', verifyToken, (req: Request, res: Response) => {
    userService.getUser(getUserId(req)).then(usr => res.send(usr)).catch(err => res.status(500).send(err));
});

userController.delete('/:id', verifyToken, (req: Request, res: Response) => {
    adminService.delete(getUserId(req), parseInt(req.params.id, 10))
        .then(deleted => res.send(deleted))
        .catch(err => res.status(500).send(err));
});

userController.get('/reviews', verifyToken, (req: Request, res: Response) => {
    userService.getReviews(getUserId(req)).then(reviews => res.send(reviews)).catch(err => res.status(500).send(err));
});

userController.put('/update', verifyToken, (req: Request, res: Response) => {
    userService.update(getUserId(req), req.body).then(users => res.send(users)).catch(err => res.status(500).send(err));
});

export const UserController: Router = userController;
