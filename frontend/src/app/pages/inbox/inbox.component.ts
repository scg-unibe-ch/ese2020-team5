import { Component, OnInit } from '@angular/core';
import { Notification } from '../../models/notification.model';
import { NotificationService } from '../../services/notification.service';
import { DataSharingService } from '../../services/data-sharing.service';

@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.css']
})
export class InboxComponent implements OnInit {
  selectedIndex = -1;
  notifications: { notification: Notification, marked: boolean }[];
  isMinOneMarked = false;
  areAllMarked = false;

  constructor(
    private notificationService: NotificationService,
    private dataSharingService: DataSharingService
  ) { }

  ngOnInit(): void {
    this.notificationService.getNotifications().then(notifications => {
      this.notifications = [];
      notifications.reverse().forEach(notification => {
        this.notifications.push({
          notification,
          marked: false
        });
      });
      this.selectNotification(0);
    }).catch(() => {
      this.notifications = [];
    });
  }

  selectNotification(index: number): void {
    this.selectedIndex = index;
    if (!this.notifications[this.selectedIndex].notification.read) {
      this.notificationService.readNotification(this.notifications[this.selectedIndex].notification.notificationId).then(notification => {
        this.dataSharingService.updateUnreadNotificationsAmount();
        this.notifications[this.selectedIndex].notification = notification;
      });
    }
  }

  updateMarkedState(): void {
    this.isMinOneMarked = this.notifications.some(notification => notification.marked);
    this.areAllMarked = this.notifications.every(notification => notification.marked);
  }

  updateMarkedList(): void {
    this.notifications.forEach((notification, index) => {
      notification.marked = this.areAllMarked;
    });
    this.updateMarkedState();
  }

  setMarkedNotificationsAsRead(): void {
    this.notifications.forEach((notification, index) => {
      if (notification.marked) {
        this.notificationService.readNotification(this.notifications[index].notification.notificationId).then(readNotification => {
          this.dataSharingService.updateUnreadNotificationsAmount();
          this.notifications[index].notification = readNotification;
        });
      }
    });
  }

  deleteMarkedNotification(): void {
    this.notifications.forEach((notification, index) => {
      if (notification.marked) {
        if (this.selectedIndex === index) {
          this.selectedIndex = 0;
        }
        this.notificationService.deleteNotification(this.notifications[index].notification.notificationId).then(deleted => {
          this.notifications = this.notifications.filter(entry => entry.notification.notificationId !== deleted.notificationId);
          this.dataSharingService.updateUnreadNotificationsAmount();
          this.updateMarkedState();
        });
      }
    });
  }
}
