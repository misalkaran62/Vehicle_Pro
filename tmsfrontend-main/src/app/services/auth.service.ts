import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, catchError, map, Observable, of, tap } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // url=environment.apiUrl;
  // constructor(private httpClient:HttpClient) { }

  // login(loginData:any){

  //   console.log(this.url)
  //   console.log(loginData)
  //   return this.httpClient.post(`${this.url}/auth/login`,loginData)
  // }

 
  // isLoggedIn(){
  //   return sessionStorage.getItem('token') !== null && sessionStorage.getItem('token') !=undefined && sessionStorage.getItem('token') !=='';
  // }
  // tokenIsExpired(token:string) {


  //   return  this.httpClient.post(`${this.url}/auth/checkToken/${token}`,{});
     
  // }
  // forgetPassword(email:any){
  //   return this.httpClient.get(`${this.url}/password/forgot?email=${email}`)
  // }

  private url = environment.apiUrl;
  private rolesSubject = new BehaviorSubject<string[]>([]);
  roles$ = this.rolesSubject.asObservable();

  constructor(private httpClient: HttpClient,private jwthelper:JwtHelperService) { }

  login(loginData: any): Observable<any> {
    console.log(this.url);
    console.log(loginData);
    return this.httpClient.post<any>(`${this.url}/auth/login`, loginData).pipe(
      tap(response => {
        if (response.jwtToken) {
          sessionStorage.setItem('token', response.jwtToken);
          // Assuming the roles are part of the response
          if (response.roles) {
            sessionStorage.setItem('roles', JSON.stringify(response.roles));
            this.rolesSubject.next(response.roles);
          } else {
            // If roles are not part of the response, fetch them
            this.fetchUserRoles().subscribe();
          }
        }
      }),
      catchError(error => {
        console.error('Login error', error);
        return of(error);
      })
    );
  }

  changepassword(email:any,oldpass:any,newpass:any){
    console.log("changepassword data",email);
    console.log("changepassword data",oldpass);
    console.log("changepassword data",newpass);
    
    
    return this.httpClient.get(`${this.url}/password/change?email=${email}&oldPassword=${oldpass}&newPassword=${newpass}`)
  }


  isLoggedIn(): boolean {
    return sessionStorage.getItem('token') !== null && sessionStorage.getItem('token') !== undefined && sessionStorage.getItem('token') !== '';
  }

  tokenIsExpired(token: string): Observable<any> {
    return this.httpClient.post(`${this.url}/auth/checkToken/${token}`, {});
  }

  forgetPassword(email: any): Observable<any> {
    return this.httpClient.get(`${this.url}/password/forgot?email=${email}`);
  }

  getRoles(): string[] {
    const roles = sessionStorage.getItem('roles');
    return roles ? JSON.parse(roles) : [];
  }

  fetchUserRoles(): Observable<any> {
    return this.httpClient.get<any>(`${this.url}/auth/currentUser`).pipe(
      tap(user => {
        if (user.roles) {
          sessionStorage.setItem('roles', JSON.stringify(user.roles));
          this.rolesSubject.next(user.roles);
        }
      }),
      catchError(error => {
        console.error('Error fetching user roles', error);
        return of(null);
      })
    );
  }

  logout(): void {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('roles');
    this.rolesSubject.next([]);
  }

  isTokenExpired(token: string): boolean {
    if (this.jwthelper.isTokenExpired(token)) {
    console.log("your token is expired")
     return true;
  } else {
     return false
  }
  }
  

}
