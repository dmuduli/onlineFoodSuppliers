import { Component, OnInit } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { FoodService } from '../../shared/services/food.service';
import { PlaceOrderComponent } from '../place-order/place-order.component';

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
  selector: 'app-food-beverages',
  templateUrl: './food-beverages.component.html',
  styleUrls: ['./food-beverages.component.scss'],
})
export class FoodBeveragesComponent implements OnInit {
  foodData: Item[];
  chefData: chef[];
  cuisineData: Item[];
  newlyAdded: Item[];
  bestSellers: Item[];
  recommendations: Item[];

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
        items: 6,
      },
      1440: {
        nav: true,
        dots: false,
        items: 6,
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
    lazyLoad: true,
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
    private toastr: ToastrService
  ) {
    this.foodData = [];
    this.chefData = [];
    this.cuisineData = [];
    this.bestSellers = [];
    this.newlyAdded = [];
    this.recommendations = [];
  }

  ngOnInit(): void {
    this.loadfoodDetails();
    this.loadChefDetails();
    this.loadCuisineDetails();
  }

  loadfoodDetails() {
    this.foodService
      .getItemSubCategoryDetails('food', 'Beverages')
      .subscribe((resp: any) => {
        //  this.foodService.getItemDetailsInBulk(resp).subscribe(
        //    (val : any) => {
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
            this.foodData.push(currItem);
          }
        }
        //    }
        //  );
      });
  }

  loadChefDetails() {
    this.foodService.getChefsNearUserLocation().subscribe((resp: any) => {
      // console.log(resp);
      for (let chef of resp) {
        let chefItem = {
          chefId: chef.vendorId,
          firstname: chef.firstname,
          lastname: chef.lastname,
          chefImage: chef.imagePath,
          chefRating: chef.rating,
        };
        this.chefData.push(chefItem);
      }
    });
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

  orderNow(event: any, food: any): boolean {
    event.stopPropagation();
    const dialogRef = this.dialog.open(PlaceOrderComponent, {
      data: { component: 'breakfast-component', data: food },
    });
    dialogRef.afterClosed().subscribe((result) => {});
    return false;
  }
}
