import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';
import { NotificationService } from './services/notification.service';
import { DataSharingService } from './services/data-sharing.service';

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
  cartItemsAmount = 0;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private notificationService: NotificationService,
    private dataSharingService: DataSharingService
  ) { }

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      if (localStorage.getItem('userName')) {
        this.userName = this.correctNameLength(localStorage.getItem('userName'));
      }
      this.dataSharingService.unreadNotificationsAmount.subscribe(value => this.newNotifications = value);
      this.dataSharingService.cartItemsAmount.subscribe(value => this.cartItemsAmount = value);
      this.isLoggedIn = true;
      this.initAccountData();
    }
  }

  initAccountData(): void {
    if (this.authService.isLoggedIn()) {
      this.userService.getUser().then(user => {
        this.userName = this.correctNameLength(user.userName);
        this.isAdmin = user.isAdmin;
      }).catch(() => {
        this.isLoggedIn = false;
        this.authService.logout();
        this.userName = 'My Account';
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
