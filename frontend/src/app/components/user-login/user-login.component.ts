import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.css']
})
export class UserLoginComponent implements OnInit {
  loginForm: FormGroup;

  userNameOrEmail = '';
  password = '';

  userToken: string;
  loggedIn = false;

  secureEndpointResponse = '';

  constructor(
    private formBuilder: FormBuilder,
    private httpClient: HttpClient,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.checkUserStatus();
    this.loginForm = this.formBuilder.group({
      userNameOrEmail: [''],
      password: ['']

    });
  }

  checkUserStatus(): void {
    // Get user data from local storage
    this.userToken = localStorage.getItem('userToken');
    this.userNameOrEmail = localStorage.getItem('userNameOrEmail');

    // Set boolean whether a user is logged in or not
    this.loggedIn = !!(this.userToken);
  }

  login(): void {
    this.httpClient.post(environment.endpointURL + 'user/login', {
      userNameOrEmail: this.loginForm.value.userNameOrEmail,
      password: this.loginForm.value.password
    }).subscribe((res: any) => {
      // Set user data in local storage
      localStorage.setItem('userToken', res.token);
      localStorage.setItem('userNameOrEmail', res.user.userName);

      this.checkUserStatus();
    });
  }

  logout(): void {
    // Remove user data from local storage
    localStorage.removeItem('userToken');
    localStorage.removeItem('userNameOrEmail');

    this.checkUserStatus();
  }

  /**
   * Function to access a secure endpoint that can only be accessed by logged in users by providing their token.
   */
  accessSecuredEndpoint(): void {
    this.httpClient.get(environment.endpointURL + 'secured').subscribe((res: any) => {
      this.secureEndpointResponse = 'Successfully accessed secure endpoint. Message from server: ' + res.message;
    }, (error: any) => {
      this.secureEndpointResponse = 'Unauthorized';
    });
  }
}
