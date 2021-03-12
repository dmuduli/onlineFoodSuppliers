import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  QueryList,
  Renderer2,
  ViewChildren,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { SlidesOutputData, OwlOptions } from 'ngx-owl-carousel-o';
import { PlaceOrderComponent } from '../foods/place-order/place-order.component';
import { AuthService } from '../shared/services/auth.service';
import { CartService } from '../shared/services/cart.service';
import { FoodService } from '../shared/services/food.service';
import { OfferService } from '../shared/services/offer.service';
import { handleError } from '../shared/helpers/error-handler';

export interface Menu {
  imgUrl: string;
  label: string;
  path: string;
}

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

export interface Banner {
  bannerId: string;
  bannerImage: string;
  bannerTitle: string;
  bannerSubText: string;
  bannerDetPageUrl: string;
  bannerType: string;
  bannerTypeName: string;
  bannerTypeId: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, AfterViewInit {
  @ViewChildren('owlAnimated') owlElements!: QueryList<ElementRef>;
  @ViewChildren('owlAnimatedBottom') owlElementsBottom!: QueryList<ElementRef>;

  menus: Menu[];
  recentOrderedData: Item[];
  foodData: Item[];
  sugarSpiceData: Item[];
  topBanner: Banner[];
  bottomBanner: Banner[];
  user: any;

  customOptions: OwlOptions = {
    items: 1,
    loop: true,
    nav: false,
    dots: true,
    autoHeight: true,
    lazyLoad: true,
    autoplay: true,
    responsive: {
      0: {
        dots: false,
      },
      767: {
        dots: false,
      },
      768: {
        dots: true,
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
        items: 1,
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
        dots: true,
        items: 3,
      },
      1025: {
        nav: true,
        dots: false,
        items: 4,
      },
      1340: {
        nav: true,
        dots: false,
        items: 5,
      },
      1460: {
        nav: true,
        dots: false,
        items: 5,
      },
    },
  };

  constructor(
    private renderer: Renderer2,
    private router: Router,
    private dialog: MatDialog,
    private toastrService: ToastrService,
    private authService: AuthService,
    private cartService: CartService,
    private foodService: FoodService,
    private offerService: OfferService
  ) {
    this.authService.setHeaderDisplayStatus(false);
    this.cartService.getCartCountAPIResp();
    this.menus = [
      {
        imgUrl: 'assets/images/home_cat_food.jpg',
        label: 'Food',
        path: 'foods',
      },
      {
        imgUrl: 'assets/images/home_cat_sugar&spice.jpg',
        label: 'Sugar & Spices',
        path: 'sugar-spice',
      },
      {
        imgUrl: 'assets/images/home_cat_homedecor.jpg',
        label: 'Home Decor',
        path: 'home-decor',
      },
      {
        imgUrl: 'assets/images/home_cat_fashion.jpg',
        label: 'Fashion',
        path: 'fashion',
      },
      {
        imgUrl: 'assets/images/home_cat_bath&beauty.jpg',
        label: 'Plants & Planters',
        path: 'plants',
      },
    ];

    this.recentOrderedData = [];

    this.foodData = [];

    this.sugarSpiceData = [];

    this.topBanner = [];

    this.bottomBanner = [];
  }

  ngOnInit(): void {
    this.loadRecentOrderedItems();
    this.loadFoodDetails();
    this.loadSugarDetails();
    this.loadTopBannerData();
    this.loadBottomBannerData();
    this.authService.user.subscribe((x) => {
      this.user = x;
    });
  }

  ngAfterViewInit(): void {}

  onSlideTransition(data: SlidesOutputData) {
    const currentIndex = data.startPosition;
    this.owlElements.forEach((element: any) => {
      this.renderer.removeClass(element.nativeElement, 'is-transitioned');
      if (currentIndex === 0 && element.nativeElement.id == 'owlAnimated1') {
        this.renderer.addClass(element.nativeElement, 'is-transitioned');
      } else if (
        currentIndex === 1 &&
        element.nativeElement.id == 'owlAnimated2'
      ) {
        this.renderer.addClass(element.nativeElement, 'is-transitioned');
      } else if (
        currentIndex === 2 &&
        element.nativeElement.id == 'owlAnimated3'
      ) {
        this.renderer.addClass(element.nativeElement, 'is-transitioned');
      } else if (
        currentIndex === 3 &&
        element.nativeElement.id == 'owlAnimated4'
      ) {
        this.renderer.addClass(element.nativeElement, 'is-transitioned');
      } else if (
        currentIndex === 4 &&
        element.nativeElement.id == 'owlAnimated5'
      ) {
        this.renderer.addClass(element.nativeElement, 'is-transitioned');
      }
    });
  }

  onCarouselInitialized(data: SlidesOutputData) {
    setTimeout(() => {
      this.owlElements.forEach((element: any) => {
        if (element.nativeElement.id == 'owlAnimated1') {
          this.renderer.addClass(element.nativeElement, 'is-transitioned');
          // console.log(element);
        }
      });
    }, 200);
  }

  onSlideTransitionInBottom(data: SlidesOutputData) {
    const currentIndex = data.startPosition;
    this.owlElementsBottom.forEach((element: any) => {
      this.renderer.removeClass(element.nativeElement, 'is-transitioned');
      if (currentIndex === 0 && element.nativeElement.id == 'owlAnimated1') {
        this.renderer.addClass(element.nativeElement, 'is-transitioned');
      } else if (
        currentIndex === 1 &&
        element.nativeElement.id == 'owlAnimated2'
      ) {
        this.renderer.addClass(element.nativeElement, 'is-transitioned');
      }
    });
  }

  onCarouselInitializedInBottom(data: SlidesOutputData) {
    setTimeout(() => {
      this.owlElementsBottom.forEach((element: any) => {
        if (element.nativeElement.id == 'owlAnimated1') {
          this.renderer.addClass(element.nativeElement, 'is-transitioned');
          // console.log(element);
        }
      });
    }, 200);
  }

  navigateToComponent(path: string) {
    this.router.navigate(['/', path]);
  }

  loadRecentOrderedItems() {
    this.recentOrderedData = [];
    this.cartService.getRecentOrderedItems().subscribe((resp: any) => {
      for (let item of resp) {
        if (item) {
          let currItem = {
            ItemImageUrl: item.imagePath,
            ItemName: item.itemname,
            ItemPrice: item.price,
            ItemItemId: item.itemId,
            ItemVendorId: item.VendorVendorId,
          };
          this.recentOrderedData.push(currItem);
        }

        this.recentOrderedData = this.recentOrderedData.filter(
          (obj, index, arr) =>
            arr.findIndex((data) => data.ItemName === obj.ItemName) === index
        );
      }
    });
  }

  loadFoodDetails() {
    this.foodService.getFoodItemsForHomePage('food').subscribe((resp: any) => {
      //console.log('food : ' + JSON.stringify(resp));
      for (let item of resp) {
        if (item != null && item != undefined) {
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

  loadSugarDetails() {
    this.foodService
      .getFoodItemsForHomePage('sugerandspices')
      .subscribe((resp: any) => {
        for (let item of resp) {
          if (item) {
            let currItem = {
              ItemImageUrl: item.imagePath,
              ItemName: item.itemname,
              ItemPrice: item.price,
              ItemItemId: item.itemId,
              ItemVendorId: item.VendorVendorId,
            };
            this.sugarSpiceData.push(currItem);
          }
        }
      });
  }

  loadTopBannerData() {
    this.offerService.getTopBannerDetails().subscribe(
      (resp: any) => {
        // console.log(resp);
        if (resp && resp.length) {
          resp.forEach((element: any) => {
            let bannerItem = {
              bannerId: '',
              bannerImage: element.bannerurl,
              bannerTitle: element.bannerTitle,
              bannerSubText: element.bannerDesc,
              bannerDetPageUrl: '',
              bannerType: element.bannerCategory,
              bannerTypeName: element.bannerDetCategoryname,
              bannerTypeId: element.bannerDetCategoryId,
            };
            if (bannerItem.bannerType == 'cuisine' && bannerItem.bannerTypeId) {
              bannerItem.bannerDetPageUrl = bannerItem.bannerTypeId;
            } else if (
              bannerItem.bannerType == 'subcategory' &&
              bannerItem.bannerTypeName
            ) {
              bannerItem.bannerDetPageUrl = bannerItem.bannerTypeName;
            } else if (
              bannerItem.bannerType == 'food' &&
              bannerItem.bannerTypeId
            ) {
              bannerItem.bannerDetPageUrl = bannerItem.bannerTypeId;
            }
            this.topBanner.push(bannerItem);
          });
          // console.log( this.topBanner);
        }
      },
      (error: any) => {
        this.toastrService.error(handleError(error));
      }
    );
  }

  loadBottomBannerData() {
    this.offerService.getBottomBannerDetails().subscribe(
      (resp: any) => {
        // console.log(resp);
        if (resp && resp.length) {
          resp.forEach((element: any) => {
            let bannerItem = {
              bannerId: '',
              bannerImage: element.bannerurl,
              bannerTitle: element.bannerTitle,
              bannerSubText: element.bannerDesc,
              bannerDetPageUrl: '',
              bannerType: element.bannerCategory,
              bannerTypeName: element.bannerDetCategoryname,
              bannerTypeId: element.bannerDetCategoryId,
            };
            if (bannerItem.bannerType == 'cuisine' && bannerItem.bannerTypeId) {
              bannerItem.bannerDetPageUrl =
                'foods/category-detail/' + bannerItem.bannerTypeId;
            } else if (
              bannerItem.bannerType == 'subcategory' &&
              bannerItem.bannerTypeName
            ) {
              bannerItem.bannerDetPageUrl =
                'foods/category' + bannerItem.bannerTypeName;
            }
            this.bottomBanner.push(bannerItem);
          });
          // console.log( this.topBanner);
        }
      },
      (error: any) => {
        this.toastrService.error(handleError(error));
      }
    );
  }

  orderNow(event: any, food: any) {
    event.stopPropagation();
    const dialogRef = this.dialog.open(PlaceOrderComponent, {
      data: { component: 'dashboard-component', data: food },
    });
    dialogRef.afterClosed().subscribe((result) => {});
  }

  navigateToCategory(category: string, type: string) {
    //console.log(category);
    if (type === 'subcategory') {
      // this.router
      //   .navigateByUrl('/', { skipLocationChange: true })
      //   .then(() => this.router.navigate(['/', 'foods', 'category', category],{replaceUrl: true}));
      this.router.navigate(['/', 'foods', 'category', category]);
    } else if (type === 'cuisine') {
      // this.router
      //   .navigateByUrl('/', { skipLocationChange: true })
      //   .then(() =>
      //     this.router.navigate(['/', 'foods', 'category-detail', category],{replaceUrl: true})
      //   );
      this.router.navigate(['/', 'foods', 'category-detail', category]);
    } else if (type === 'food') {
      this.router.navigate(['/', 'foods', 'detail', category]);
    }
  }
}
