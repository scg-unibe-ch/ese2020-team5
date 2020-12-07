import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';
import { NotificationService } from './services/notification.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  searchFilter = '';
  isAdmin = false;
  isLoggedIn = false;
  userName = 'My Account';
  newNotifications = 0;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    if (localStorage.getItem('userName')) {
      this.userName = this.correctNameLength(localStorage.getItem('userName'));
    }
    if (this.authService.isLoggedIn()) {
      this.isLoggedIn = true;
      this.userService.getUser().then(user => {
        this.userName = this.correctNameLength(user.userName);
        this.isAdmin = user.isAdmin;
      }).catch(() => {
        this.isLoggedIn = false;
        this.authService.logout();
        this.userName = 'My Account';
      });
      this.notificationService.getNotifications().then(notifications => {
        notifications.forEach(notification => {
          if (!notification.read) {
            this.newNotifications++;
          }
        });
      });
    }
  }

  correctNameLength(name: string): string {
    if (name.length > 11) {
      return name.substring(0, 10) + '...';
    } else {
      return name;
    }
  }

  searchItem(): void {
    if (this.searchFilter && this.searchFilter.replace(/ /g, '') !== '') {
      location.assign('catalog?q=' + this.searchFilter);
    } else {
      location.assign('catalog');
    }
  }
}
