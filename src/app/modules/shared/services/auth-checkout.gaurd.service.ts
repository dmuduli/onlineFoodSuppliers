import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthCheckoutGaurdService {
  constructor(private router: Router, private authService: AuthService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const isFromSession = JSON.parse(
      sessionStorage.getItem('fromSession') as any
    );

    const isSignInFromHome = JSON.parse(
      sessionStorage.getItem('signInFromHome') as any
    );

    if (isFromSession || isSignInFromHome) {
      // authorised so return true
      return true;
    }

    // not logged in so redirect to login page with the return url
    this.router.navigate(['/home']);
    return false;
  }
}
