/**
 * A router guard for the Administrator module that ensures
 * users are redirected to authentication page if they don't
 * have admin privileges but are attempting to access pages
 * that require admin access.
 */
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../model/auth.service';

@Injectable()
export class AuthGuard {
  constructor(private router: Router, private authService: AuthService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (!this.authService.isAuthenticated()) {
      this.router.navigateByUrl('/admin/auth');
      return false;
    }
    return true;
  }
}
