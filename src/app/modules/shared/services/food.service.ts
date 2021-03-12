import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { throwError, Observable, forkJoin } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';
import { LocationService } from './location.service';

@Injectable({
  providedIn: 'root',
})
export class FoodService {
  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
    private authService: AuthService,
    private locationService : LocationService
  ) {}

  getItemSubCategoryDetails(
    category: string,
    subCategory: string
  ): Observable<any> {
    return this.http
      .get(`${environment.apiUrl}/itembysubcategoryName/${subCategory}`)
      .pipe(
        map((resp: any) => resp.rows),
        catchError((err) => this.handleError(err))
      );
  }

  getRecentItems(category: string, pageNo: any): Observable<any> {
    return this.http.get(
      `${environment.apiUrl}/Newlyadded/${category}/${pageNo}`
    );
  }

  getBestSellerItems(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/bestseller`);
  }

  getItemDetailsInBulk(items: any): Observable<any[]> {
    let obsArr = [];
    for (let item of items) {
      if (item != null)
        obsArr.push(this.http.get(`${environment.apiUrl}/itemdetails/${item}`));
    }
    return forkJoin(obsArr).pipe(catchError((err) => this.handleError(err)));
  }

  getBreakfastDetails(): Observable<any> {
    return this.http
      .get(`${environment.apiUrl}/itembysubcategoryName/Breakfast/1`)
      .pipe(
        map((resp: any) => resp.rows),
        catchError((err) => this.handleError(err))
      );
  }

  getFoodPageDetails() {
    return this.http
      .get(`${environment.apiUrl}/foodpage`)
      .pipe(catchError((err) => this.handleError(err)));
  }

  getSugarPageDetails() {
    return this.http.get(`${environment.apiUrl}/sugarSpicesPage`);
  }

  getItemByName(code: string) {
    const data = [];
    if (code) {
      return this.http
        .get(`${environment.apiUrl}/byname/${code}`, {
          observe: 'response',
        })
        .pipe(
          map((response: any) => {
            return this.refinePayload(response.body);
          })
        );
    }
    return this.http
      .get(`${environment.apiUrl}/byname/${code ? code : 'all'}`, {
        observe: 'response',
      })
      .pipe(
        map((response: any) => {
          return this.refinePayload(response.body);
        })
      );
  }

  refinePayload(obj: any) {
    let data: any = [];
    Object.keys(obj).forEach((key) => {
      if (obj[key].length) {
        obj[key].forEach((item: any) => {
          data.push({
            type: key,
            itemname: item.itemname,
            imagePath: 'imagePath' in item ? item.imagePath : '',
            price: 'price' in item ? item.price : '',
            itemId: 'itemId' in item ? item.itemId : '',
            firstname: 'firstname' in item ? item.firstname : '',
            vendorId: 'vendorId' in item ? item.vendorId : '',
            subcategoryName:
              'subcategoryName' in item ? item.subcategoryName : '',
          });
        });
      }
    });

    const subCategories = data
      .filter((val: any) => val.type === 'subcategoryname')
      .filter(
        (itemObj: any, index: number, arr: any[]) =>
          arr.findIndex(
            (item: any) => item.subcategoryName === itemObj.subcategoryName
          ) === index
      );

    const vendors = data
      .filter((val: any) => val.type === 'vendorname')
      .filter(
        (itemObj: any, index: number, arr: any[]) =>
          arr.findIndex((item: any) => item.vendorId === itemObj.vendorId) ===
          index
      );

    const items = data
      .filter((val: any) => val.type === 'item')
      .filter(
        (itemObj: any, index: number, arr: any[]) =>
          arr.findIndex((item: any) => item.itemname === itemObj.itemname) ===
          index
      );

    return [...subCategories, ...vendors, ...items];
  }

  getChefsNearUserLocation(): Observable<any> {
    let city = this.locationService.CurrentCity;
    return this.http
      .get(`${environment.apiUrl}/chefnearyou/${city}`)
      .pipe(catchError((err) => this.handleError(err)));
  }

  getCuisineNearUserLocation(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/popularcuisine/1`).pipe(
      map((resp: any) => resp.rows),
      catchError((err) => this.handleError(err))
    );
  }

  getFoodItemsForHomePage(category: string): Observable<any> {
    return this.http
      .get(`${environment.apiUrl}/${category}`)
      .pipe(catchError((err) => this.handleError(err)));
  }

  getItemReviews(itemId: String) {
    return this.http.get(`${environment.apiUrl}/itemreview/${itemId}`);
  }

  getSimilarProducts(vendorId: String) {
    return this.http
      .get(`${environment.apiUrl}/vendorsimilarProducts/${vendorId}`)
      .pipe(catchError((err) => this.handleError(err)));
  }

  submitItemReview(
    itemId: String,
    review: String,
    reviewTitle: String,
    rating: number,
    vendorId: String
  ) {
    const options = new HttpHeaders({ 'Content-Type': 'application/json' });
    let userId = this.authService.getUserId();
    return this.http
      .post(
        `${environment.apiUrl}/itemreview`,
        {
          itemId,
          userId,
          review,
          reviewtitle: reviewTitle,
          ratingscrore: rating,
          vendorId,
        },
        { headers: options }
      )
      .pipe(catchError((err) => this.handleError(err)));
  }

  handleError(errorObj: HttpErrorResponse): Observable<any> {
    console.log(errorObj);
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
