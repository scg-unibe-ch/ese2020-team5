import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute,Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  secureEndpointResponse = '';
  userNameOrEmail = '';
  profileForm: FormGroup;
  user: User = null;
  id: number;

  constructor(
    private authService: AuthService,
    private httpClient: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.userNameOrEmail = localStorage.getItem('userNameOrEmail');
    this.userService.getUser().then(user => {
      this.user = user;
      this.initialize();
    });
  }

  initialize(): void {
    this.profileForm = this.formBuilder.group({
      userId: [this.user.userId, [Validators.required]],
      userName: [this.user.userName, [Validators.required]],
      email: [this.user.email, [Validators.required]],
      firstName: [this.user.firstName, [Validators.required]],
      lastName: [this.user.lastName, [Validators.required]],
      gender: [this.user.gender, [Validators.required]],
      country: [this.user.country, [Validators.required]],
      city: [this.user.city, [Validators.required]],
      zipCode: [this.user.zipCode, [Validators.required]],
      phoneNr: [this.user.phoneNr, [Validators.required]]
    });
  }
  

  logout(): void {
    this.authService.logout();
    location.assign('login');
  }

  accessSecuredEndpoint(): void {
    this.httpClient.get(environment.endpointURL + 'secured').subscribe((res: any) => {
      this.secureEndpointResponse = 'Successfully accessed secure endpoint. Message from server: ' + res.message;
    }, (error: any) => {
      this.secureEndpointResponse = 'Unauthorized';
    });
  }

  updateProfile(): void {
    this.userService.updateProfile(Object.assign({ userId: this.user.userId }, this.profileForm.value))
  }

}
