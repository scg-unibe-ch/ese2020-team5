import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';

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
    private router: Router
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
      pinCode: [''],
      userName: ['', [Validators.required]],
      password: ['', [
        Validators.required,
        Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}')
      ]],
      c_password: ['']
    });
  }

  validateConfirmPW(): void {
    this.signUpForm.controls.c_password.setValidators([Validators.pattern(this.signUpForm.value.password)]);
    this.signUpForm.controls.c_password.updateValueAndValidity();
  }

  signUp(): void {
    this.http.post(environment.endpointURL + 'user/register', this.signUpForm.value).subscribe((data: any) => {
      console.log(data);
      this.router.navigate(['/login']);
    }, (error: any) => {
      console.log(error);
    });
  }
}
