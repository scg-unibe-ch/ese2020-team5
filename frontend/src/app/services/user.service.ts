import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { PublicUser } from '../models/publicUser.model';

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

  getUserById(userId: number): Promise<PublicUser> {
    return new Promise<PublicUser>((resolve, reject) => {
      this.httpClient.get(environment.endpointURL + 'user/' + userId + '/public').subscribe((user: PublicUser) => {
        resolve(user);
      }, (error: any) => {
        reject(error);
      });
    });
  }

  updateUser(user: User): Promise<User> {
    return new Promise<User>((resolve, reject) => {
      this.httpClient.put(environment.endpointURL + 'user/update', user).subscribe((updatedUser: User) => {
        resolve(updatedUser);
      }, (error: any) => {
        reject(error);
      });
    });
  }

  rechargeCredits(amount: number): Promise<User> {
    return new Promise<User>((resolve, reject) => {
      this.httpClient.put(environment.endpointURL + 'user/update', { credits: amount }).subscribe((user: User) => {
        resolve(user);
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
}
