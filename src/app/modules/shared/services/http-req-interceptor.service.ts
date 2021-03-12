import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthService } from './auth.service';

@Injectable()
export class HttpReqHeaderInterceptor implements HttpInterceptor {
  public jwtHelper = new JwtHelperService();
  public token: string | null;

  constructor(public authService: AuthService) {
    this.token = '';
  }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    this.token = this.authService.getJwtToken();

    // add content-type
    req = req.clone({
      setHeaders: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.token,
      },
    });

    return next.handle(req);
  }
}
