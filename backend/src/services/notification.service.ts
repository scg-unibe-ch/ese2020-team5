import {Notification, NotificationCreationAttributes} from '../models/notification.model';


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
        return Notification.create(NotificationParams);
    }
}
