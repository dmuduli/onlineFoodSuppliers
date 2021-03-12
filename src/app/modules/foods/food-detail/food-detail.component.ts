import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { CartService } from '../../shared/services/cart.service';
import { AuthService } from '../../shared/services/auth.service';
import { FoodService } from '../../shared/services/food.service';
import { VendorService } from '../../shared/services/vendor.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { PlaceOrderComponent } from '../place-order/place-order.component';
import { handleError } from '../../shared/helpers/error-handler';

export interface Item {
  ItemImageUrl: string;
  ItemName: string;
  ItemPrice: number;
  ItemItemId: string;
  ItemVendorId: string;
}

export interface ItemDetail {
  ItemImageUrl: string;
  ItemName: string;
  ItemUnit: string;
  ItemQuantity: number;
  Itemkeywords: string;
  ItemIsVeg: boolean;
  ItemIngrediants: {
    value: string;
    checked: boolean;
  }[];
  ItemDesc: string;
  ItemPrice: number;
  ItemSIze: string;
  ItemItemId: string;
  ItemVendorId: string;
  ItemStatus: string;
  ItemAvailableFrom: Date;
  ItemAvailableTill: Date;
  ItemDateOfServcie: Date;
}

export interface chef {
  chefId: string;
  firstname: string;
  lastname: string;
  chefImage: string;
  chefRating: number;
  chefstatus: string;
  chefDesc: string;
}

export interface Review {
  reviewId: string;
  reviewRating: number;
  reviewDesc: string;
  rewviewTitle: string;
  reviewUserImage: string;
  reviewUserName: string;
  reviewItemId: string;
  reviewCreatedTime: any;
}

@Component({
  selector: 'app-food-detail',
  templateUrl: './food-detail.component.html',
  styleUrls: ['./food-detail.component.scss'],
})
export class FoodDetailComponent implements OnInit {
  foodDetailData: ItemDetail;
  vendorFoodData: Item[];
  reviewData: Review[];
  ratingAvg: number;
  ratingCnt: {
    rating: number;
    count: number;
    percent: number;
  }[];
  chefData: chef;
  itemId: string;
  user: any;

  constructor(
    private dialog: MatDialog,
    private toastr: ToastrService,
    private activatedRoute: ActivatedRoute,
    private vendorService: VendorService,
    private foodService: FoodService,
    private cartService: CartService,
    private router: Router,
    private authService: AuthService
  ) {
    this.foodDetailData = {} as ItemDetail;
    this.vendorFoodData = [];
    this.reviewData = [];
    this.itemId = this.activatedRoute.snapshot.paramMap.get('id') || '';
    this.ratingAvg = 0;
    this.ratingCnt = [
      { rating: 1, count: 0, percent: 0 },
      { rating: 2, count: 0, percent: 0 },
      { rating: 3, count: 0, percent: 0 },
      { rating: 4, count: 0, percent: 0 },
      { rating: 5, count: 0, percent: 0 },
    ];
    this.chefData = {} as chef;
  }

  ngOnInit(): void {
    //Reload page when param id changes
    this.activatedRoute.params.subscribe((routeParams) => {
      this.itemId = this.activatedRoute.snapshot.paramMap.get('id') || '';
      this.loadFoodDetails();
      this.loadReviewData();
    });
    //user details to hide review for guest user
    this.authService.user.subscribe((x) => {
      this.user = x;
    });
  }

  loadFoodDetails() {
    this.cartService.getItemDetails(this.itemId).subscribe((resp: any) => {
      //console.log(resp);
      this.foodDetailData.ItemItemId = resp.itemId;
      this.foodDetailData.ItemVendorId = resp.VendorVendorId;
      this.foodDetailData.ItemDesc = resp.desc;
      this.foodDetailData.ItemImageUrl = resp.imagePath;
      this.foodDetailData.ItemName = resp.itemname;
      this.foodDetailData.ItemIsVeg = resp.isVeg;
      this.foodDetailData.Itemkeywords = resp.keyword;
      this.foodDetailData.ItemPrice = resp.price;
      this.foodDetailData.ItemQuantity = resp.quantity;
      this.foodDetailData.ItemUnit = resp.unit;
      this.foodDetailData.ItemSIze = resp.size;
      this.foodDetailData.ItemIngrediants = [];
      if (resp.ingredients != null && resp.ingredients != undefined) {
        if (typeof resp.ingredients == 'string') {
          this.foodDetailData.ItemIngrediants.push({
            value: resp.ingredients,
            checked: false,
          });
        } else {
          for (let str of resp.ingredients) {
            this.foodDetailData.ItemIngrediants.push({
              value: str,
              checked: false,
            });
          }
        }
      }
      this.foodDetailData.ItemAvailableFrom = resp.availabel_from;
      this.foodDetailData.ItemAvailableTill = resp.availabel_to;
      this.foodDetailData.ItemDateOfServcie = resp.dateofservice;
      this.checkItemStatus();
      this.loadChefDetails(this.foodDetailData.ItemVendorId);
      this.loadOtherChefProducts(this.foodDetailData.ItemVendorId);
      // console.log( this.orderData);
    });
  }

  loadChefDetails(vendorId: String) {
    this.vendorService.getVendorDetails(vendorId).subscribe((resp: any) => {
      //console.log(resp);
      this.chefData.chefId = resp.vendorId;
      this.chefData.chefImage = resp.imagePath;
      this.chefData.chefRating = resp.rating;
      this.chefData.firstname = resp.firstname;
      this.chefData.lastname = resp.lastname;
      this.chefData.chefstatus = resp.status;
      this.chefData.chefDesc = resp.user_desc;
    });
  }

  loadReviewData() {
    this.foodService.getItemReviews(this.itemId).subscribe(
      (resp: any) => {
        //console.log('review : ' + resp);
        for (let review of resp) {
          if (review != null && review != undefined) {
            let currReview: Review = {
              reviewId: review.notesId,
              reviewRating:
                review.ratingscrore == undefined || review.ratingscrore == ''
                  ? 0
                  : Number(review.ratingscrore),
              reviewDesc: review.review,
              rewviewTitle: review.reviewtitle,
              reviewUserImage: review.user.imagePath,
              reviewUserName: review.user.firstname,
              reviewItemId: this.itemId,
              reviewCreatedTime: review.updated_at,
            };
            this.reviewData.push(currReview);
          }
        }
        this.calculateRating();
      },
      (err) => {
        //console.log(err.status);
        if (err.status == 404) {
        } else {
          this.toastr.error(handleError(err));
        }
      }
    );
  }

  calculateRating() {
    let sumRating = 0;
    this.reviewData.forEach((ele) => {
      sumRating += ele.reviewRating;
      if (ele.reviewRating > 0 && ele.reviewRating < 2) {
        this.ratingCnt[0].count += 1;
      } else if (ele.reviewRating >= 2 && ele.reviewRating < 3) {
        this.ratingCnt[1].count += 1;
      } else if (ele.reviewRating >= 3 && ele.reviewRating < 4) {
        this.ratingCnt[2].count += 1;
      } else if (ele.reviewRating >= 4 && ele.reviewRating < 5) {
        this.ratingCnt[3].count += 1;
      } else if (ele.reviewRating == 5) {
        this.ratingCnt[4].count += 1;
      }
    });
    this.ratingCnt.forEach((ele) => {
      ele.percent = (ele.count / this.reviewData.length) * 100;
    });
    this.ratingAvg = sumRating / this.reviewData.length;
    this.ratingAvg = Math.round(this.ratingAvg * 10) / 10;
  }

  loadOtherChefProducts(vendorId: String) {
    this.foodService.getSimilarProducts(vendorId).subscribe((resp: any) => {
      //console.log(resp);
      for (let item of resp) {
        let currItem: Item = {
          ItemImageUrl: item.imagePath,
          ItemName: item.itemname,
          ItemPrice: item.price,
          ItemItemId: item.itemId,
          ItemVendorId: item.VendorVendorId,
        };
        this.vendorFoodData.push(currItem);
      }
    });
  }

  orderNow(event: any, food: any) {
    event.stopPropagation();
    const dialogRef = this.dialog.open(PlaceOrderComponent, {
      data: { component: 'food-detail-component', data: food },
    });
    dialogRef.afterClosed().subscribe((result) => {});
  }

  navigateToChefDetail(chefId: string) {
    this.router.navigate(['/', 'foods', 'chef', chefId]);
  }

  navToFoodDetail(itemId: any) {
    // this.router
    //   .navigateByUrl('/', { skipLocationChange: true })
    //   .then(() => this.router.navigate(['/', 'foods', 'detail', itemId],{replaceUrl: true}));
    this.router.navigate(['/', 'foods', 'detail', itemId]);
  }

  checkItemStatus() {
    let currTime = new Date();
    let availableFromDT = new Date(this.foodDetailData.ItemDateOfServcie);
    let From = new Date(this.foodDetailData.ItemAvailableFrom);
    availableFromDT.setHours(From.getHours());
    availableFromDT.setMinutes(From.getMinutes());
    availableFromDT.setSeconds(From.getSeconds());
    let availableToDT = new Date(this.foodDetailData.ItemDateOfServcie);
    let Till = new Date(this.foodDetailData.ItemAvailableTill);
    availableToDT.setHours(Till.getHours());
    availableToDT.setMinutes(Till.getMinutes());
    availableToDT.setSeconds(Till.getSeconds());
    if (availableFromDT <= currTime && availableToDT >= currTime) {
      this.foodDetailData.ItemStatus = 'Active';
    } else {
      this.foodDetailData.ItemStatus = 'INActive';
    }
  }

  // Transform Date val
  transformDateVal(dateVal: any): string {
    const value = new Date(dateVal);
    if (!value) {
      return '';
    }
    let months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    return `${value.getDate()}${this.nth(value.getDate())} ${
      months[value.getMonth()]
    } ${value.getFullYear()}`;
  }

  nth(d: any) {
    if (d > 3 && d < 21) return 'th';
    switch (d % 10) {
      case 1:
        return 'st';
      case 2:
        return 'nd';
      case 3:
        return 'rd';
      default:
        return 'th';
    }
  }
}
