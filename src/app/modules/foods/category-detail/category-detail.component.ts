import { Component, OnInit } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { FoodService } from '../../shared/services/food.service';
import { PlaceOrderComponent } from '../place-order/place-order.component';
import { isNgTemplate } from '@angular/compiler';
import { ActivatedRoute, Router } from '@angular/router';
import { handleError } from '../../shared/helpers/error-handler';
import { from, zip } from 'rxjs';

export interface Item {
  ItemImageUrl: string;
  ItemName: string;
  // ItemUnit : String,
  // ItemQuantity : number,
  // ItemIsVeg : boolean,
  // ItemIngrediants : String[],
  // ItemDesc : String,
  ItemPrice: number;
  ItemItemId: String;
  ItemVendorId: string;
}

export interface chef {
  chefId: string;
  firstname: string;
  lastname: string;
  chefImage: string;
  chefRating: number;
}

@Component({
  selector: 'app-category-detail',
  templateUrl: './category-detail.component.html',
  styleUrls: ['./category-detail.component.scss'],
})
export class CategoryDetailComponent implements OnInit {
  foodData: Item[];
  chefData: chef[];
  cuisineData: Item[];
  newlyAdded: Item[];
  bestSellers: Item[];
  recommendations: Item[];
  category: any;

  customOptions: OwlOptions = {
    center: false,
    stagePadding: 50,
    items: 1,
    loop: false,
    margin: 15,
    dots: false,
    nav: true,
    //lazyLoad: true,
    navText: ["<i class='arrow_left'></i>", "<i class='arrow_right'></i>"],
    responsive: {
      0: {
        nav: false,
        dots: false,
        items: 1,
        stagePadding: 30,
      },
      600: {
        nav: false,
        dots: false,
        items: 2,
      },
      1025: {
        nav: true,
        dots: false,
        items: 3,
      },
      1280: {
        nav: true,
        dots: false,
        items: 5,
      },
      1440: {
        nav: true,
        dots: false,
        items: 5,
      },
    },
  };
  customOptionsTwo: OwlOptions = {
    center: false,
    stagePadding: 50,
    items: 1,
    loop: false,
    margin: 30,
    dots: false,
    nav: true,
    //lazyLoad: true,
    navText: ["<i class='arrow_left'></i>", "<i class='arrow_right'></i>"],
    responsive: {
      0: {
        nav: false,
        dots: false,
        items: 2,
        margin: 15,
        stagePadding: 30,
      },
      600: {
        nav: false,
        dots: false,
        items: 2,
        margin: 10,
      },
      768: {
        nav: false,
        dots: false,
        items: 3,
      },
      1024: {
        nav: true,
        dots: false,
        items: 4,
      },
      1281: {
        nav: true,
        dots: false,
        items: 6,
      },
      1340: {
        nav: true,
        dots: false,
        items: 6,
      },
    },
  };

  constructor(
    private foodService: FoodService,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.foodData = [];
    this.chefData = [];
    this.cuisineData = [];
    this.bestSellers = [];
    this.newlyAdded = [];
    this.recommendations = [];
    this.category = this.route.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    this.route.params.subscribe(routeParams => {
      this.category = this.route.snapshot.paramMap.get('id');
      this.loadfoodDetails();
      this.loadCuisineDetails();
    });
  }

  getRecentAndBest() {
    const recentItems$ = from(
      this.foodService.getRecentItems(this.category, 1)
    );
    const besSellers$ = from(this.foodService.getBestSellerItems());

    const recentAndBest = zip(recentItems$, besSellers$);
    recentAndBest.subscribe(
      ([recent, best]) => {
        this.bestSellers = [];
        // console.log(recent, best);
        if (best && best.length > 0) {
          for (let item of best) {
            let currItem = {
              ItemImageUrl: item.imagePath,
              ItemName: item.itemname,
              ItemPrice: item.price,
              ItemItemId: item.itemId,
              ItemVendorId: item.VendorVendorId,
            };
            this.bestSellers.push(currItem);
          }
        }

        if ('rows' in recent && recent.rows.length) {
          this.newlyAdded = [];
          const recentItems = recent.rows.map((val: any) => val.item);
          for (let item of recentItems) {
            let currItem = {
              ItemImageUrl: item.imagePath,
              ItemName: item.itemname,
              ItemPrice: item.price,
              ItemItemId: item.itemId,
              ItemVendorId: item.VendorVendorId,
            };
            this.newlyAdded.push(currItem);
          }
        }
      },
      (err) => {
        this.toastr.error(handleError(err));
      }
    );
  }

  loadfoodDetails() {
    this.foodService
      .getItemSubCategoryDetails('food', this.category)
      .subscribe((resp: any) => {
        //console.log(resp);
        if (resp != null && resp != undefined && resp.length > 0) {
          for (let item of resp) {
            let currItem = {
              ItemImageUrl: item.imagePath,
              ItemName: item.itemname,
              ItemPrice: item.price,
              ItemItemId: item.itemId,
              ItemVendorId: item.VendorVendorId,
            };
            this.foodData.push(currItem);
          }
        }
      });
  }

  loadChefDetails() {
    this.foodService.getChefsNearUserLocation().subscribe((resp: any) => {
      for (let chef of resp) {
        let chefItem = {
          chefId: chef.vendorId,
          firstname: chef.firstname,
          lastname: chef.lastname,
          chefImage: chef.imagePath,
          chefRating: this.calculateRating(chef.reviews),
        };
        this.chefData.push(chefItem);
      }
    });
  }

  calculateRating(reviews: any[]) {
    if (reviews && reviews.length) {
      const rating =
        reviews
          .map((review) => Number(review.ratingscrore))
          .reduce((accumulator, currentValue) => accumulator + currentValue) /
        reviews.length;
      return rating;
    }
    return 0;
  }

  loadCuisineDetails() {
    this.foodService.getCuisineNearUserLocation().subscribe((resp: any) => {
      for (let item of resp) {
        if (item != null && item != undefined) {
          let currItem = {
            ItemImageUrl:
              'item' in item && item.item ? item.item.imagePath : '',
            ItemName: item.itemname,
            ItemPrice: item.price,
            ItemItemId: item.itemId,
            ItemVendorId: item.VendorVendorId,
          };
          this.cuisineData.push(currItem);
        }
      }
    });
  }

  orderNow(event: any, food: any): boolean {
    event.stopPropagation();
    const dialogRef = this.dialog.open(PlaceOrderComponent, {
      data: { component: 'breakfast-component', data: food },
    });
    dialogRef.afterClosed().subscribe((result) => {});
    return false;
  }

  navigateToCuisine(name: string) {
    // this.router
    //   .navigateByUrl('/', { skipLocationChange: true })
    //   .then(() =>
    //     this.router.navigate(['/', 'foods', 'category-detail', name],{replaceUrl: true})
    //   );
    this.router.navigate(['/', 'foods', 'category-detail', name]);
  }
}
