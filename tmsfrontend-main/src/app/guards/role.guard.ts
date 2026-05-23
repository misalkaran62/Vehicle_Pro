import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree {

    if (!this.authService.isLoggedIn()) {
      // If not logged in, redirect to login
      return this.router.parseUrl('/auth/login');
    }

    const expectedRoles: string[] = route.data['roles'];
    const userRoles = this.authService.getRoles();

    const hasAccess = expectedRoles.some(role => userRoles.includes(role));

    if (!hasAccess) {
      // Redirect to unauthorized page
      return this.router.parseUrl('/unauthorized');
    }

    return true;
  }
}
