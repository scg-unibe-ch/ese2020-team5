import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(private userService: UserService) { }

  canActivate(): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      this.userService.getUser().then(user => {
        if (user.isAdmin) {
          resolve(true);
        } else {
          reject(false);
          location.assign('catalog');
        }
      }).catch(() => {
        reject(false);
        location.assign('catalog');
      });
    });
  }
}
