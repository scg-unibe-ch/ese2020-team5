import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private user: User;

  constructor(private httpClient: HttpClient) { }

  getAllUsers(): Promise<User[]> {
    return new Promise((resolve, reject) => {
      this.httpClient.get(environment.endpointURL + 'user/all').subscribe((users: User[]) => {
        resolve(users);
      }, (error: any) => {
        reject(error);
      });
    });
  }

  getUser(): Promise<User> {
    return new Promise((resolve, reject) => {
      this.httpClient.get(environment.endpointURL + 'user').subscribe((user: User) => {
        resolve(user);
      }, (error: any) => {
        reject(error);
      });
    });
  }

  loadUser(): void {
    this.httpClient.get(environment.endpointURL + 'user').subscribe((user: User) => {
      this.user = user;
    });
  }

  getLoadedUser(): User {
    return this.user;
  }

  deleteUser(userId: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this.httpClient.delete(environment.endpointURL + 'user/' + userId).subscribe((res: any) => {
        resolve(res);
      }, (error: any) => {
        reject(error);
      });
    });
  }

  isAdmin(): boolean {
    return (this.user) ? this.user.isAdmin : false;
  }
  updateProfile(user: User): Promise<any> {
    return new Promise((resolve, reject) => {
      this.httpClient.put(environment.endpointURL + 'user/' + user.userId, user).subscribe((res: any) => {
        resolve(res);
      }, (error: any) => {
        reject(error);
      });
    });
  }
}
