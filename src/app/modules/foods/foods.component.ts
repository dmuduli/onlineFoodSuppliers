import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { MatDialog } from '@angular/material/dialog';
import { PlaceOrderComponent } from './place-order/place-order.component';

import { FoodService } from '../shared/services/food.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

export interface Item {
  ItemImageUrl: string;
  ItemName: string;
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
  selector: 'app-foods',
  templateUrl: './foods.component.html',
  styleUrls: ['./foods.component.scss'],
})
export class FoodsComponent implements OnInit {
  breakfastData: Item[];
  southIndianData: Item[];
  northIndianData: Item[];
  continentalData: Item[];
  orientalData: Item[];
  beveragesData: Item[];
  mealData: Item[];
  desertsData: Item[];
  platterData: Item[];
  healthyData: Item[];
  regionalData: Item[];
  snacksData: Item[];
  // biscuitsData: Item[];
  menus: any;
  chefData: chef[];
  categories: { imgUrl: string; label: string; component: string }[];
  cuisineData: Item[];
  @ViewChild('breakfast') breakfast: any;
  @ViewChild('northIndian') northIndian: any;
  @ViewChild('southIndian') southIndian: any;
  @ViewChild('continental') continental: any;
  @ViewChild('oriental') oriental: any;
  @ViewChild('desserts') desserts: any;
  @ViewChild('beverages') beverages: any;
  @ViewChild('platter') platter: any;
  @ViewChild('healthy') healthy: any;
  @ViewChild('regional') regional: any;
  @ViewChild('snacks') snacks: any;

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
    private dialog: MatDialog,
    private foodService: FoodService,
    private toastr: ToastrService,
    private router: Router
  ) {
    this.breakfastData = [];
    this.southIndianData = [];
    this.northIndianData = [];
    this.continentalData = [];
    this.orientalData = [];
    this.chefData = [];
    this.beveragesData = [];
    this.mealData = [];
    this.desertsData = [];
    this.platterData = [];
    this.healthyData = [];
    this.regionalData = [];
    this.snacksData = [];
    // this.biscuitsData = [];
    this.categories = [
      {
        imgUrl: 'assets/images/breakfast.jpg',
        label: 'Breakfast',
        component: 'Breakfast',
      },
      {
        imgUrl: 'assets/images/northIndian.jpg',
        label: 'North Indian',
        component: 'North Indian',
      },
      {
        imgUrl: 'assets/images/southIndian.jpg',
        label: 'South Indian',
        component: 'South Indian',
      },
      {
        imgUrl: 'assets/images/continental.jpg',
        label: 'Continental',
        component: 'Continental',
      },
      {
        imgUrl: 'assets/images/oriental.jpg',
        label: 'Oriental',
        component: 'Oriental',
      },
      {
        imgUrl: 'assets/images/regional.jpg',
        label: 'Regional',
        component: 'Regional',
      },
      {
        imgUrl: 'assets/images/biscuits.jpg',
        label: 'Snacks',
        component: 'Snacks',
      },
      {
        imgUrl: 'assets/images/healthy.jpg',
        label: 'Healthy',
        component: 'Healthy',
      },
      {
        imgUrl: 'assets/images/platters.jpg',
        label: 'Platter',
        component: 'Platter',
      },
      {
        imgUrl: 'assets/images/desserts.jpg',
        label: 'Desserts',
        component: 'Dessert',
      },
      {
        imgUrl: 'assets/images/beverages.jpg',
        label: 'Beverages',
        component: 'Beverages',
      },
    ];
    this.cuisineData = [];
  }

  ngOnInit(): void {
    this.loadChefDetails();
    this.foodSubCategoryDetails();
    this.loadCuisineDetails();
  }

  foodSubCategoryDetails() {
    this.foodService.getFoodPageDetails().subscribe((resp: any) => {
      for (let item of resp.Breakfast) {
        if (item != null && item != undefined) {
          let currItem: Item = {
            ItemImageUrl: item.imagePath,
            ItemName: item.itemname,
            ItemPrice: item.price,
            ItemItemId: item.itemId,
            ItemVendorId: item.VendorVendorId,
          };
          this.breakfastData.push(currItem);
        }
      }
      for (let item of resp.Continental) {
        if (item != null && item != undefined) {
          let currItem: Item = {
            ItemImageUrl: item.imagePath,
            ItemName: item.itemname,
            ItemPrice: item.price,
            ItemItemId: item.itemId,
            ItemVendorId: item.VendorVendorId,
          };
          this.continentalData.push(currItem);
        }
      }
      for (let item of resp.Desserts) {
        if (item != null && item != undefined) {
          let currItem: Item = {
            ItemImageUrl: item.imagePath,
            ItemName: item.itemname,
            ItemPrice: item.price,
            ItemItemId: item.itemId,
            ItemVendorId: item.VendorVendorId,
          };
          this.desertsData.push(currItem);
        }
      }
      for (let item of resp.NorthIndian) {
        if (item != null && item != undefined) {
          let currItem: Item = {
            ItemImageUrl: item.imagePath,
            ItemName: item.itemname,
            ItemPrice: item.price,
            ItemItemId: item.itemId,
            ItemVendorId: item.VendorVendorId,
          };
          this.northIndianData.push(currItem);
        }
      }
      for (let item of resp.SouthIndian) {
        if (item != null && item != undefined) {
          let currItem: Item = {
            ItemImageUrl: item.imagePath,
            ItemName: item.itemname,
            ItemPrice: item.price,
            ItemItemId: item.itemId,
            ItemVendorId: item.VendorVendorId,
          };
          this.southIndianData.push(currItem);
        }
      }
      for (let item of resp.Oriental) {
        if (item != null && item != undefined) {
          let currItem: Item = {
            ItemImageUrl: item.imagePath,
            ItemName: item.itemname,
            ItemPrice: item.price,
            ItemItemId: item.itemId,
            ItemVendorId: item.VendorVendorId,
          };
          this.orientalData.push(currItem);
        }
      }
      for (let item of resp.Platter) {
        if (item != null && item != undefined) {
          let currItem: Item = {
            ItemImageUrl: item.imagePath,
            ItemName: item.itemname,
            ItemPrice: item.price,
            ItemItemId: item.itemId,
            ItemVendorId: item.VendorVendorId,
          };
          this.platterData.push(currItem);
        }
      }
      for (let item of resp.Beverages) {
        if (item != null && item != undefined) {
          let currItem: Item = {
            ItemImageUrl: item.imagePath,
            ItemName: item.itemname,
            ItemPrice: item.price,
            ItemItemId: item.itemId,
            ItemVendorId: item.VendorVendorId,
          };
          this.beveragesData.push(currItem);
        }
      }
      for (let item of resp.Regional) {
        if (item) {
          let currItem: Item = {
            ItemImageUrl: item.imagePath,
            ItemName: item.itemname,
            ItemPrice: item.price,
            ItemItemId: item.itemId,
            ItemVendorId: item.VendorVendorId,
          };
          this.regionalData.push(currItem);
        }
      }

      for (let item of resp.Healthy) {
        if (item) {
          let currItem: Item = {
            ItemImageUrl: item.imagePath,
            ItemName: item.itemname,
            ItemPrice: item.price,
            ItemItemId: item.itemId,
            ItemVendorId: item.VendorVendorId,
          };
          this.healthyData.push(currItem);
        }
      }

      for (let item of resp.Snacks) {
        if (item) {
          let currItem: Item = {
            ItemImageUrl: item.imagePath,
            ItemName: item.itemname,
            ItemPrice: item.price,
            ItemItemId: item.itemId,
            ItemVendorId: item.VendorVendorId,
          };
          this.snacksData.push(currItem);
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
            ItemImageUrl: item.imagePath,
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

  orderNow(event: any, food: any) {
    event.stopPropagation();
    const dialogRef = this.dialog.open(PlaceOrderComponent, {
      data: { component: 'foodpage-component', data: food },
    });
    dialogRef.afterClosed().subscribe((result) => {});
  }

  navigateToCategory(category: string) {
    switch (category) {
      case 'Breakfast':
        this.breakfast.nativeElement.scrollIntoView({ behavior: 'smooth' });
        break;
      case 'North Indian':
        this.northIndian.nativeElement.scrollIntoView({ behavior: 'smooth' });
        break;
      case 'South Indian':
        this.southIndian.nativeElement.scrollIntoView({ behavior: 'smooth' });
        break;
      case 'Continental':
        this.continental.nativeElement.scrollIntoView({ behavior: 'smooth' });
        break;
      case 'Oriental':
        this.oriental.nativeElement.scrollIntoView({ behavior: 'smooth' });
        break;
      case 'Deserts':
        this.desserts.nativeElement.scrollIntoView({ behavior: 'smooth' });
        break;
      case 'Beverages':
        this.beverages.nativeElement.scrollIntoView({ behavior: 'smooth' });
        break;
      case 'Platter':
        this.platter.nativeElement.scrollIntoView({ behavior: 'smooth' });
        break;

      case 'Healthy':
        this.healthy.nativeElement.scrollIntoView({ behavior: 'smooth' });
        break;

      case 'Regional':
        this.regional.nativeElement.scrollIntoView({ behavior: 'smooth' });
        break;

      case 'Snacks':
        this.snacks.nativeElement.scrollIntoView({ behavior: 'smooth' });
        break;
      default:
        this.snacks.nativeElement.scrollIntoView({ behavior: 'smooth' });
    }
  }

  navigateToSubCategory(category: string) {
    // this.router
    //   .navigateByUrl('/', { skipLocationChange: true })
    //   .then(() => this.router.navigate(['/', 'foods', 'category', category],{replaceUrl: true}));
    this.router.navigate(['/', 'foods', 'category', category]);
  }
}
