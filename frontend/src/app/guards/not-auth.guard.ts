import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class NotAuthGuard implements CanActivate {
  constructor(private authService: AuthService) { }

  canActivate(): boolean {
    if (this.authService.isLoggedIn()) {
      location.assign('profile');
      return false;
    } else {
      return true;
    }
  }
}
