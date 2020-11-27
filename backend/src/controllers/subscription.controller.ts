import express, { Router, Request, Response } from 'express';

const webpush = require('web-push');

const subscriptionController: Router = express.Router();

const fakeDatabase = [];

subscriptionController.post('/', (req, res) => {
    const subscription = req.body;
    fakeDatabase.push(subscription);
});

subscriptionController.post('/sendNotification', (req, res) => {
    const notificationPayload = {
        notification: {
            title: 'New Notification',
            body: 'This is the body of a notification'
        }
    };

    /*
    const promises = [];
    fakeDatabase.forEach(subscription => {
        promises.push(webpush.sendNotification(subscription, JSON.stringify(notificationPayload)));
    });
    Promise.all(promises).then(() => res.sendStatus(200));
     */
});

export const SubscriptionController: Router = subscriptionController;
