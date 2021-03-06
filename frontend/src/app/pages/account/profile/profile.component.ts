import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { User } from '../../../models/user.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { countryList } from '../../sign-up/sign-up.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  userNameOrEmail = '';
  profileForm: FormGroup;
  user: User;
  editable = false;
  countryList = countryList;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private httpClient: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.userNameOrEmail = localStorage.getItem('userNameOrEmail');
    this.userService.getUser().then(user => {
      this.user = user;
      this.initializeForm();
    }).catch(() => {
      this.authService.logout();
    });
  }

  initializeForm(): void {
    this.profileForm = this.formBuilder.group({
      firstName: [this.user.firstName, [Validators.required]],
      lastName: [this.user.lastName, [Validators.required]],
      email: [this.user.email, [Validators.required]],
      phoneNr: [this.user.phoneNr],
      gender: [this.user.gender],
      country: [this.user.country],
      city: [this.user.city],
      zipCode: [this.user.zipCode],
      street: [this.user.street],
      userName: [this.user.userName, [Validators.required]]
    });
  }

  userNameAlreadyInUse(): void {
    this.profileForm.controls.userName.setErrors({inUse: true});
  }

  emailAlreadyInUse(): void {
    this.profileForm.controls.email.setErrors({inUse: true});
  }

  edit(): void {
    this.editable = true;
  }

  cancelEdit(): void {
    this.editable = false;
    this.initializeForm();
  }

  updateUser(): void {
    this.userService.updateUser(this.profileForm.value).then(() => {
      location.reload();
    }).catch(error => {
      if (error.error.indexOf('Email') > -1) {
        this.emailAlreadyInUse();
      } else if (error.error.indexOf('Username') > -1) {
        this.userNameAlreadyInUse();
      }
    });
  }
}
