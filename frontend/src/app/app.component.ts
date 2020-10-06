import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  navList = [
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

  constructor() {}

  ngOnInit(): void {
  }
}
