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
  isAdmin = false;

  constructor(
    private authService: AuthService,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.userService.getUser().then(user => {
        this.isAdmin = user.isAdmin;
      }).catch(() => {
        this.authService.logout();
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

  navigateTo(page: string): void {
    location.assign(page);
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }
}
