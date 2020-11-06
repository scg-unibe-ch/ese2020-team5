import express, { Router, Request, Response } from 'express';
import { TransactionService } from '../services/transaction.service';
import { verifyToken, getUserId } from '../middlewares/checkAuth';

const transactionController: Router = express.Router();

const transactionService = new TransactionService();

transactionController.post('/:id', verifyToken, (req: Request, res: Response) => {
    transactionService.create(req, getUserId(req))
        .then(created => res.send(created))
        .catch(err => res.status(500).send(err));
});

export const TransactionController: Router = transactionController;
