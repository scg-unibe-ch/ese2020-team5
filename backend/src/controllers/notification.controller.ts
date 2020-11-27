import express, { Router, Request, Response } from 'express';
import { NotificationService } from '../services/notification.service';
import { verifyToken, getUserId } from '../middlewares/checkAuth';

const notificationController: Router = express.Router();

const notificationService = new NotificationService();

notificationController.get('/', verifyToken, (req: Request, res: Response) => {
    notificationService.get(getUserId(req))
        .then(notifications => res.send(notifications))
        .catch(err => res.status(500).send(err));
});

notificationController.put('/:id', verifyToken, (req: Request, res: Response) => {
    notificationService.read(getUserId(req), req.params.id)
        .then(notification => res.send(notification))
        .catch(err => res.status(500).send(err));
});

// This function is more or less for tests only, the frontend will probably never use this API
notificationController.post('/', verifyToken, (req: Request, res: Response) => {
    notificationService.create(getUserId(req), req.body.text)
        .then(notification => res.send(notification))
        .catch(err => res.status(500).send(err));
});

export const NotificationController: Router = notificationController;
