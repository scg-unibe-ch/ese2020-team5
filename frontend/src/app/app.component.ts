import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  navList;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.navList = [
        {
          name: 'Profile',
          url: 'profile'
        },
        {
          name: 'Home',
          url: 'home'
        },
        {
          name: 'Create Listing',
          url: 'create-listing'
        }
      ];
    } else {
      this.navList = [
        {
          name: 'Sign Up',
          url: 'signup'
        },
        {
          name: 'Login',
          url: 'login'
        },
        {
          name: 'Home',
          url: 'home'
        }
      ];
    }
  }
}
