import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree,Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class IsLoginGuard implements CanActivate {
  isTokenexpire:boolean=false;
  constructor(private _authService:AuthService,private _router:Router){
 
  }     


  
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    

      if (this._authService.isLoggedIn()) {
        // User is logged in, allow access to the route
        return true;
      } else {
        // User is not logged in, redirect to the login page
        return this._router.createUrlTree(['/auth']); // Change '/login' to your desired route
      }
    }

  
}
