import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class IsnotloginGuard implements CanActivate {
  constructor(private _authService: AuthService, private _router: Router) { }
  canActivate(
    route: ActivatedRouteSnapshot,

    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const token = sessionStorage.getItem('token') || null;


    if (this._authService.isLoggedIn()) {

      this._router.navigate(['/dashboard'])
      return false;
    } else {

      return true
    }
  }

}
