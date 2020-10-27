import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private httpClient: HttpClient) { }

  getUser(): Promise<User> {
    return new Promise((resolve, reject) => {
      this.httpClient.get(environment.endpointURL + 'user').subscribe((res: any) => {
        resolve(res);
      }, (error: any) => {
        reject(error);
      });
    });
  }
}
