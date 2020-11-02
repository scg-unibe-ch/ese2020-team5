import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
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
  returnURL: string;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.returnURL = this.route.snapshot.queryParams.returnURL;
    this.loginForm = this.formBuilder.group({
      userNameOrEmail: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  login(): void {
    this.authService.login(this.loginForm.value).then(() => {
      this.showErrorMessage = false;
      location.assign((this.returnURL) ? this.returnURL : 'home');
    }).catch(() => {
      this.showErrorMessage = true;
    });
  }
}
