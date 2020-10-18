
import express, { Router, Request, Response } from 'express';
import { AdminService } from '../services/admin.service';

const adminController: Router = express.Router();
const adminService = new AdminService();

adminController.post('/deleteUser',
    (req: Request, res: Response) => {
        adminService.deleteUser(req.body)
            .then(deleted => res.send({message : 'Deleted ${deleted} users'}))
            .catch(err => res.status(500).send(err));
    }
);


export const AdminController: Router = adminController;
