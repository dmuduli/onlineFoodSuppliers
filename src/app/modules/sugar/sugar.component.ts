import { Component, OnInit, ViewChild } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { MatDialog } from '@angular/material/dialog';
import { PlaceOrderComponent } from './../foods/place-order/place-order.component';

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
  selector: 'app-sugar',
  templateUrl: './sugar.component.html',
  styleUrls: ['./sugar.component.scss'],
})
export class SugarComponent implements OnInit {
  bakeryData: Item[];
  chocolateData: Item[];
  savoriesData: Item[];
  jamAndSpreadsData: Item[];
  spicesPicklesData: Item[];
  menus: any;
  chefData: chef[];
  categories: { imgUrl: string; label: string; component: string }[];
  cuisineData: Item[];
  @ViewChild('bakeryItems') bakeryItems: any;
  @ViewChild('chocolates') chocolates: any;
  @ViewChild('savories') savories: any;
  @ViewChild('jamAndSpread') jamAndSpread: any;
  @ViewChild('spiceAndPickle') spiceAndPickle: any;

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
        dots: true,
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
        stagePadding: 30,
        margin: 15,
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
    this.bakeryData = [];
    this.chocolateData = [];
    this.savoriesData = [];
    this.jamAndSpreadsData = [];
    this.spicesPicklesData = [];
    this.chefData = [];
    this.categories = [
      {
        imgUrl: 'assets/images/backeryItems.jpeg',
        label: 'Bakery Items',
        component: 'Bakery Items',
      },
      {
        imgUrl: 'assets/images/chocolates.jpg',
        label: 'Chocolates',
        component: 'Chocolates',
      },
      {
        imgUrl: 'assets/images/savories.jpg',
        label: 'Savories',
        component: 'Savories',
      },
      {
        imgUrl: 'assets/images/jams.jpg',
        label: 'Jams & Spreads',
        component: 'Jams & Spreads',
      },
      {
        imgUrl: 'assets/images/pickles.jpg',
        label: 'Spices & Pickles',
        component: 'Spices & Pickles',
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
    this.foodService.getSugarPageDetails().subscribe((resp: any) => {
      //console.log(resp);
      for (let item of resp.BakeryItems) {
        if (item) {
          let currItem: Item = {
            ItemImageUrl: item.imagePath,
            ItemName: item.itemname,
            ItemPrice: item.price,
            ItemItemId: item.itemId,
            ItemVendorId: item.VendorVendorId,
          };
          this.bakeryData.push(currItem);
        }
      }
      for (let item of resp.Chocolates) {
        if (item) {
          let currItem: Item = {
            ItemImageUrl: item.imagePath,
            ItemName: item.itemname,
            ItemPrice: item.price,
            ItemItemId: item.itemId,
            ItemVendorId: item.VendorVendorId,
          };
          this.chocolateData.push(currItem);
        }
      }
      for (let item of resp.Savories) {
        if (item) {
          let currItem: Item = {
            ItemImageUrl: item.imagePath,
            ItemName: item.itemname,
            ItemPrice: item.price,
            ItemItemId: item.itemId,
            ItemVendorId: item.VendorVendorId,
          };
          this.savoriesData.push(currItem);
        }
      }
      for (let item of resp.JamsSpreads) {
        if (item) {
          let currItem: Item = {
            ItemImageUrl: item.imagePath,
            ItemName: item.itemname,
            ItemPrice: item.price,
            ItemItemId: item.itemId,
            ItemVendorId: item.VendorVendorId,
          };
          this.jamAndSpreadsData.push(currItem);
        }
      }
      for (let item of resp.SpicesPickles) {
        if (item) {
          let currItem: Item = {
            ItemImageUrl: item.imagePath,
            ItemName: item.itemname,
            ItemPrice: item.price,
            ItemItemId: item.itemId,
            ItemVendorId: item.VendorVendorId,
          };
          this.spicesPicklesData.push(currItem);
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
      //console.log(resp);
      for (let item of resp) {
        if (item != null && item != undefined) {
          let currItem = {
            ItemImageUrl: item.imagePath,
            ItemName: item.itemname,
            // ItemUnit : item.unit,
            // ItemQuantity : 1,
            // ItemIsVeg : item.isVeg,
            // ItemIngrediants : item.ingredients !=null ? item.ingredients.split(',') : '',
            // ItemDesc : item.desc,
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
      case 'Backery Items':
        this.bakeryItems.nativeElement.scrollIntoView({ behavior: 'smooth' });
        break;
      case 'Chocolates':
        this.chocolates.nativeElement.scrollIntoView({ behavior: 'smooth' });
        break;
      case 'Savories':
        this.savories.nativeElement.scrollIntoView({ behavior: 'smooth' });
        break;
      case 'Jams & Spreads':
        this.jamAndSpread.nativeElement.scrollIntoView({ behavior: 'smooth' });
        break;
      case 'Spices & Pickles':
        this.spiceAndPickle.nativeElement.scrollIntoView({
          behavior: 'smooth',
        });
        break;
      default:
        this.spiceAndPickle.nativeElement.scrollIntoView({
          behavior: 'smooth',
        });
    }
  }

  navigateToSubCategory(category: string) {
    // this.router
    //   .navigateByUrl('/', { skipLocationChange: true })
    //   .then(() => this.router.navigate(['/', 'foods', 'category', category],{replaceUrl: true}));
    this.router.navigate(['/', 'foods', 'category', category]);
  }
}
