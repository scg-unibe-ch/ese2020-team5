import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  searchFilter = '';
  isAdmin = false;
  userName = 'My Account';

  constructor(
    private authService: AuthService,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    if (localStorage.getItem('userName')) {
      this.userName = localStorage.getItem('userName');
    }
    if (this.authService.isLoggedIn()) {
      this.userService.getUser().then(user => {
        this.userName = user.userName;
        this.isAdmin = user.isAdmin;
      }).catch(() => {
        this.authService.logout();
        this.userName = 'My Account';
      });
    }
  }

  searchItem(): void {
    if (this.searchFilter && this.searchFilter.replace(/ /g, '') !== '') {
      location.assign('catalog?q=' + this.searchFilter);
    } else {
      location.assign('catalog');
    }
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }
}
