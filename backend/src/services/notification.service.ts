import {Notification, NotificationCreationAttributes} from '../models/notification.model';
import { User } from '../models/user.model';
import { EmailService, EmailAttributes } from './email.service';
const emailService = new EmailService();

export class NotificationService {

    public get(userId: number): Promise<Notification[]> {
        return Notification.findAll({where: {userId: userId}})
            .then(notifications => Promise.resolve(notifications))
            .catch(err => Promise.reject(err));
    }

    public read(userId: number, notificationId: string): Promise<Notification> {
        return Notification.findOne({where: {notificationId: notificationId, userId: userId}})
            .then(notification => {
                const updatedNotification = {
                    read: 1
                };
                return notification.update(updatedNotification);
            })
            .catch(err => Promise.reject(err));
    }

    public create(userId: number, text: string): Promise<Notification> {
        const NotificationParams: NotificationCreationAttributes = {
            userId: userId,
            text: text,
            read: 0
        };

        const mailOptions: EmailAttributes = {
            from: 'team5@roux.li',
            text: text,
            subject: 'EMail from your loved web shop',
            to: null
        };

        return User.findByPk(userId)
            .then(user => {
                if (!user) {
                    return Promise.reject('Could not find the user to send a mail to');
                } else {
                    mailOptions.to = user.email;
                    // The whole procedure should not fail just because the mail goes not out!
                    return emailService.send(mailOptions)
                        .catch(() => {
                            console.log('Mail could not be send!');
                            return Promise.resolve();
                        });
                }
            })
            .then(() => {
                return Notification.create(NotificationParams);
            })
            .catch(err => Promise.reject(err));
    }
}
