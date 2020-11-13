import {Component, HostListener, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
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
    private formBuilder: FormBuilder,
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
    
  }

  searchItem(): void {
    location.assign('catalog?q=' + this.searchFilter);
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
