import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(
    private userService: UserService,
    private router: Router
  ) { }

  canActivate(): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      this.userService.getUser().then(user => {
        if (user.isAdmin) {
          resolve(true);
        } else {
          reject(false);
          this.router.navigate(['/home']);
        }
      }).catch(() => {
        reject(false);
        this.router.navigate(['/home']);
      });
    });
  }
}
