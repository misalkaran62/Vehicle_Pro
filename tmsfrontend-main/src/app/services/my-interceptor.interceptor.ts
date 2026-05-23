import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable()
export class MyInterceptorInterceptor implements HttpInterceptor {
  constructor(private tokenService: AuthService, private router: Router) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const token = sessionStorage.getItem('token');


    // If the token is valid, add the Authorization header
    const clonedRequest = token
      ? request.clone({
          headers: request.headers.set('Authorization', `Bearer ${token}`),
        })
      : request;

    return next.handle(clonedRequest);
  }
}
