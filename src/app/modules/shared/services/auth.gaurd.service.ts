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
export class AuthGaurdService {
  constructor(private router: Router, private authService: AuthService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const user = this.authService.userValue;

    if (user) {
      // authorised so return true
      console.log('authorized');
      return true;
    }

    // not logged in so redirect to login page with the return url
    this.router.navigate(['/auth'], {
      queryParams: { returnUrl: state.url },
    });
    return false;
  }
}
