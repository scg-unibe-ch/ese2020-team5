import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private httpClient: HttpClient) { }

  signUp(form: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.httpClient.post(environment.endpointURL + 'user/register', form).subscribe((res: any) => {
        resolve(res);
      }, (error: any) => {
        reject(error);
      });
    });
  }

  login(form: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.httpClient.post(environment.endpointURL + 'user/login', form).subscribe((res: any) => {
        localStorage.setItem('userToken', res.token);
        localStorage.setItem('userName', res.user.userName);
        resolve(res);
      }, (error: any) => {
        reject(error);
      });
    });
  }

  logout(): void {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userName');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('userToken');
  }
}
