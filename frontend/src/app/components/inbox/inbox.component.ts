import { Component, OnInit } from '@angular/core';
import { Notification } from '../../models/notification.model';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.css']
})
export class InboxComponent implements OnInit {
  selectedIndex = -1;
  notifications: Notification[];
  markedNotifications: boolean[] = [];
  isMinOneMarked = false;
  areAllMarked = false;

  constructor(private notificationService: NotificationService) { }

  ngOnInit(): void {
    this.notificationService.getNotifications().then(notifications => {
      this.notifications = notifications.reverse();
      this.initializeMarkedList();
      this.selectNotification(0);
    }).catch(() => {
      this.notifications = [];
    });
  }

  initializeMarkedList(): void {
    this.notifications.forEach(() => {
      this.markedNotifications.push(false);
    });
  }

  selectNotification(index: number): void {
    this.selectedIndex = index;
    if (!this.notifications[this.selectedIndex].read) {
      this.notificationService.readNotification(this.notifications[this.selectedIndex].notificationId).then(notification => {
        this.notifications[this.selectedIndex] = notification;
      });
    }
  }

  updateMarkedState(): void {
    let isMinOneMarked = false;
    let areAllMarked = true;
    this.markedNotifications.forEach(marked => {
      if (marked) {
        isMinOneMarked = true;
      } else {
        areAllMarked = false;
      }
    });
    this.isMinOneMarked = isMinOneMarked;
    this.areAllMarked = areAllMarked;
  }

  updateMarkedList(): void {
    this.markedNotifications.forEach((marked, index) => {
      this.markedNotifications[index] = this.areAllMarked;
    });
    this.updateMarkedState();
  }

  setMarkedNotificationsAsRead(): void {
    this.markedNotifications.forEach((marked, index) => {
      if (marked) {
        this.notificationService.readNotification(this.notifications[index].notificationId).then(notification => {
          this.notifications[index] = notification;
        });
      }
    });
  }
}
