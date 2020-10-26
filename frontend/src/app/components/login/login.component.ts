import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-user-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  showErrorMessage = false;
  hide = true;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      userNameOrEmail: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  login(): void {
    this.authService.login(this.loginForm.value).then((data: any) => {
      this.showErrorMessage = false;
      localStorage.setItem('userToken', data.token);
      localStorage.setItem('userNameOrEmail', data.user.userName);
      location.assign('home');
    }).catch((error: any) => {
      console.log(error);
      this.showErrorMessage = true;
    });
  }
}
