import {Component, HostListener, OnInit} from '@angular/core';
import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  searchFilter = '';
  myAccountArrow = 'expand_more';
  myAccountModalShown = false;
  myAccount = '';

  constructor(
    private authService: AuthService,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.userService.loadUser();
    if (this.authService.isLoggedIn()) {
      this.userService.getUser().then(user => {
        this.myAccount = user.userName;
        if (this.myAccount.length > 12) {
          this.myAccount = this.myAccount.substring(0, 10) + '..';
        }
      }).catch(() => {
        this.authService.logout();
        this.myAccount = 'My Account';
      });
    } else {
      this.myAccount = 'My Account';
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    if (this.myAccountModalShown) {
      this.openCloseAccountModal();
    }
  }

  modifyAccountContentPos(): void {
    const navEntries = document.getElementById('nav-entries');
    const navEntriesRight = window.getComputedStyle(navEntries).right;
    const navEntriesWidth = window.getComputedStyle(navEntries).width;
    const myAccountWidth = document.getElementById('my-account').offsetWidth;
    const myAccountContentWidth = document.getElementById('my-account-content').offsetWidth;
    const elmCenterPosition = parseInt(navEntriesRight, 10) + parseInt(navEntriesWidth, 10)
      - (myAccountWidth / 2) - (myAccountContentWidth / 2);
    document.getElementById('my-account-content').style.right =
      (elmCenterPosition >= 0) ? (elmCenterPosition + 'px') : (0 + 'px');
  }

  searchItem(): void {
    if (this.searchFilter && this.searchFilter.replace(/ /g, '') !== '') {
      location.assign('catalog?q=' + this.searchFilter);
    } else {
      location.assign('catalog');
    }
  }

  openCloseAccountModal(): void {
    this.myAccountModalShown = !this.myAccountModalShown;
    if (this.myAccountModalShown) {
      this.modifyAccountContentPos();
      this.myAccountArrow = 'expand_less';
      document.getElementById('my-account-bg').style.display = 'block';
      document.getElementById('my-account-content').style.visibility = 'visible';
    } else {
      this.myAccountArrow = 'expand_more';
      document.getElementById('my-account-bg').style.display = 'none';
      document.getElementById('my-account-content').style.visibility = 'hidden';
    }
  }

  navigateTo(page: string): void {
    location.assign(page);
  }

  isAdmin(): boolean {
    return this.userService.isAdmin();
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }
}
