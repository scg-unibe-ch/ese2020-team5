import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private httpClient: HttpClient) { }

  signUp(form: any): Promise<User> {
    return new Promise<User>((resolve, reject) => {
      this.httpClient.post(environment.endpointURL + 'user/register', form).subscribe((user: User) => {
        resolve(user);
      }, (error: any) => {
        reject(error);
      });
    });
  }

  login(form: any): Promise<LoginResponse> {
    return new Promise<LoginResponse>((resolve, reject) => {
      this.httpClient.post(environment.endpointURL + 'user/login', form).subscribe((res: LoginResponse) => {
        resolve(res);
      }, (error: any) => {
        reject(error);
      });
    });
  }

  logout(): void {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userNameOrEmail');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('userToken');
  }
}

class LoginResponse {
  user: User;
  token: string;
}
