import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { VendorService } from '../../shared/services/vendor.service';
import { AuthService } from '../../shared/services/auth.service';
import { PlaceOrderComponent } from '../place-order/place-order.component';
import { handleError } from '../../shared/helpers/error-handler';

export interface Chef {
  imgUrl: string;
  reviews: number;
  rating: number;
  name: string;
  type: string;
  about: string;
}

export interface menus {
  type: string;
  menu: {
    id: String;
    ItemItemId: string;
    name: string;
    description: string;
    price: number;
    imgUrl: string;
  }[];
}

export interface Review {
  reviewId: String;
  reviewRating: number;
  reviewDesc: String;
  rewviewTitle: String;
  reviewUserImage: String;
  reviewUserName: String;
  reviewVendorId: String;
  reviewCreatedTime: Date;
}

@Component({
  selector: 'app-chef-detail',
  templateUrl: './chef-detail.component.html',
  styleUrls: ['./chef-detail.component.scss'],
})
export class ChefDetailComponent implements OnInit {
  chef: Chef;
  menus: menus[];
  reviewData: Review[];
  ratingAvg: number;
  ratingCnt: {
    rating: number;
    count: number;
    percent: number;
  }[];
  vendorId: string;
  ratingCmt: string;
  user:any;

  constructor(
    private vendor: VendorService,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private vendorService: VendorService,
    private authService : AuthService,
    private activatedRoute: ActivatedRoute
  ) {
    this.chef = {} as Chef;

    this.menus = [];

    this.reviewData = [];
    this.ratingAvg = 0;
    this.ratingCnt = [
      { rating: 1, count: 0, percent: 0 },
      { rating: 2, count: 0, percent: 0 },
      { rating: 3, count: 0, percent: 0 },
      { rating: 4, count: 0, percent: 0 },
      { rating: 5, count: 0, percent: 0 },
    ];
    this.ratingCmt = '';
    this.vendorId = '';
  }

  ngOnInit(): void {
    this.loadVendorDetails();
    this.loadVendorMneuDetails();
    this.loadReviewData();
    //hide review for guest user
    this.authService.user.subscribe((x)=>{
      this.user =x;
    })
  }

  loadReviewData() {
    this.vendorService.getChefReviews(this.vendorId).subscribe(
      (resp: any) => {
        //console.log('review : ' + JSON.stringify(resp));
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
              reviewVendorId: this.vendorId,
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
    if (this.ratingAvg > 4) {
      this.ratingCmt = 'Superb';
    } else if (this.ratingAvg > 2) {
      this.ratingCmt = 'Good';
    } else {
      this.ratingCmt = '';
    }
  }

  loadVendorDetails() {
    this.vendorId = this.activatedRoute.snapshot.paramMap.get('id') || '';
    this.vendor.getVendorDetails(this.vendorId).subscribe((resp: any) => {
      this.chef.imgUrl = resp.imagePath;
      this.chef.name = resp.firstname;
      this.chef.about = resp.user_desc;
      this.chef.rating =
        resp.rating == '' || resp.rating == undefined ? 0 : resp.rating;
      this.chef.reviews = this.reviewData.length;
      this.chef.type = resp.signup_type;
    });
  }

  loadVendorMneuDetails() {
    this.vendor
      .getVendorMenuItemDetails(this.vendorId)
      .subscribe((resp: any) => {
        let menu: {
          id: string;
          ItemItemId: string;
          name: string;
          description: string;
          price: number;
          imgUrl: string;
        }[] = [];
        let type = 'Starters';
        if (resp.length) {
          for (
            let i = 0;
            i <= Math.floor(resp.length / 2) && i < resp.length;
            i++
          ) {
            menu.push({
              id: (i + 1).toString(),
              ItemItemId: resp[i].itemId,
              name: resp[i].itemname,
              description: resp[i].desc,
              price: Number(resp[i].price),
              imgUrl: resp[i].imagePath,
            });
          }
          this.menus.push({ type: type, menu });
          type = 'Main Courses';
          menu = [];
          for (let i = Math.floor(resp.length / 2) + 1; i < resp.length; i++) {
            menu.push({
              id: (i + 1).toString(),
              ItemItemId: resp[i].itemId,
              name: resp[i].itemname,
              description: resp[i].desc,
              price: Number(resp[i].price),
              imgUrl: resp[i].imagePath,
            });
          }
          this.menus.push({ type: type, menu });
        }
      });
  }

  orderNow(event: any, food: any) {
    event.stopPropagation();
    const dialogRef = this.dialog.open(PlaceOrderComponent, {
      data: { component: 'food-detail-component', data: food },
    });
    dialogRef.afterClosed().subscribe((result) => {});
    return false;
  }
}
