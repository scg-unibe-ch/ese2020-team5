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
    return new Promise<User>((resolve, reject) => {
      this.httpClient.get(environment.endpointURL + 'user').subscribe((user: User) => {
        resolve(user);
      }, (error: any) => {
        reject(error);
      });
    });
  }

  updateUser(user: User): Promise<User> {
    return new Promise<User>((resolve, reject) => {
      this.httpClient.put(environment.endpointURL + 'user', user).subscribe((updatedUser: User) => {
        resolve(updatedUser);
      }, (error: any) => {
        reject(error);
      });
    });
  }

  // ---Only for Admins--- //
  getAllUsers(): Promise<User[]> {
    return new Promise<User[]>((resolve, reject) => {
      this.httpClient.get(environment.endpointURL + 'user/all').subscribe((users: User[]) => {
        resolve(users);
      }, (error: any) => {
        reject(error);
      });
    });
  }

  deleteUser(userId: number): Promise<User> {
    return new Promise<User>((resolve, reject) => {
      this.httpClient.delete(environment.endpointURL + 'user/' + userId).subscribe((user: User) => {
        resolve(user);
      }, (error: any) => {
        reject(error);
      });
    });
  }

  isAdmin(): boolean {
    return (this.user) ? this.user.isAdmin : false;
  }
  updateUser(user: User): Promise<any> {
    return new Promise((resolve, reject) => {
      this.httpClient.put(environment.endpointURL + 'user/' + user.userId, user).subscribe((res: any) => {
        resolve(res);
      }, (error: any) => {
        reject(error);
      });
    });
  }
}
