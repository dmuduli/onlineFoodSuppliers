import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OfferService {
  constructor() {}

  getTopBannerDetails(): Observable<any> {
    let bannerItem = [
      {
        bannerurl: 'assets/images/slides/SI.jpg',
        bannerTitle: 'South Indian Food',
        bannerDesc: 'Huge variery of food at the best price',
        bannerCategory: 'subcategory',
        bannerDetCategoryname: 'South Indian',
        bannerDetCategoryId: '',
      },
      {
        bannerurl: 'assets/images/slides/NI.jpg',
        bannerTitle: 'North Indian food',
        bannerDesc: 'Huge variery of food at the best price',
        bannerCategory: 'subcategory',
        bannerDetCategoryname: 'North Indian',
        bannerDetCategoryId: '',
      },
      {
        bannerurl: 'assets/images/slides/pizza.jpg',
        bannerTitle: 'Pizza',
        bannerDesc: 'Unique Variety of Home made Pizzas',
        bannerCategory: 'cuisine',
        bannerDetCategoryname: '',
        bannerDetCategoryId: 'Pizza',
      },
      {
        bannerurl: 'assets/images/slides/thali.jpg',
        bannerTitle: 'Thali',
        bannerDesc: 'All types of specially Homemmade thalis',
        bannerCategory: 'cuisine',
        bannerDetCategoryname: '',
        bannerDetCategoryId: 'Thali',
      },
      {
        bannerurl:
          'https://res.cloudinary.com/pullkart/image/upload/v1612182086/ctghbim7msuzdhdxw4p0.jpg',
        bannerTitle: 'Moong Dal (with Coconut)',
        bannerDesc: 'All types of specially Homemmade Moong Dal (with Coconut)',
        bannerCategory: 'food',
        bannerDetCategoryname: '',
        bannerDetCategoryId: '0031cacb-80bc-42f8-9e1c-1a22d285d53d',
      },
    ];
    let sampleObs = new Observable((observer) => {
      observer.next(bannerItem);
      observer.complete();
    });
    return sampleObs;
    // const id = localStorage.getItem('userId');
    // return this.http.get(`${environment.apiUrl}/getBannerDetails/${id}`);
  }

  getBottomBannerDetails(): Observable<any> {
    let bannerItem = [
      {
        bannerurl: 'assets/images/slides/chinese.jpg',
        bannerTitle: 'Zoho Delivery',
        bannerDesc: 'Huge variety of chinese dishes.We deliver in record time',
        bannerCategory: 'subcategory',
        bannerDetCategoryname: 'oriental',
        bannerDetCategoryId: '',
      },
      {
        bannerurl: 'assets/images/slides/burger.jpg',
        bannerTitle: 'Zoho Delivery',
        bannerDesc: 'All types of burgers.Brought to your door step.',
        bannerCategory: 'cuisine',
        bannerDetCategoryname: '',
        bannerDetCategoryId: '12wsed-2aqaw-2ewr',
      },
    ];
    let sampleObs = new Observable((observer) => {
      observer.next(bannerItem);
      observer.complete();
    });
    return sampleObs;
    // const id = localStorage.getItem('userId');
    // return this.http.get(`${environment.apiUrl}/getBottomBannerDetails/${id}`);
  }
}
