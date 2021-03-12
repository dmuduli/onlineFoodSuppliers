import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { throwError, Observable, forkJoin, Subject } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private hideMenuInMobile: boolean;
  hideMenuStatusChange: Subject<boolean> = new Subject<boolean>();

  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
    private authService: AuthService
  ) {
    this.hideMenuInMobile = false;
  }

  getMobileMenuDisplayStatus(): boolean {
    return this.hideMenuInMobile;
  }

  setMobileMenuDisplayStatus(isView: boolean) {
    this.hideMenuInMobile = isView;
    this.hideMenuStatusChange.next(this.hideMenuInMobile);
  }

  getPersonalDetails(id: any) {
    return this.http.get(`${environment.apiUrl}/userdetails/${id}`);
  }

  updatePersonalDetails(persData: any) {
    persData['userId'] = localStorage.getItem('userId');
    //console.log(persData);
    return this.http.put(`${environment.apiUrl}/updateuserdetails`, persData, {
      responseType: 'text',
    });
  }

  getAddressDetails() {
    const id = localStorage.getItem('userId');
    return this.http.get(`${environment.apiUrl}/useraddress/${id}`);
  }

  getAllStateDetails() {
    return this.http.get(`${environment.apiUrl}/states`);
  }

  addProfileAddress(addressData: any) {
    addressData['userId'] = localStorage.getItem('userId');
    return this.http.post(`${environment.apiUrl}/addlocation`, addressData);
  }

  updateProfileAddress(addressData: any) {
    addressData['userId'] = localStorage.getItem('userId');
    return this.http.put(`${environment.apiUrl}/updateaddress`, addressData);
  }

  deleteProfileAddress(addressId: any) {
    return this.http.delete(`${environment.apiUrl}/deleteaddress/${addressId}`);
  }

  getOrderDetails(pageno: number): Observable<any> {
    let userId = this.authService.getUserId();
    return this.http
      .get(`${environment.apiUrl}/userOrderList/${userId}/${pageno}/2`)
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
