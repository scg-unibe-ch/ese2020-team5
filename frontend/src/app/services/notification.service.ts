import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Notification } from '../models/notification.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  constructor(private httpClient: HttpClient) { }

  getNotifications(): Promise<Notification[]> {
    return new Promise<Notification[]>((resolve, reject) => {
      this.httpClient.get(environment.endpointURL + 'notification').subscribe((notifications: Notification[]) => {
        resolve(notifications);
      }, (error: any) => {
        reject(error);
      });
    });
  }

  readNotification(notificationId: number): Promise<Notification> {
    return new Promise<Notification>((resolve, reject) => {
      this.httpClient.put(environment.endpointURL + 'notification/' + notificationId, {}).subscribe((notification: Notification) => {
        resolve(notification);
      }, (error: any) => {
        reject(error);
      });
    });
  }

  deleteNotification(notificationId: number): Promise<Notification> {
    return new Promise<Notification>((resolve, reject) => {
      this.httpClient.delete(environment.endpointURL + 'notification/' + notificationId).subscribe((notification: Notification) => {
        resolve(notification);
      }, (error: any) => {
        reject(error);
      });
    });
  }
}
