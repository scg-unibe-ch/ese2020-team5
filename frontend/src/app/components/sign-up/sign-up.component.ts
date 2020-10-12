import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {
  signUpForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.signUpForm = this.formBuilder.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phoneNr: [''],
      gender: [''],
      country: [''],
      city: [''],
      zipCode: [''],
      address: [''],
      userName: ['', [Validators.required]],
      password: ['', [
        Validators.required,
        Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{7,}')
      ]],
      cPassword: ['']
    });
    this.signUpForm.get('password').valueChanges.subscribe(x => {
      this.checkConfirmPassword(x, this.signUpForm.value.cPassword);
    });
    this.signUpForm.get('cPassword').valueChanges.subscribe(x => {
      this.checkConfirmPassword(this.signUpForm.value.password, x);
    });
  }

  checkConfirmPassword(password: string, cPassword: string): void {
    if (password === cPassword) {
      this.signUpForm.controls.cPassword.setErrors(null);
    } else {
      this.signUpForm.controls.cPassword.setErrors({notEquivalent: true});
    }
  }

  userNameAlreadyInUse(): void {
    this.signUpForm.controls.userName.setErrors({inUse: true});
  }

  emailAlreadyInUse(): void {
    this.signUpForm.controls.email.setErrors({inUse: true});
  }

  signUp(): void {
    this.authService.signUp(this.signUpForm.value).then((data: any) => {
      console.log(data);
      this.router.navigate(['/login']);
    }).catch((error: any) => {
      if (error.error.message.message.indexOf('Email') > -1) {
        this.emailAlreadyInUse();
      } else if (error.error.message.message.indexOf('Username') > -1) {
        this.userNameAlreadyInUse();
      } else {
        console.log(error);
      }
    });
  }
}
