import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { VendorService } from '../../shared/services/vendor.service';
import { FoodService } from '../../shared/services/food.service';
import { CartService } from '../../shared/services/cart.service';

@Component({
  selector: 'app-leave-review',
  templateUrl: './leave-review.component.html',
  styleUrls: ['./leave-review.component.scss'],
})
export class LeaveReviewComponent implements OnInit {
  rating: number;
  reviewTitle: string;
  reviewText: string;
  isConfirmed: boolean;
  itemId: string;
  vendorId: string;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private foodService: FoodService,
    private vendorService: VendorService,
    private toastr: ToastrService,
    private cartService: CartService
  ) {
    this.reviewText = '';
    this.reviewTitle = '';
    this.itemId = '';
    this.vendorId = '';
    this.rating = 1;
    this.isConfirmed = false;
  }

  ngOnInit(): void {
    this.itemId = this.activatedRoute.snapshot.paramMap.get('itemId') || '';
    this.vendorId = this.activatedRoute.snapshot.paramMap.get('vendorId') || '';
    this.loadFoodDetails();
  }

  loadFoodDetails() {
    this.cartService.getItemDetails(this.itemId).subscribe((resp: any) => {
      this.reviewTitle = resp.itemname;
    });
  }

  onSubmit() {
    if (!this.reviewTitle || !this.reviewText) {
      this.toastr.error('Please enter review title and desc', 'Error!!');
      return false;
    }
    if (!this.isConfirmed) {
      this.toastr.error('Please confirm your acknowledgement', 'Error!!');
      return false;
    }
    if (this.itemId == 'chef') {
      this.vendorService
        .submitChefReview(
          this.reviewText,
          this.reviewTitle,
          this.rating,
          this.vendorId
        )
        .subscribe((resp: any) => {
          //console.log(resp);
          this.router.navigateByUrl('/foods/chef/' + this.vendorId);
        });
    } else {
      this.foodService
        .submitItemReview(
          this.itemId,
          this.reviewText,
          this.reviewTitle,
          this.rating,
          this.vendorId
        )
        .subscribe((resp: any) => {
          //console.log(resp);
          this.router.navigateByUrl('/foods/detail/' + this.itemId);
        });
    }
    return false;
  }
}
