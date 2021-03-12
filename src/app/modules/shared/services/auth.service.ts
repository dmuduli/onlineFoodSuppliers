import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { BehaviorSubject, Observable, of, Subject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { User } from './../models/user';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Tokens } from './../models/tokens';
import { CartService } from './cart.service';
import { LocationService } from  './location.service'
import { environment } from 'src/environments/environment';

import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userSubject: BehaviorSubject<User | null>;
  public user: Observable<User | null>;
  decodedToken: any;
  currentUser: string;
  private hideHeader: boolean;
  hideHeaderStatusChange: Subject<boolean> = new Subject<boolean>();
  jwtHelper = new JwtHelperService();
  private readonly JWT_TOKEN = 'JWT_TOKEN';
  private readonly REFRESH_TOKEN = 'REFRESH_TOKEN';

  constructor(
    private router: Router,
    private http: HttpClient,
    private locationService: LocationService,
    private toastr: ToastrService
  ) {
    this.userSubject = new BehaviorSubject<User | null>(
      this.jwtHelper.decodeToken(localStorage.getItem(this.JWT_TOKEN)!)
    );
    this.user = this.userSubject.asObservable();
    this.currentUser = '';
    this.hideHeader = true;
  }

  getHeaderDisplayStatus(): boolean {
    return this.hideHeader;
  }

  setHeaderDisplayStatus(isView: boolean) {
    this.hideHeader = isView;
    this.hideHeaderStatusChange.next(this.hideHeader);
  }

  public get userValue(): User | null {
    return this.userSubject.value;
  }

  private doLoginUser(username: string, tokens: Tokens) {
    this.currentUser = username;
    this.storeTokens(tokens);
  }

  private storeTokens(tokens: Tokens) {
    localStorage.setItem(this.JWT_TOKEN, tokens.token);
    const decodedToken = this.jwtHelper.decodeToken(tokens.token);
    this.userSubject.next(decodedToken);
    const userId = decodedToken.user.userId;
    this.currentUser = decodedToken.user.firstname;
    localStorage.setItem('userId', userId);
  }

  getUserId() {
    return localStorage.getItem('userId');
  }

  login(email: string, password: string) {
    let cred = {
      email_Id: email,
      password: password,
    };
    return this.http.post<User>(`${environment.apiUrl}/login`, cred).pipe(
      tap((data: any) =>
        this.doLoginUser(cred.email_Id, {
          token: data.token,
          refreshToken: data.token,
        })
      ),
      catchError((err) => this.handleError(err))
    );
  }

  changePassword(password: string, newpassword: string) {
    const id = this.getUserId();
    return this.http.put(`${environment.apiUrl}/changepasword`, {
      password,
      newpassword,
      Id: id,
    });
  }

  logout() {
    // remove user from local storage and set current user to null
    this.currentUser = '';
    this.removeTokens();
    this.userSubject.next(null);
    this.router.navigate(['/auth']);
  }

  private removeTokens() {
    localStorage.removeItem(this.JWT_TOKEN);
    localStorage.removeItem('userId');
    sessionStorage.removeItem('cartData');
    // localStorage.clear();
  }

  isLoggedIn() {
    return !!this.getJwtToken();
  }

  getJwtToken() {
    return localStorage.getItem(this.JWT_TOKEN);
  }

  register(user: any) {
    let newUser = {
      firstname: user.name,
      email_Id: user.email,
      mobileNumber: user.mobile,
      password: user.password,
      roles: 'enduser',
    };
    return this.http
      .post(`${environment.apiUrl}/register`, newUser)
      .pipe(catchError((err) => this.handleError(err)));
  }

  handleError(errorObj: HttpErrorResponse): Observable<any> {
    //console.log(errorObj);
    let errorMsg: any;
    if (typeof errorObj.error === 'string') {
      errorMsg = errorObj.error;
      this.toastr.error(errorObj.error, 'Error');
    } else if (typeof errorObj.error === 'object') {
      if ('errors' in errorObj.error) {
        errorMsg = errorObj.error.errors[0].message;
        this.toastr.error(errorMsg, 'Error');
      } else {
        errorMsg = errorObj.error.name;
        this.toastr.error(errorObj.error.name, 'Error');
      }
    } else {
      errorMsg = errorObj.message;
      this.toastr.error(errorObj.message, 'Error');
    }
    return throwError(errorMsg);
  }
}
